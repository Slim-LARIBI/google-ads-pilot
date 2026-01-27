// Composant Badge pour afficher les priorités et statuts
import type { Priority, AlertSeverity, ActionStatus } from '@/types';

interface BadgeProps {
  variant?: Priority | AlertSeverity | ActionStatus | 'success' | 'default';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const variantStyles = {
  // Priorités
  P0: 'bg-danger-100 text-danger-700 border-danger-200',
  P1: 'bg-warning-100 text-warning-700 border-warning-200',
  P2: 'bg-primary-100 text-primary-700 border-primary-200',

  // Sévérités d'alerte
  critical: 'bg-danger-100 text-danger-700 border-danger-200',
  warning: 'bg-warning-100 text-warning-700 border-warning-200',
  info: 'bg-primary-100 text-primary-700 border-primary-200',

  // Statuts d'action
  pending: 'bg-warning-100 text-warning-700 border-warning-200',
  validated: 'bg-success-100 text-success-700 border-success-200',
  rejected: 'bg-gray-100 text-gray-700 border-gray-200',

  // Autres
  success: 'bg-success-100 text-success-700 border-success-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function Badge({ variant = 'default', children, size = 'sm' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border
      ${variantStyles[variant]}
      ${sizeClasses}
    `}>
      {children}
    </span>
  );
}
