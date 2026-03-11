import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-brown-dark text-cream mt-auto">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-3">
          <div>
            <h2 className="font-display text-cream mb-2 text-2xl">
              BeibíCakes
            </h2>
            <p className="text-cream/70 text-sm leading-relaxed">
              Sérsmíðaðar kökur fyrir sérstök tilefni. Gerðar með ást og
              vandvirkni.
            </p>
          </div>

          <nav aria-label="Tengilsíður">
            <h3 className="text-gold mb-4 text-sm font-semibold tracking-widest uppercase">
              Vefur
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Forsíða" },
                { href: "/cakes", label: "Kökur" },
                { href: "/order", label: "Panta" },
                { href: "/about", label: "Um okkur" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-cream text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-gold mb-4 text-sm font-semibold tracking-widest uppercase">
              Hafa samband
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://instagram.com/beibi_cakes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 hover:text-cream flex items-center gap-2 text-sm transition-colors duration-200"
                >
                  <span aria-hidden="true">@</span>
                  <span>BeibíCakes</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:orders@cakes.is"
                  className="text-cream/70 hover:text-cream text-sm transition-colors duration-200"
                >
                  orders@cakes.is
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-cream/10 flex flex-col items-center justify-between gap-2 border-t py-6 sm:flex-row">
          <p className="text-cream/50 text-sm">&copy; 2026 BeibíCakes</p>
          <p className="text-cream/30 text-xs">Gerð með ást á Íslandi</p>
        </div>
      </Container>
    </footer>
  );
}
