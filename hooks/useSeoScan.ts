'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SeoScanData = {
  kpis: {
    pages_crawled: number;
    critical_issues: number;
    missing_meta_descriptions: number;
    thin_pages: number;
  };
  health: {
    score: number;
    main_issue: string;
  };
  issues: {
    missing_meta_descriptions: Array<{ url: string }>;
    broken_links: Array<any>;
    duplicate_titles: Record<string, string[]>;
    thin_pages: Array<{ url: string }>;
  };
  meta?: Record<string, any>;
};

type ProgressPayload = { progress?: number; label?: string; ts?: string };
type DonePayload = SeoScanData;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

// Timeout “silence” côté front: si aucun EVENT SSE reçu pendant X ms -> erreur.
// Avec heartbeat backend, tu ne l’atteins plus.
const STALL_TIMEOUT_MS = 30000;

export function useSeoScan(initialUrl: string) {
  const [url, setUrl] = useState(initialUrl || '');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState<string>('');
  const [data, setData] = useState<SeoScanData | null>(null);
  const [error, setError] = useState<string>('');

  const esRef = useRef<EventSource | null>(null);
  const lastEventAtRef = useRef<number>(0);
  const stallTimerRef = useRef<number | null>(null);

  const closeStream = useCallback(() => {
    if (stallTimerRef.current) {
      window.clearInterval(stallTimerRef.current);
      stallTimerRef.current = null;
    }
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => closeStream();
  }, [closeStream]);

  const startStallWatchdog = useCallback(() => {
    lastEventAtRef.current = Date.now();
    if (stallTimerRef.current) window.clearInterval(stallTimerRef.current);

    stallTimerRef.current = window.setInterval(() => {
      const now = Date.now();
      if (!loading) return;
      if (now - lastEventAtRef.current > STALL_TIMEOUT_MS) {
        setLoading(false);
        setError('Timeout: le scan ne répond plus (aucune progression reçue).');
        closeStream();
      }
    }, 500);
  }, [closeStream, loading]);

  const runScan = useCallback(() => {
    setError('');
    setData(null);
    setProgress(1);
    setLabel('Starting…');
    setLoading(true);

    closeStream();
    startStallWatchdog();

    const cleanUrl = (url || '').trim();
    if (!cleanUrl) {
      setLoading(false);
      setError('URL requise.');
      return;
    }
    if (cleanUrl.includes('@') && !cleanUrl.includes('://')) {
      setLoading(false);
      setError("Tu as mis un email. Mets une URL (ex: laribislim.com).");
      return;
    }

    const endpoint = `${API_BASE}/seo/scan/stream?url=${encodeURIComponent(cleanUrl)}`;
    const es = new EventSource(endpoint);
    esRef.current = es;

    const markAlive = () => {
      lastEventAtRef.current = Date.now();
    };

    const onProgressLike = (payload: ProgressPayload) => {
      markAlive();
      if (typeof payload.progress === 'number') setProgress(payload.progress);
      if (payload.label) setLabel(payload.label);
    };

    es.addEventListener('progress', (evt) => {
      try {
        const payload = JSON.parse((evt as MessageEvent).data) as ProgressPayload;
        onProgressLike(payload);
      } catch {
        // ignore
      }
    });

    // ✅ HEARTBEAT: traité comme un “progress-like” (reset watchdog)
    es.addEventListener('heartbeat', (evt) => {
      try {
        const payload = JSON.parse((evt as MessageEvent).data) as ProgressPayload;
        onProgressLike(payload);
      } catch {
        markAlive();
      }
    });

    es.addEventListener('done', (evt) => {
      markAlive();
      try {
        const payload = JSON.parse((evt as MessageEvent).data) as DonePayload;
        setData(payload);
        setProgress(100);
        setLabel('Scan terminé ✅');
        setLoading(false);
        closeStream();
      } catch {
        setLoading(false);
        setError('Erreur: réponse "done" invalide.');
        closeStream();
      }
    });

    es.addEventListener('error', (evt) => {
      // EventSource déclenche "error" aussi sur un close réseau.
      // On essaie de lire un message si possible, sinon message générique.
      markAlive();
      setLoading(false);
      setError(`Failed to fetch (backend OFF ou CORS). API: ${API_BASE}`);
      closeStream();
    });
  }, [API_BASE, closeStream, startStallWatchdog, url]);

  return { url, setUrl, loading, progress, label, data, error, runScan };
}