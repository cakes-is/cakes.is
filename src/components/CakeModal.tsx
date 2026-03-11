"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import type { Cake } from "@/lib/types";
import { useState } from "react";

interface CakeModalProps {
  cake: Cake | null;
  onClose: () => void;
}

export default function CakeModal({ cake, onClose }: CakeModalProps) {
  const [imgError, setImgError] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!cake) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [cake, handleKeyDown]);

  useEffect(() => {
    setImgError(false);
  }, [cake]);

  if (!cake) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={cake.name}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-chocolate/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative z-10 bg-warm-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col"
        style={{ boxShadow: "var(--shadow-modal)" }}
      >
        <button
          onClick={onClose}
          aria-label="Loka"
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-warm-white/90 text-brown hover:text-brown-dark hover:bg-cream transition-colors duration-200 text-xl leading-none"
        >
          &times;
        </button>

        <div className="relative aspect-[16/9] flex-shrink-0 bg-cream-dark overflow-hidden">
          {cake.imageUrl && !imgError ? (
            <Image
              src={cake.imageUrl}
              alt={cake.name}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              onError={() => setImgError(true)}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-light via-cream-dark to-parchment">
              <span className="text-8xl opacity-20 select-none">k</span>
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="font-display text-2xl text-brown-dark leading-snug">
              {cake.name}
            </h2>
            <span className="flex-shrink-0 inline-block px-3 py-1 rounded-full bg-cream-dark text-xs font-medium text-brown-dark border border-border">
              {cake.category}
            </span>
          </div>

          <p className="text-brown leading-relaxed mb-5">{cake.description}</p>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xl font-semibold text-rose-dark">
              {cake.price}
            </span>
            <a
              href="/order"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-dark text-warm-white text-sm font-medium hover:bg-accent-hover transition-colors duration-200"
            >
              Panta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
