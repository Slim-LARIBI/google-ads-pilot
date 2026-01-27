'use client';

// Sélecteur de channel global
import { useChannel } from '@/contexts/ChannelContext';
import { CHANNELS, type Channel } from '@/types';
import { Lock } from 'lucide-react';

export default function ChannelSelector() {
  const { selectedChannel, setSelectedChannel } = useChannel();

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-medium text-gray-700">Channel:</span>
      <div className="flex gap-2">
        {(Object.keys(CHANNELS) as Channel[]).map((channel) => {
          const channelInfo = CHANNELS[channel];
          const isActive = channelInfo.isActive;
          const isSelected = selectedChannel === channel;

          return (
            <button
              key={channel}
              onClick={() => isActive && setSelectedChannel(channel)}
              disabled={!isActive}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                flex items-center gap-2
                ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-md'
                    : isActive
                    ? 'bg-white text-gray-700 border border-gray-300 hover:border-primary-500'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }
              `}
            >
              <span>{channelInfo.icon}</span>
              <span>{channelInfo.label}</span>
              {!isActive && <Lock size={14} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
