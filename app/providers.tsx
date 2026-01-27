'use client';

import React from 'react';
import { ChannelProvider } from '@/components/channel/channel-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChannelProvider>{children}</ChannelProvider>;
}
