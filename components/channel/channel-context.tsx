'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type ChannelKey = 'sea' | 'seo' | 'meta';

type ChannelContextType = {
  selectedChannel: ChannelKey;
  setSelectedChannel: (c: ChannelKey) => void;
};

const ChannelContext = createContext<ChannelContextType | null>(null);

export function ChannelProvider({ children }: { children: React.ReactNode }) {
  const [selectedChannel, setSelectedChannel] = useState<ChannelKey>('sea');

  const value = useMemo(
    () => ({ selectedChannel, setSelectedChannel }),
    [selectedChannel]
  );

  return <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>;
}

export function useChannel() {
  const ctx = useContext(ChannelContext);

  // Filet de sécurité: si jamais le Provider est absent, on ne crash pas.
  if (!ctx) {
    return { selectedChannel: 'sea' as ChannelKey, setSelectedChannel: () => {} };
  }

  return ctx;
}
