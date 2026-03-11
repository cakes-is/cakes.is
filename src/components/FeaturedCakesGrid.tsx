"use client";

import { useState } from "react";
import type { Cake } from "@/lib/types";
import CakeCard from "./CakeCard";
import CakeModal from "./CakeModal";

interface FeaturedCakesGridProps {
  cakes: Cake[];
}

export default function FeaturedCakesGrid({ cakes }: FeaturedCakesGridProps) {
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cakes.map((cake) => (
          <CakeCard key={cake.name} cake={cake} onOpen={setSelectedCake} />
        ))}
      </div>
      <CakeModal cake={selectedCake} onClose={() => setSelectedCake(null)} />
    </>
  );
}
