'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Search } from 'lucide-react';

import SidebarSEA from '@/components/layout/SidebarSEA';
import SidebarSEO from '@/components/layout/SidebarSEO';

export default function Sidebar() {
  const pathname = usePathname();

  // 1) SEA module
  if (pathname.startsWith('/sea')) {
    return <SidebarSEA />;
  }

  // 2) SEO module
  if (pathname.startsWith('/seo')) {
    return <SidebarSEO />;
  }

  // 3) Home / Landing (sidebar minimal)
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Marketing Command Center</h1>
        <p className="text-xs text-gray-400 mt-1">Multi-module • Local first</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/sea/overview"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">SEA</span>
        </Link>

        <Link
          href="/seo/overview"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Search size={20} />
          <span className="font-medium">SEO</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
        <p>V1.0.0 - MVP</p>
        <p className="mt-1">Local only</p>
      </div>
    </aside>
  );
}