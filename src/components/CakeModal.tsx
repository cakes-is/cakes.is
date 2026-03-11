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
        className="bg-chocolate/60 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="bg-warm-white relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl"
        style={{ boxShadow: "var(--shadow-modal)" }}
      >
        <button
          onClick={onClose}
          aria-label="Loka"
          className="bg-warm-white/90 text-brown hover:text-brown-dark hover:bg-cream absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none transition-colors duration-200"
        >
          &times;
        </button>

        <div className="bg-cream-dark relative aspect-[16/9] flex-shrink-0 overflow-hidden">
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
            <div className="from-rose-light via-cream-dark to-parchment absolute inset-0 flex items-center justify-center bg-gradient-to-br">
              <span className="text-8xl opacity-20 select-none">k</span>
            </div>
          )}
        </div>

        <div className="overflow-y-auto p-6">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h2 className="font-display text-brown-dark text-2xl leading-snug">
              {cake.name}
            </h2>
            <span className="bg-cream-dark text-brown-dark border-border inline-block flex-shrink-0 rounded-full border px-3 py-1 text-xs font-medium">
              {cake.category}
            </span>
          </div>

          <p className="text-brown mb-5 leading-relaxed">{cake.description}</p>

          <div className="border-border flex items-center justify-between border-t pt-4">
            <span className="text-rose-dark text-xl font-semibold">
              {cake.price}
            </span>
            <a
              href="/order"
              className="bg-rose-dark text-warm-white hover:bg-accent-hover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200"
            >
              Panta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
