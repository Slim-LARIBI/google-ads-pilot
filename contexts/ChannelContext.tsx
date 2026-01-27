'use client';

// Context pour gérer le channel sélectionné globalement
import { createContext, useContext, useState, ReactNode } from 'react';
import type { Channel } from '@/types';

interface ChannelContextType {
  selectedChannel: Channel;
  setSelectedChannel: (channel: Channel) => void;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export function ChannelProvider({ children }: { children: ReactNode }) {
  const [selectedChannel, setSelectedChannel] = useState<Channel>('sea');

  return (
    <ChannelContext.Provider value={{ selectedChannel, setSelectedChannel }}>
      {children}
    </ChannelContext.Provider>
  );
}

export function useChannel() {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannel must be used within a ChannelProvider');
  }
  return context;
}
