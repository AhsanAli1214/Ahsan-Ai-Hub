'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithLazyLoadProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function ImageWithLazyLoad({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: ImageWithLazyLoadProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        quality={75}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}
