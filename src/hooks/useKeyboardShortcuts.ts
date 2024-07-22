"use client"

import { useEffect } from 'react';

export function useKeyboardShortcuts(items: string[], copyToClipboard: (text: string) => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < items.length) {
          copyToClipboard(items[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, copyToClipboard]);
}