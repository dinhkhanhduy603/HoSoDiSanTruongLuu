import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { getVerificationDisplay } from '../utils/archive';

interface VerificationBadgeProps {
  mucKiemChung?: string | null;
  compact?: boolean;
}

export function VerificationBadge({
  mucKiemChung,
  compact = false,
}: VerificationBadgeProps) {
  const info = getVerificationDisplay(mucKiemChung);

  if (info.tone === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium text-[#14532D] bg-[#ECFDF5] border border-[#BBF7D0] rounded-md whitespace-nowrap shrink-0 ${
          compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{info.label}</span>
      </span>
    );
  }

  if (info.tone === 'reviewing') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium text-[#1E3A5F] bg-[#EFF6FF] border border-[#BFDBFE] rounded-md whitespace-nowrap shrink-0 ${
          compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
        }`}
      >
        <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{info.label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] rounded-md whitespace-nowrap shrink-0 ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
    >
      <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{info.label}</span>
    </span>
  );
}
