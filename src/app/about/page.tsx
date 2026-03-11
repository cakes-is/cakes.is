import type { Metadata } from "next";
import { getAboutContent } from "@/lib/sheets";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Um okkur — BeibíCakes",
  description:
    "Kynntu þér sögu BeibíCakes. Sérsmíðaðar kökur búnar til með ást og vandvirkni á Íslandi.",
};

export const revalidate = 300;

const sectionLabels: Record<string, string> = {
  story: "Saga okkar",
  mission: "Markmið okkar",
  values: "Gildi okkar",
  process: "Ferlið",
  contact: "Hafa samband",
};

const defaultContent: Record<string, string> = {
  story:
    "BeibíCakes hófst sem ástríða — elska til að baka og búa til eitthvað sérstakt fyrir fólk á sérstæðum tilefnum. Við trúum að hverja köku eigi að baka með hjarta og henni eigi að líta út eins og listaverk.",
  mission:
    "Markmið okkar er að gera drauma þína að raunveruleika. Hvort sem þú ert að skipuleggja afmæli, brúðkaup eða skírn, þá erum við hér til að hjálpa þér að búa til eitthvað sem fólk mun muna lengi.",
  values:
    "Gæði, sköpunarkraftur og ást til handverks eru kjarninn í öllu sem við gerum. Við notum aðeins ferska og gæða hráefni, og hvert verk er hannað frá grunni — engin tvö verk eru eins.",
};

export default async function AboutPage() {
  const content = await getAboutContent();
  const sections = Object.keys(content).length > 0 ? content : defaultContent;

  const orderedSections = [
    "story",
    "mission",
    "values",
    "process",
    ...Object.keys(sections).filter(
      (k) => !["story", "mission", "values", "process"].includes(k),
    ),
  ].filter((k) => sections[k]);

  return (
    <div className="py-16">
      <Container>
        <SectionHeading
          title="Um okkur"
          subtitle="Kyntu þér sögu BeibíCakes og hvað knýr okkur áfram"
        />

        <div className="mx-auto max-w-3xl">
          <div
            className="mb-12 flex h-48 items-center justify-center overflow-hidden rounded-2xl sm:h-64"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, #FDE8E8 0%, #FAF0E4 60%, #F5E6D3 100%)",
            }}
          >
            <span className="font-display text-rose-medium/40 text-5xl select-none">
              BeibíCakes
            </span>
          </div>

          <div className="space-y-12">
            {orderedSections.map((key, index) => (
              <section key={key} aria-labelledby={`section-${key}`}>
                <div className="mb-4 flex items-center gap-4">
                  <span
                    className="bg-rose-light border-rose-medium text-rose-dark font-display flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <h2
                    id={`section-${key}`}
                    className="font-display text-brown-dark text-2xl"
                  >
                    {sectionLabels[key] ?? key}
                  </h2>
                </div>
                <div className="pl-12">
                  <p className="text-brown text-lg leading-relaxed">
                    {sections[key]}
                  </p>
                </div>
              </section>
            ))}
          </div>

          <div
            className="mt-16 rounded-2xl p-8 text-center"
            style={{ background: "var(--color-cream-dark)" }}
          >
            <p className="font-display text-brown-dark mb-2 text-xl">
              Tilbúin(n) til að panta?
            </p>
            <p className="text-brown mb-6">
              Við hlökkum til að heyra frá þér og hjálpa þér að búa til eitthvað
              sérstakt.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/order">Panta köku</Button>
              <Button href="/cakes" variant="secondary">
                Skoða kökur
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
