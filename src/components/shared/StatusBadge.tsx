import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

type BadgeStatus = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO' | 'ACTIVE' | 'INACTIVE' | 'DEVOLVIDO' | 'ATIVO' | 'ATRASSADO';

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = {
    SUCCESS: { color: "bg-green-50 text-green-600", icon: <CheckCircle2 size={12} /> },
    DEVOLVIDO: { color: "bg-green-50 text-green-600", icon: <CheckCircle2 size={12} /> },
    ERROR: { color: "bg-red-50 text-red-600", icon: <XCircle size={12} /> },
    ATRASSADO: { color: "bg-red-50 text-red-600", icon: <AlertCircle size={12} /> },
    INACTIVE: { color: "bg-red-50 text-red-600", icon: <XCircle size={12} /> },
    WARNING: { color: "bg-orange-50 text-orange-600", icon: <AlertCircle size={12} /> },
    INFO: { color: "bg-blue-50 text-blue-600", icon: <Clock size={12} /> },
    ACTIVE: { color: "bg-green-50 text-green-600", icon: <CheckCircle2 size={12} /> },
    ATIVO: { color: "bg-blue-50 text-blue-600", icon: <Clock size={12} /> },
  };

  const { color, icon } = config[status] || config.INFO;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full",
      color,
      className
    )}>
      {icon}
      {label || status}
    </span>
  );
}
