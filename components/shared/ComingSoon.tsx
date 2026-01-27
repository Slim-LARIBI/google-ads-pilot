// Badge "Coming Soon" pour features inactives
import { Lock } from 'lucide-react';

interface ComingSoonProps {
  channel: string;
  message?: string;
}

export default function ComingSoon({ channel, message }: ComingSoonProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Lock size={32} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {channel} - Coming Soon
        </h3>
        <p className="text-gray-600">
          {message || `Cette fonctionnalité sera disponible prochainement pour ${channel}.`}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg border border-primary-200">
          <span className="font-medium">🚀 En développement</span>
        </div>
      </div>
    </div>
  );
}
