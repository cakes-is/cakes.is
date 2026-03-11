"use client";

import { useState } from "react";
import type { Cake } from "@/lib/types";
import { type Category, CATEGORIES } from "@/lib/types";
import CakeCard from "@/components/CakeCard";
import CakeModal from "@/components/CakeModal";
import CategoryFilter from "@/components/CategoryFilter";

interface CakeGalleryProps {
  cakes: Cake[];
}

export default function CakeGallery({ cakes }: CakeGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

  const filteredCakes =
    activeCategory === "Allt"
      ? cakes
      : cakes.filter((c) => c.category === activeCategory);

  return (
    <>
      <div className="mb-8">
        <CategoryFilter
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      {filteredCakes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brown text-lg">
            Engar kökur í þessum flokki sem stendur.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCakes.map((cake) => (
            <CakeCard key={cake.name} cake={cake} onOpen={setSelectedCake} />
          ))}
        </div>
      )}

      <CakeModal cake={selectedCake} onClose={() => setSelectedCake(null)} />
    </>
  );
}
