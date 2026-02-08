'use client';

import { usePathname } from 'next/navigation';
import SidebarSEA from '@/components/layout/SidebarSEA';
import SidebarSEO from '@/components/layout/SidebarSEO';

export default function SidebarRouter() {
  const pathname = usePathname();

  if (!pathname) return null;

  // Home: pas de sidebar (landing)
  if (pathname === '/') return null;

  if (pathname.startsWith('/seo')) return <SidebarSEO />;
  if (pathname.startsWith('/sea')) return <SidebarSEA />;

  // fallback (si tu veux rien afficher)
  return null;
}