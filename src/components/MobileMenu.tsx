"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Forsíða" },
  { href: "/cakes", label: "Kökur" },
  { href: "/order", label: "Panta" },
  { href: "/about", label: "Um okkur" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Loka valmynd" : "Opna valmynd"}
        aria-expanded={isOpen}
        className="lg:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-cream-dark transition-colors duration-200"
      >
        <span
          className={[
            "block w-5 h-0.5 bg-brown-dark transition-all duration-300 origin-center",
            isOpen ? "rotate-45 translate-y-2" : "",
          ].join(" ")}
        />
        <span
          className={[
            "block w-5 h-0.5 bg-brown-dark transition-all duration-300",
            isOpen ? "opacity-0" : "",
          ].join(" ")}
        />
        <span
          className={[
            "block w-5 h-0.5 bg-brown-dark transition-all duration-300 origin-center",
            isOpen ? "-rotate-45 -translate-y-2" : "",
          ].join(" ")}
        />
      </button>

      <div
        className={[
          "lg:hidden fixed inset-x-0 top-[64px] bg-warm-white border-b border-border shadow-lg transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav aria-label="Farsíma valmynd">
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-6 py-3 text-brown-dark font-medium hover:bg-cream-dark hover:text-rose-dark transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-6 py-3">
              <Link
                href="/order"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full bg-rose-dark text-warm-white font-medium hover:bg-accent-hover transition-colors duration-200"
              >
                Panta köku
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
