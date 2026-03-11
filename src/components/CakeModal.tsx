"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import Image from "next/image";
import type { Cake } from "@/lib/types";

interface CakeModalProps {
  cake: Cake | null;
  onClose: () => void;
}

export default function CakeModal({ cake, onClose }: CakeModalProps) {
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    setImgErrors(new Set());
    setActiveIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [cake]);

  const handleImgError = (index: number) => {
    setImgErrors((prev) => new Set(prev).add(index));
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
    setActiveIndex(index);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const newIndex = Math.round(scrollLeft / clientWidth);
    setActiveIndex(newIndex);
  };

  if (!cake) return null;

  const images = cake.imageUrls.filter((_, i) => !imgErrors.has(i));
  const hasMultiple = cake.imageUrls.length > 1;

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

        {/* Image area — carousel if multiple, single image if one */}
        <div className="relative flex-shrink-0">
          {cake.imageUrls.length > 0 ? (
            <>
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {cake.imageUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] w-full flex-shrink-0 snap-center"
                  >
                    {!imgErrors.has(i) ? (
                      <Image
                        src={url}
                        alt={`${cake.name}${hasMultiple ? ` (${i + 1}/${cake.imageUrls.length})` : ""}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 672px"
                        className="object-contain bg-cream-dark"
                        onError={() => handleImgError(i)}
                        priority={i === 0}
                      />
                    ) : (
                      <div className="from-rose-light via-cream-dark to-parchment absolute inset-0 flex items-center justify-center bg-gradient-to-br">
                        <span className="text-8xl opacity-20 select-none">
                          k
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation arrows */}
              {hasMultiple && images.length > 1 && (
                <>
                  {activeIndex > 0 && (
                    <button
                      onClick={() => scrollTo(activeIndex - 1)}
                      aria-label="Fyrri mynd"
                      className="bg-warm-white/80 text-brown-dark hover:bg-warm-white absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-colors"
                    >
                      &#8249;
                    </button>
                  )}
                  {activeIndex < cake.imageUrls.length - 1 && (
                    <button
                      onClick={() => scrollTo(activeIndex + 1)}
                      aria-label="Næsta mynd"
                      className="bg-warm-white/80 text-brown-dark hover:bg-warm-white absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-colors"
                    >
                      &#8250;
                    </button>
                  )}
                </>
              )}

              {/* Dot indicators */}
              {hasMultiple && images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                  {cake.imageUrls.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollTo(i)}
                      aria-label={`Mynd ${i + 1}`}
                      className={[
                        "h-2 rounded-full transition-all duration-200",
                        activeIndex === i
                          ? "bg-warm-white w-4 shadow-sm"
                          : "bg-warm-white/50 hover:bg-warm-white/75 w-2",
                      ].join(" ")}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="from-rose-light via-cream-dark to-parchment aspect-[4/3] flex items-center justify-center bg-gradient-to-br">
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
