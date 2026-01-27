// Layout principal avec Sidebar + Multi-channel support
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import { ChannelProvider } from '@/contexts/ChannelContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marketing Command Center - Internal MVP',
  description: 'Plateforme multi-channel (SEA / SEO / META) avec audit, alertes et validation humaine',
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
          <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar fixe */}
            <Sidebar />

            {/* Main content avec padding pour la sidebar */}
            <main className="flex-1 ml-60">
              <div className="p-8">
                <Providers>{children}</Providers>
              </div>
            </main>
          </div>
        </ChannelProvider>
      </body>
    </html>
  );
}
