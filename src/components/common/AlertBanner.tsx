import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const styles = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-green-50 border-green-200 text-green-800',
};

const icons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: Info,
};

export function AlertBanner({ type, message, onDismiss, className }: AlertBannerProps) {
  const Icon = icons[type];
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3 border rounded-lg', styles[type], className)}>
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1 text-sm">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
