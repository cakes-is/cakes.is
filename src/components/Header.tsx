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
    <header className="sticky top-0 z-40 bg-warm-white/95 backdrop-blur-sm border-b border-border">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-brown-dark hover:text-rose-dark transition-colors duration-200"
          >
            BeibíCakes
          </Link>

          <nav aria-label="Aðal valmynd" className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brown font-medium hover:text-brown-dark transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-dark transition-all duration-200 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/order"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-rose-dark text-warm-white text-sm font-medium hover:bg-accent-hover transition-colors duration-200"
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
