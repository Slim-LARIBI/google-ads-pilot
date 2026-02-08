import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

type PageResult = {
  url: string;
  status: number;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  loadTimeMs: number;
};

function normalizeUrl(input: string) {
  let u = input.trim();
  if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'https://' + u;
  return u;
}

async function fetchHtml(url: string) {
  const start = Date.now();
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      // evite certains blocages basiques
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari',
      Accept: 'text/html,application/xhtml+xml',
    },
  });
  const loadTimeMs = Date.now() - start;
  const html = await res.text();
  return { status: res.status, html, loadTimeMs };
}

function extractLinks(baseUrl: string, html: string) {
  const $ = cheerio.load(html);
  const links = new Set<string>();

  $('a[href]').each((_, a) => {
    const href = ($(a).attr('href') || '').trim();
    if (!href) return;

    // ignore anchors / mail / tel / js
    if (href.startsWith('#')) return;
    if (href.startsWith('mailto:')) return;
    if (href.startsWith('tel:')) return;
    if (href.startsWith('javascript:')) return;

    try {
      const abs = new URL(href, baseUrl).toString();
      // garde uniquement le même domaine
      const base = new URL(baseUrl);
      const u = new URL(abs);
      if (u.hostname === base.hostname) {
        // enlève les paramètres pour limiter les doublons
        u.search = '';
        u.hash = '';
        links.add(u.toString());
      }
    } catch {
      // ignore invalid urls
    }
  });

  return Array.from(links);
}

function parseSeo(url: string, status: number, html: string, loadTimeMs: number): PageResult {
  const $ = cheerio.load(html);

  const title = $('title').first().text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() || null;
  const h1 = $('h1').first().text().trim() || null;

  return { url, status, title, metaDescription, h1, loadTimeMs };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const targetUrl = normalizeUrl(body?.url || '');

    if (!targetUrl) {
      return NextResponse.json({ error: 'URL manquante' }, { status: 400 });
    }

    const maxPages = Math.min(Number(body?.maxPages || 10), 25);

    // 1) page principale
    const root = await fetchHtml(targetUrl);
    const rootParsed = parseSeo(targetUrl, root.status, root.html, root.loadTimeMs);

    // 2) quelques URLs internes (crawl léger)
    const links = extractLinks(targetUrl, root.html)
      .filter((u) => u !== targetUrl)
      .slice(0, Math.max(0, maxPages - 1));

    const results: PageResult[] = [rootParsed];

    for (const link of links) {
      try {
        const r = await fetchHtml(link);
        results.push(parseSeo(link, r.status, r.html, r.loadTimeMs));
      } catch {
        results.push({
          url: link,
          status: 0,
          title: null,
          metaDescription: null,
          h1: null,
          loadTimeMs: 0,
        });
      }
    }

    // KPIs + Issues simples (MVP)
    const pagesCrawled = results.length;
    const missingTitle = results.filter((p) => !p.title).length;
    const missingMeta = results.filter((p) => !p.metaDescription).length;
    const missingH1 = results.filter((p) => !p.h1).length;
    const slowPages = results.filter((p) => p.loadTimeMs >= 3000).length;
    const brokenPages = results.filter((p) => p.status >= 400 || p.status === 0).length;

    const issues = [
      { key: 'missing_meta', label: 'Missing Meta Descriptions', priority: 'P0', count: missingMeta },
      { key: 'broken', label: 'Broken / Non-200 Pages', priority: 'P0', count: brokenPages },
      { key: 'slow', label: 'Slow Page Load Times (>=3s)', priority: 'P1', count: slowPages },
      { key: 'missing_title', label: 'Missing Title Tags', priority: 'P1', count: missingTitle },
      { key: 'missing_h1', label: 'Missing H1', priority: 'P2', count: missingH1 },
    ].filter((i) => i.count > 0);

    const score = Math.max(
      0,
      100 -
        missingMeta * 2 -
        missingTitle * 2 -
        missingH1 * 1 -
        slowPages * 2 -
        brokenPages * 5
    );

    return NextResponse.json({
      meta: {
        scannedAt: new Date().toISOString(),
        targetUrl,
        maxPages,
      },
      kpis: {
        pagesCrawled,
        criticalIssues: issues.filter((i) => i.priority === 'P0').reduce((a, b) => a + b.count, 0),
        warnings: issues.filter((i) => i.priority !== 'P0').reduce((a, b) => a + b.count, 0),
        slowPages,
        healthScore: score,
      },
      issues,
      pages: results,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}