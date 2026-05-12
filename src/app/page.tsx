import Hero from "@/modules/hero";
import Manifesto from "@/modules/manifesto";
import Footer from "@/modules/footer";
import StickyCta from "@/components/sticky-cta";

export default function Page() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Footer />
      <StickyCta />
    </main>
  );
}
