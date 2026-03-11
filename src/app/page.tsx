import Link from "next/link";
import { getFeaturedCakes } from "@/lib/sheets";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import FeaturedCakesGrid from "@/components/FeaturedCakesGrid";

export const revalidate = 300;

export default async function HomePage() {
  const featuredCakes = await getFeaturedCakes();

  return (
    <>
      <section
        aria-label="Kynning"
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, #FDE8E8 0%, #FFF8F0 40%, #FAF0E4 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(244,197,197,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(201,169,110,0.15) 0%, transparent 40%)
            `,
          }}
        />

        <div
          aria-hidden="true"
          className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(201,109,110,0.3) 40px,
              rgba(201,109,110,0.3) 41px
            )`,
          }}
        />

        <Container className="relative z-10 py-24">
          <div className="max-w-2xl">
            <p className="text-rose-dark text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              Handsmíðaðar kökur
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-brown-dark leading-tight mb-6">
              BeibíCakes
            </h1>
            <p className="text-xl text-brown leading-relaxed mb-3 max-w-xl">
              Sérsmíðaðar kökur fyrir sérstök tilefni
            </p>
            <p className="text-base text-brown/80 leading-relaxed mb-10 max-w-lg">
              Hvert verk er hannað með ást og vandvirkni — frá einlægum afmæliskökum til glæsilegra brúðkaupskaka.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/cakes" size="lg">
                Skoða kökur
              </Button>
              <Button href="/order" variant="secondary" size="lg">
                Panta köku
              </Button>
            </div>
          </div>
        </Container>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-cream))",
          }}
        />
      </section>

      {featuredCakes.length > 0 && (
        <section aria-label="Vinsælar kökur" className="py-20">
          <Container>
            <SectionHeading
              title="Vinsælar kökur"
              subtitle="Handvaldar uppáhaldsur viðskiptavina okkar"
              centered
            />
            <FeaturedCakesGrid cakes={featuredCakes} />
            <div className="mt-12 text-center">
              <Button href="/cakes" variant="secondary">
                Sjá allar kökur &rarr;
              </Button>
            </div>
          </Container>
        </section>
      )}

      <section
        aria-label="Um BeibíCakes"
        className="py-20"
        style={{ background: "var(--color-cream-dark)" }}
      >
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="block h-px w-12 bg-gold" />
              <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">
                Saga okkar
              </span>
              <span className="block h-px w-12 bg-gold" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-brown-dark mb-6 leading-tight">
              Gerðar með ást og vandvirkni
            </h2>
            <p className="text-brown text-lg leading-relaxed mb-8">
              BeibíCakes er heimabakari á Íslandi sem sérhæfir sig í sérsmíðuðum kökum. Við trúum á að hvert tilefni á skilið köku sem er jafn sérstæð og þú ert.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-rose-dark font-medium hover:text-accent-hover transition-colors duration-200 group"
            >
              Lesa meira um okkur
              <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </Container>
      </section>

      <section
        aria-label="Hafðu samband"
        className="py-20"
        style={{
          background: "linear-gradient(135deg, var(--color-brown-dark) 0%, var(--color-chocolate) 100%)",
        }}
      >
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl text-cream mb-4">
              Ertu tilbúin(n) að panta þína drauma köku?
            </h2>
            <p className="text-cream/70 text-lg mb-8">
              Við erum hér til að hjálpa þér að skapa eitthvað sérstakt. Hafðu samband og við munum gera drauma þína að veruleika.
            </p>
            <Button href="/order" size="lg" className="bg-cream text-brown-dark hover:bg-parchment border-cream">
              Panta köku núna
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
