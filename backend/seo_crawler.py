# backend/seo_crawler.py
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Set, Tuple, Optional
from urllib.parse import urlparse, urljoin, urldefrag

import re
import time
import httpx
from bs4 import BeautifulSoup


def normalize_target_url(raw: str) -> str:
    raw = (raw or "").strip()
    if not raw:
        raise ValueError("URL vide")

    # Si l'utilisateur tape "laribislim.com" -> https://laribislim.com
    if not re.match(r"^https?://", raw, re.I):
        raw = "https://" + raw

    u = urlparse(raw)
    if not u.netloc:
        raise ValueError("URL invalide (netloc manquant)")

    # Remove fragment
    raw, _ = urldefrag(raw)
    return raw


def is_http_url(href: str) -> bool:
    if not href:
        return False
    href = href.strip().lower()
    return not (
        href.startswith("mailto:")
        or href.startswith("tel:")
        or href.startswith("javascript:")
        or href.startswith("#")
    )


def same_host(a: str, b: str) -> bool:
    return urlparse(a).netloc == urlparse(b).netloc


def extract_text_words(soup: BeautifulSoup) -> int:
    # Enlève scripts/styles
    for tag in soup(["script", "style", "noscript"]):
        tag.extract()
    text = soup.get_text(" ", strip=True)
    # Word count simple
    words = re.findall(r"\b[\wÀ-ÿ'-]+\b", text)
    return len(words)


@dataclass
class PageAnalysis:
    url: str
    title: str
    meta_description: str
    h1_count: int
    word_count: int
    internal_links: List[str]


def analyze_html(page_url: str, html: str) -> PageAnalysis:
    soup = BeautifulSoup(html, "lxml")

    title = (soup.title.get_text(strip=True) if soup.title else "").strip()

    meta_desc = ""
    md = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    if md and md.get("content"):
        meta_desc = str(md.get("content")).strip()

    h1_count = len(soup.find_all("h1"))
    word_count = extract_text_words(soup)

    links = []
    for a in soup.find_all("a"):
        href = a.get("href")
        if not href or not is_http_url(href):
            continue

        abs_url = urljoin(page_url, href)
        abs_url, _ = urldefrag(abs_url)

        # Normalisation légère
        abs_url = abs_url.strip()

        links.append(abs_url)

    # Garde uniquement internes
    internal_links = [u for u in links if same_host(u, page_url)]
    # Dédupe en gardant l'ordre
    seen = set()
    uniq = []
    for u in internal_links:
        if u not in seen:
            uniq.append(u)
            seen.add(u)

    return PageAnalysis(
        url=page_url,
        title=title,
        meta_description=meta_desc,
        h1_count=h1_count,
        word_count=word_count,
        internal_links=uniq,
    )


def compute_health_score(
    missing_meta: int,
    broken_links: int,
    duplicate_titles_groups: int,
    thin_pages: int,
    missing_h1_pages: int,
) -> Tuple[int, str]:
    # Score simple mais cohérent (tu ajusteras après)
    score = 100
    score -= missing_meta * 5
    score -= broken_links * 10
    score -= duplicate_titles_groups * 3
    score -= thin_pages * 2
    score -= missing_h1_pages * 2

    score = max(0, min(100, score))

    # Main issue = le plus "grave" en poids total
    candidates = [
        ("Broken internal links", broken_links * 10),
        ("Missing meta descriptions", missing_meta * 5),
        ("Duplicate titles", duplicate_titles_groups * 3),
        ("Thin content pages", thin_pages * 2),
        ("Missing H1", missing_h1_pages * 2),
    ]
    candidates.sort(key=lambda x: x[1], reverse=True)
    main = candidates[0][0] if candidates and candidates[0][1] > 0 else "No major issue detected"
    return score, main


def run_seo_scan_real(
    raw_url: str,
    max_pages: int = 25,
    timeout_s: float = 12.0,
    thin_words_threshold: int = 250,
):
    """
    Générateur (yield) d'events de progression + retourne un payload final (done).
    """
    target = normalize_target_url(raw_url)
    host = urlparse(target).netloc

    # Collecteurs
    crawled: List[PageAnalysis] = []
    visited: Set[str] = set()
    queue: List[str] = [target]

    # Issues détaillées
    missing_meta_pages: List[Dict] = []
    missing_h1_pages: List[Dict] = []
    thin_pages: List[Dict] = []
    broken_links_items: List[Dict] = []
    titles_map: Dict[str, List[str]] = {}

    # HTTP client
    headers = {
        "User-Agent": "MarketingCommandCenterBot/0.1 (SEO Scan; local dev)",
        "Accept": "text/html,application/xhtml+xml",
    }

    yield ("progress", {"progress": 5, "label": "Starting scan"})
    start_ts = time.time()

    with httpx.Client(
        follow_redirects=True,
        timeout=httpx.Timeout(timeout_s),
        headers=headers,
    ) as client:

        # Petit ping régulier utile pour éviter “silence” (UX + timeouts)
        last_ping = time.time()

        def maybe_ping():
            nonlocal last_ping
            if time.time() - last_ping > 10:
                last_ping = time.time()
                # event "ping" optionnel (le front peut l'ignorer)
                yield ("ping", {"ts": time.time()})

        yield ("progress", {"progress": 10, "label": "Fetching & crawling pages"})

        while queue and len(visited) < max_pages:
            current = queue.pop(0)
            if current in visited:
                continue

            # Ping
            for ev in maybe_ping() or []:
                yield ev

            try:
                r = client.get(current)
                status = r.status_code
                if status >= 400:
                    # On note la page comme "broken" (page elle-même inaccessible)
                    broken_links_items.append({"from": None, "to": current, "status": status})
                    visited.add(current)
                    continue

                content_type = r.headers.get("content-type", "")
                if "text/html" not in content_type:
                    visited.add(current)
                    continue

                analysis = analyze_html(current, r.text)
                crawled.append(analysis)
                visited.add(current)

                # Issues page
                if not analysis.meta_description:
                    missing_meta_pages.append({"url": analysis.url})

                if analysis.h1_count == 0:
                    missing_h1_pages.append({"url": analysis.url})

                if analysis.word_count < thin_words_threshold:
                    thin_pages.append({"url": analysis.url, "words": analysis.word_count})

                # Duplicate titles
                tkey = (analysis.title or "").strip()
                if tkey:
                    titles_map.setdefault(tkey, []).append(analysis.url)

                # Enqueue internes
                for link in analysis.internal_links:
                    if link not in visited and link not in queue and same_host(link, target):
                        queue.append(link)

                # Progress dynamique 10% -> 70% selon pages traitées
                pct = 10 + int((len(visited) / max_pages) * 60)
                pct = min(70, max(10, pct))
                yield ("progress", {"progress": pct, "label": f"Crawling pages ({len(visited)}/{max_pages})"})

            except Exception as e:
                # erreur réseau/parsing
                visited.add(current)
                broken_links_items.append({"from": None, "to": current, "status": "error", "error": str(e)})

        # Analyse liens internes (light) sur les pages déjà crawled
        yield ("progress", {"progress": 75, "label": "Checking internal links"})
        checked = 0
        max_checks = min(120, sum(len(p.internal_links) for p in crawled))  # cap
        for p in crawled:
            for link in p.internal_links:
                if checked >= max_checks:
                    break

                # Ping
                for ev in maybe_ping() or []:
                    yield ev

                checked += 1
                try:
                    # HEAD puis fallback GET si HEAD bloqué
                    rr = client.head(link)
                    if rr.status_code in (405, 403) or rr.status_code >= 500:
                        rr = client.get(link)
                    if rr.status_code >= 400:
                        broken_links_items.append({"from": p.url, "to": link, "status": rr.status_code})
                except Exception as e:
                    broken_links_items.append({"from": p.url, "to": link, "status": "error", "error": str(e)})

        yield ("progress", {"progress": 85, "label": "Computing SEO score"})

    # Duplicate titles groups
    duplicate_titles = {t: urls for t, urls in titles_map.items() if len(urls) > 1}
    duplicate_groups = len(duplicate_titles)

    # KPIs
    pages_crawled = len(crawled)
    critical_issues = len(missing_meta_pages) + len([b for b in broken_links_items if isinstance(b.get("status"), int) and b["status"] >= 400])

    score, main_issue = compute_health_score(
        missing_meta=len(missing_meta_pages),
        broken_links=len(broken_links_items),
        duplicate_titles_groups=duplicate_groups,
        thin_pages=len(thin_pages),
        missing_h1_pages=len(missing_h1_pages),
    )

    duration_s = round(time.time() - start_ts, 2)

    payload = {
        "kpis": {
            "pages_crawled": pages_crawled,
            "critical_issues": critical_issues,
            "missing_meta_descriptions": len(missing_meta_pages),
            "thin_pages": len(thin_pages),
        },
        "health": {
            "score": score,
            "main_issue": f"{main_issue} on {max(len(missing_meta_pages), len(broken_links_items), duplicate_groups, len(thin_pages), len(missing_h1_pages))} item(s)"
            if main_issue != "No major issue detected"
            else main_issue
        },
        "issues": {
            "missing_meta_descriptions": missing_meta_pages,
            "broken_links": broken_links_items,
            "duplicate_titles": duplicate_titles,
            "thin_pages": thin_pages,
            "missing_h1": missing_h1_pages,
        },
        "meta": {
            "target_url": target,
            "host": host,
            "max_pages": max_pages,
            "thin_words_threshold": thin_words_threshold,
            "duration_s": duration_s,
            "finished_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        },
    }

    yield ("progress", {"progress": 100, "label": "Scan completed"})
    yield ("done", payload)