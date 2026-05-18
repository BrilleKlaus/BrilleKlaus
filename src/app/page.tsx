import Hero from "@/modules/hero";
import ContentModule from "@/modules/content-module";
import Manifesto from "@/modules/manifesto";
import Footer from "@/modules/footer";
import StickyCta from "@/components/sticky-cta";
import ContentModule2 from "@/modules/content-module2";

export default function Page() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <ContentModule />
      <ContentModule2 />
      <Footer />
      <StickyCta />
    </main>
  );
}
