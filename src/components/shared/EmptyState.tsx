import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "bg-gray-50 p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center",
      className
    )}>
      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <Icon className="text-gray-300" size={40} />
      </div>
      <h3 className="text-xl font-bold text-brand-dark-blue mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">{description}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 py-3 bg-brand-primary-blue text-white rounded-2xl font-bold hover:bg-brand-medium-blue transition-all shadow-lg shadow-brand-primary-blue/20"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
