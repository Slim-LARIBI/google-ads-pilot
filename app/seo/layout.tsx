import type { ReactNode } from 'react';

export default function SeoLayout({ children }: { children: ReactNode }) {
  // On laisse RootLayout gérer la sidebar (via components/layout/Sidebar.tsx)
  return <>{children}</>;
}