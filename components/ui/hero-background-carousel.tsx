"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroBackgroundCarouselProps {
  images: string[];
  intervalMs?: number;
}

export function HeroBackgroundCarousel({
  images,
  intervalMs = 10000,
}: HeroBackgroundCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src + i}
          src={src}
          alt="Madhur Namkeen hero"
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
          unoptimized
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/45 to-black/70" />
    </>
  );
}
