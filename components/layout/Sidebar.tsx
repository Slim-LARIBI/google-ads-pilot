'use client';

// Sidebar de navigation principale
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  CheckCircle,
  ListChecks,
  History
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/audit', label: 'Audit', icon: Search },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/actions', label: 'Actions', icon: CheckCircle, badge: 4 }, // Badge dynamique
  { href: '/rules', label: 'Rules', icon: ListChecks },
  { href: '/history', label: 'History', icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-900 text-white flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Marketing Command Center</h1>
        <p className="text-xs text-gray-400 mt-1">Multi-channel Platform - V1.5</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors duration-150
                ${isActive
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
        <p className="mt-1">Pas d&apos;authentification</p>
      </div>
    </aside>
  );
}
