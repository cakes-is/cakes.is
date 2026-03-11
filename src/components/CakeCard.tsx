"use client";

import { useState } from "react";
import Image from "next/image";
import type { Cake } from "@/lib/types";

interface CakeCardProps {
  cake: Cake;
  onOpen?: (cake: Cake) => void;
}

export default function CakeCard({ cake, onOpen }: CakeCardProps) {
  const [imgError, setImgError] = useState(false);
  const thumbnailUrl = cake.imageUrls[0];

  const handleClick = () => {
    if (onOpen) onOpen(cake);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onOpen) onOpen(cake);
    }
  };

  return (
    <article
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Skoða ${cake.name}` : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={[
        "group bg-warm-white overflow-hidden rounded-xl transition-all duration-300",
        "border-border shadow-card border",
        onOpen
          ? "hover:shadow-card-hover cursor-pointer hover:-translate-y-1"
          : "",
      ].join(" ")}
      style={{
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="bg-cream-dark relative aspect-[4/3] overflow-hidden">
        {thumbnailUrl && !imgError ? (
          <Image
            src={thumbnailUrl}
            alt={cake.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="from-rose-light via-cream-dark to-parchment absolute inset-0 flex items-center justify-center bg-gradient-to-br">
            <span className="text-5xl opacity-30 select-none">k</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-warm-white/90 text-brown-dark border-border inline-block rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
            {cake.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-brown-dark mb-1 text-lg leading-snug">
          {cake.name}
        </h3>
        <p className="text-brown mb-3 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed">
          {cake.description}
        </p>
        <div className="border-border flex items-center justify-between border-t pt-2">
          <span className="text-rose-dark text-sm font-semibold">
            {cake.price}
          </span>
          {onOpen && (
            <span className="text-brown text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Skoða &rarr;
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
