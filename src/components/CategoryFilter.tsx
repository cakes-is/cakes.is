"use client";

import { CATEGORIES, type Category } from "@/lib/types";

interface CategoryFilterProps {
  activeCategory: Category;
  onChange: (category: Category) => void;
}

export default function CategoryFilter({
  activeCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Sía eftir flokki"
      className="flex flex-wrap gap-2"
    >
      {CATEGORIES.map((category) => {
        const isActive = category === activeCategory;
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-rose-dark text-warm-white border-rose-dark shadow-sm"
                : "bg-warm-white text-brown-dark border-border hover:border-rose-medium hover:bg-rose-light",
            ].join(" ")}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
