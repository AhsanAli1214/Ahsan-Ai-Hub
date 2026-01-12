'use client';

import { useCallback, useMemo } from 'react';

const noop = () => {};

export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore haptic errors
      }
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(15), [vibrate]);
  const heavyTap = useCallback(() => vibrate(20), [vibrate]);
  const successTap = useCallback(() => vibrate([10, 30, 10]), [vibrate]);
  const errorTap = useCallback(() => vibrate([50, 50, 50]), [vibrate]);

  return useMemo(() => ({
    lightTap,
    mediumTap,
    heavyTap,
    successTap,
    errorTap,
    vibrate
  }), [lightTap, mediumTap, heavyTap, successTap, errorTap, vibrate]);
};
