import type { SVGProps } from 'react';

export function AIHubExpressLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}


export function AhsanAILogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z"
            stroke="currentColor"
            strokeWidth="8"
        />
        <path
            d="M36 50H64"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
        />
        <path
            d="M50 36V64"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
        />
    </svg>
);
}
