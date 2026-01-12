'use client';

import { useCallback } from 'react';

export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.warn('Haptic feedback not supported or failed:', e);
      }
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(15), [vibrate]);
  const heavyTap = useCallback(() => vibrate(20), [vibrate]);
  const successTap = useCallback(() => vibrate([10, 30, 10]), [vibrate]);
  const errorTap = useCallback(() => vibrate([50, 50, 50]), [vibrate]);

  return { lightTap, mediumTap, heavyTap, successTap, errorTap, vibrate };
};
