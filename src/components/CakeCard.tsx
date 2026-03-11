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
        "group bg-warm-white rounded-xl overflow-hidden transition-all duration-300",
        "border border-border shadow-card",
        onOpen ? "cursor-pointer hover:shadow-card-hover hover:-translate-y-1" : "",
      ].join(" ")}
      style={{
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
        {cake.imageUrl && !imgError ? (
          <Image
            src={cake.imageUrl}
            alt={cake.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-light via-cream-dark to-parchment">
            <span className="text-5xl opacity-30 select-none">k</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 rounded-full bg-warm-white/90 backdrop-blur-sm text-xs font-medium text-brown-dark border border-border">
            {cake.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-brown-dark mb-1 leading-snug">
          {cake.name}
        </h3>
        <p className="text-brown text-sm leading-relaxed line-clamp-2 mb-3 min-h-[2.5rem]">
          {cake.description}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-semibold text-rose-dark">
            {cake.price}
          </span>
          {onOpen && (
            <span className="text-xs text-brown opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Skoða &rarr;
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
