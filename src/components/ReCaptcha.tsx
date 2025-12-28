'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

let recaptchaLoaded = false;

export function ReCaptchaScript() {
  const loadedRef = useRef(false);

  const loadReCaptcha = () => {
    if (recaptchaLoaded || loadedRef.current) return;
    loadedRef.current = true;

    // Delay loading until user interaction (lazy load)
    const loadScript = () => {
      if (window.grecaptcha) return;
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      recaptchaLoaded = true;
    };

    // Load on first user interaction
    document.addEventListener('focus', loadScript, { once: true });
    document.addEventListener('touchstart', loadScript, { once: true });
    document.addEventListener('click', loadScript, { once: true });

    // Also load after 5 seconds as fallback
    setTimeout(loadScript, 5000);
  };

  useEffect(() => {
    // Don't load on page load, wait for interaction
    loadReCaptcha();
  }, []);

  return null;
}

export async function verifyReCaptcha(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
  try {
    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Failed to verify reCAPTCHA. Please try again.',
    };
  }
}

export function executeReCaptcha(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      reject(new Error('reCAPTCHA site key is not configured'));
      return;
    }

    // Timeout for reCAPTCHA execution
    const executionTimeout = setTimeout(() => {
      reject(new Error('reCAPTCHA execution timed out'));
    }, 10000);

    try {
      if (!window.grecaptcha) {
        clearTimeout(executionTimeout);
        reject(new Error('reCAPTCHA script not loaded'));
        return;
      }

      window.grecaptcha.ready(() => {
        try {
          window.grecaptcha
            .execute(siteKey, { action })
            .then((token: string) => {
              clearTimeout(executionTimeout);
              resolve(token);
            })
            .catch((error: any) => {
              clearTimeout(executionTimeout);
              reject(error);
            });
        } catch (error) {
          clearTimeout(executionTimeout);
          reject(error);
        }
      });
    } catch (error) {
      clearTimeout(executionTimeout);
      reject(error);
    }
  });
}
