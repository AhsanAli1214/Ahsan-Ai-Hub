'use client';

import { useEffect } from 'react';

export function ColorThemeInitializer() {
  useEffect(() => {
    const savedColorTheme = localStorage.getItem('selectedColorTheme');
    if (savedColorTheme) {
      document.documentElement.setAttribute('data-theme', savedColorTheme);
    }
  }, []);

  return null;
}
