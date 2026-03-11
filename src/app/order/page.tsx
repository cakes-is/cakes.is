import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import OrderForm from "./OrderForm";

export default function OrderPage() {
  return (
    <div className="py-16">
      <Container>
        <div className="max-w-2xl mx-auto">
          <SectionHeading
            title="Panta köku"
            subtitle="Fylltu út formið hér að neðan og við munum hafa samband við þig fljótlega."
          />

          <div
            className="bg-warm-white rounded-2xl p-8 sm:p-10 border border-border"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <OrderForm />
          </div>

          <p className="mt-6 text-center text-sm text-brown/70">
            Eða sendu okkur tölvupóst beint á{" "}
            <a
              href="mailto:orders@cakes.is"
              className="text-rose-dark hover:text-accent-hover underline underline-offset-2 transition-colors duration-200"
            >
              orders@cakes.is
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
}
