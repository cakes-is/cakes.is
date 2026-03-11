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
        className="hover:bg-cream-dark flex flex-col gap-1.5 rounded-md p-2 transition-colors duration-200 lg:hidden"
      >
        <span
          className={[
            "bg-brown-dark block h-0.5 w-5 origin-center transition-all duration-300",
            isOpen ? "translate-y-2 rotate-45" : "",
          ].join(" ")}
        />
        <span
          className={[
            "bg-brown-dark block h-0.5 w-5 transition-all duration-300",
            isOpen ? "opacity-0" : "",
          ].join(" ")}
        />
        <span
          className={[
            "bg-brown-dark block h-0.5 w-5 origin-center transition-all duration-300",
            isOpen ? "-translate-y-2 -rotate-45" : "",
          ].join(" ")}
        />
      </button>

      <div
        className={[
          "bg-warm-white border-border fixed inset-x-0 top-[64px] overflow-hidden border-b shadow-lg transition-all duration-300 lg:hidden",
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
                  className="text-brown-dark hover:bg-cream-dark hover:text-rose-dark block px-6 py-3 font-medium transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-6 py-3">
              <Link
                href="/order"
                onClick={() => setIsOpen(false)}
                className="bg-rose-dark text-warm-white hover:bg-accent-hover inline-flex w-full items-center justify-center rounded-full px-6 py-3 font-medium transition-colors duration-200"
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
