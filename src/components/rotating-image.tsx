"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ImageContent } from "@/lib/contentful";

type Props = {
  images: ImageContent[];
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Rotation interval in milliseconds. Defaults to 7000. */
  intervalMs?: number;
};

/**
 * Renders a stack of images that crossfade through the array on a timer.
 * The wrapping element must be positioned (e.g. `relative`) because each
 * `next/image` uses `fill`. Arrays of length 1 render statically with no
 * client-side interval.
 */
export default function RotatingImage({
  images,
  sizes,
  priority = false,
  className,
  intervalMs = 7000,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    const img = images[0];
    return (
      <Image
        src={img.src}
        alt={img.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }

  return (
    <>
      {images.map((img, i) => (
        <Image
          key={`${img.src}-${i}`}
          src={img.src}
          alt={img.alt}
          fill
          priority={priority && i === 0}
          sizes={sizes}
          className={`${className ?? ""} transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}
