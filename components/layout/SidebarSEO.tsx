'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScanSearch, AlertTriangle, FileText, KeyRound, ListChecks, Wrench, History } from 'lucide-react';

const navItems = [
  { href: '/seo/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/seo/scan', label: 'Scan', icon: ScanSearch },
  { href: '/seo/issues', label: 'Issues', icon: AlertTriangle },
  { href: '/seo/pages', label: 'Pages', icon: FileText },
  { href: '/seo/keywords', label: 'Keywords', icon: KeyRound },
  { href: '/seo/rules', label: 'Rules', icon: ListChecks },
  { href: '/seo/fix-queue', label: 'Fix Queue', icon: Wrench },
  { href: '/seo/history', label: 'History', icon: History },
];

export default function SidebarSEO() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-900 text-white flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Marketing Command Center</h1>
        <p className="text-xs text-gray-400 mt-1">SEO Module - V1.0</p>

        {/* Indicateur mode */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          Mode: SEO
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors duration-150
                ${active
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
        <p>V1.0.0 - MVP</p>
        <p className="mt-1">Local only</p>
      </div>
    </aside>
  );
}