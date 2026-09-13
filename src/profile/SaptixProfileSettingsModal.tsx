"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { SaptixProfileSettingsView } from './SaptixProfileSettingsView';

export interface SaptixProfileSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'profile' | 'security' | 'sessions' | 'preferences';
}

export function SaptixProfileSettingsModal({
  open,
  onOpenChange,
  defaultTab = 'profile'
}: SaptixProfileSettingsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/80 bg-background shadow-2xl p-4 sm:p-6 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <SaptixProfileSettingsView
          embedded={true}
          defaultTab={defaultTab}
          onClose={() => onOpenChange(false)}
        />
      </div>
    </div>
  );
}
