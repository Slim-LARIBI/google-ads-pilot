'use client';

import { Providers } from '../providers';
import SidebarSEA from '@/components/layout/SidebarSEA';
import { ChannelProvider } from '@/contexts/ChannelContext';

export default function SeaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChannelProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SidebarSEA />
        <main className="flex-1 ml-60">
          <div className="p-8">
            <Providers>{children}</Providers>
          </div>
        </main>
      </div>
    </ChannelProvider>
  );
}