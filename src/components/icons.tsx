import type { SVGProps } from 'react';
import Image from 'next/image';

export function AhsanAiHubLogo(props: SVGProps<SVGSVGElement> & {width?: number; height?: number, fillContainer?: boolean, priority?: boolean}) {
  if (props.fillContainer) {
    return (
      <Image
        src="/logo.png"
        alt="Ahsan Ai Hub Logo"
        fill
        sizes="80px"
        className={props.className}
        style={{ objectFit: 'contain' }}
        priority={true}
        fetchPriority="high"
      />
    );
  }
  return (
    <Image
      src="/logo.png"
      alt="Ahsan Ai Hub Logo"
      width={props.width || 60}
      height={props.height || 60}
      className={props.className}
      priority={true}
      fetchPriority="high"
    />
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
