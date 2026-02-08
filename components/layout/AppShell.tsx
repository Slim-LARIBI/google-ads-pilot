'use client';

import { usePathname } from 'next/navigation';
import SidebarRouter from './SidebarRouter';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Sidebar uniquement dans /sea/* et /seo/* (pas sur la home)
  const showSidebar = pathname.startsWith('/sea') || pathname.startsWith('/seo');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {showSidebar && <SidebarRouter />}

      <main className={`flex-1 ${showSidebar ? 'ml-60' : ''}`}>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}