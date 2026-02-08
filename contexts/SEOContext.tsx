'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type Issue = {
  key: string;
  title: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2';
  affectedPages: number;
  sampleUrls: string[];
};

export type PageRow = {
  url: string;
  status: number;
  title: string;
  meta_description: string;
  h1_count: number;
  canonical: string;
  word_count: number;
  load_ms: number;
  internal_links: number;
  external_links: number;
};

export type ScanResult = {
  input: { url: string; max_pages: number };
  kpis: {
    pages_crawled: number;
    critical_issues: number;
    warnings: number;
    slow_pages: number;
  };
  health: { score: number; mainIssue: string };
  issues: Issue[];
  pages: PageRow[];
  recommended_actions: any[];
  meta: { lastScan: number };
};

type SEOState = {
  result: ScanResult | null;
  setResult: (r: ScanResult | null) => void;
};

const SEOContext = createContext<SEOState | null>(null);

export function SEOProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<ScanResult | null>(null);

  const value = useMemo(() => ({ result, setResult }), [result]);
  return <SEOContext.Provider value={value}>{children}</SEOContext.Provider>;
}

export function useSEO() {
  const ctx = useContext(SEOContext);
  if (!ctx) throw new Error('useSEO must be used inside SEOProvider');
  return ctx;
}