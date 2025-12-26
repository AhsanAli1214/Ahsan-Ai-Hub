'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function ReCaptchaScript() {
  useEffect(() => {
    // Only load reCAPTCHA if not already present
    if (window.grecaptcha) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Keep script loaded for performance
    };
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
    console.error('reCAPTCHA verification error:', error);
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
      console.error('reCAPTCHA site key not configured');
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
              console.error('reCAPTCHA execute error:', error);
              reject(error);
            });
        } catch (error) {
          clearTimeout(executionTimeout);
          console.error('reCAPTCHA ready callback error:', error);
          reject(error);
        }
      });
    } catch (error) {
      clearTimeout(executionTimeout);
      console.error('reCAPTCHA execution error:', error);
      reject(error);
    }
  });
}
