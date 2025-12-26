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
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=6LesbDcsAAAAALuDdNtUQEhyOP8O7K9vd0VSpsew';
    script.async = true;
    script.defer = true;
    script.integrity = '';
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
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA is not loaded'));
      return;
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      reject(new Error('reCAPTCHA site key is not configured'));
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action })
        .then((token: string) => {
          resolve(token);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  });
}
