import { getCakes } from "@/lib/sheets";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import CakeGallery from "@/components/CakeGallery";

export const revalidate = 300;

export default async function CakesPage() {
  const cakes = await getCakes();

  return (
    <div className="py-16">
      <Container>
        <SectionHeading
          title="Kökurnar okkar"
          subtitle="Hverja köku semjum við sérstaklega fyrir þig — engar tvær kökur eru eins."
        />
        <CakeGallery cakes={cakes} />
      </Container>
    </div>
  );
}
