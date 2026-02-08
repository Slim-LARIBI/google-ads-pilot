import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Providers } from './providers';
import { ChannelProvider } from '@/contexts/ChannelContext';
import SidebarRouter from '@/components/layout/SidebarRouter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marketing Command Center - Internal MVP',
  description:
    'Plateforme multi-channel (SEA / SEO / META) avec audit, alertes et validation humaine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ChannelProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Sidebar (SEA/SEO) ou rien sur la home */}
            <SidebarRouter />

            {/* Main content */}
            <main className="min-h-screen">
              <div className="p-8 ml-0 md:ml-60">
                <Providers>{children}</Providers>
              </div>
            </main>
          </div>
        </ChannelProvider>
      </body>
    </html>
  );
}