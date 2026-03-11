import Link from "next/link";
import Container from "./Container";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Forsíða" },
  { href: "/cakes", label: "Kökur" },
  { href: "/order", label: "Panta" },
  { href: "/about", label: "Um okkur" },
];

export default function Header() {
  return (
    <header className="bg-warm-white/95 border-border sticky top-0 z-40 border-b backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-brown-dark hover:text-rose-dark text-2xl font-bold transition-colors duration-200"
          >
            BeibíCakes
          </Link>

          <nav
            aria-label="Aðal valmynd"
            className="hidden items-center gap-8 lg:flex"
          >
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brown hover:text-brown-dark group relative font-medium transition-colors duration-200"
                  >
                    {link.label}
                    <span className="bg-rose-dark absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-200 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/order"
              className="bg-rose-dark text-warm-white hover:bg-accent-hover inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200"
            >
              Panta köku
            </Link>
          </div>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
