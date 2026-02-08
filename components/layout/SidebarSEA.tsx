'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  CheckCircle,
  ListChecks,
  History,
} from 'lucide-react';

const navItems = [
  { href: '/sea/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/sea/audit', label: 'Audit', icon: Search },
  { href: '/sea/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/sea/actions', label: 'Actions', icon: CheckCircle, badge: 4 },
  { href: '/sea/rules', label: 'Rules', icon: ListChecks },
  { href: '/sea/history', label: 'History', icon: History },
];

export default function SidebarSEA() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // active si on est exactement sur la page ou dans une sous-route
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-900 text-white flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Marketing Command Center</h1>
        <p className="text-xs text-gray-400 mt-1">SEA Module - V1.0</p>

        {/* Petit indicateur mode */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          Mode: SEA
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

              {item.badge && (
                <span className="ml-auto bg-danger-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
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