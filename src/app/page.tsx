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
        className="relative flex min-h-[85vh] items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, #FDE8E8 0%, #FFF8F0 40%, #FAF0E4 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(244,197,197,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(201,169,110,0.15) 0%, transparent 40%)
            `,
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 h-full w-1/2 opacity-10"
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
            <p className="text-rose-dark mb-4 text-sm font-semibold tracking-[0.2em] uppercase">
              Handsmíðaðar kökur
            </p>
            <h1 className="font-display text-brown-dark mb-6 text-5xl leading-tight sm:text-6xl lg:text-7xl">
              BeibíCakes
            </h1>
            <p className="text-brown mb-3 max-w-xl text-xl leading-relaxed">
              Sérsmíðaðar kökur fyrir sérstök tilefni
            </p>
            <p className="text-brown/80 mb-10 max-w-lg text-base leading-relaxed">
              Hvert verk er hannað með ást og vandvirkni — frá einlægum
              afmæliskökum til glæsilegra brúðkaupskaka.
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
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-24"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--color-cream))",
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
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="bg-gold block h-px w-12" />
              <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase">
                Saga okkar
              </span>
              <span className="bg-gold block h-px w-12" />
            </div>
            <h2 className="font-display text-brown-dark mb-6 text-3xl leading-tight sm:text-4xl">
              Gerðar með ást og vandvirkni
            </h2>
            <p className="text-brown mb-8 text-lg leading-relaxed">
              BeibíCakes er heimabakari á Íslandi sem sérhæfir sig í sérsmíðuðum
              kökum. Við trúum á að hvert tilefni á skilið köku sem er jafn
              sérstæð og þú ert.
            </p>
            <Link
              href="/about"
              className="text-rose-dark hover:text-accent-hover group inline-flex items-center gap-2 font-medium transition-colors duration-200"
            >
              Lesa meira um okkur
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </Container>
      </section>

      <section
        aria-label="Hafðu samband"
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, var(--color-brown-dark) 0%, var(--color-chocolate) 100%)",
        }}
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-cream mb-4 text-3xl sm:text-4xl">
              Ertu tilbúin(n) að panta þína drauma köku?
            </h2>
            <p className="text-cream/70 mb-8 text-lg">
              Við erum hér til að hjálpa þér að skapa eitthvað sérstakt. Hafðu
              samband og við munum gera drauma þína að veruleika.
            </p>
            <Button
              href="/order"
              size="lg"
              className="bg-cream text-brown-dark hover:bg-parchment border-cream"
            >
              Panta köku núna
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
