import LogoWhite from "@/components/logos/logo-white";
import RotatingImage from "@/components/rotating-image";
import { getHeroContent } from "@/lib/contentful";

export default async function Hero() {
  const { tagline, backgroundImages } = await getHeroContent();

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-black text-white">
      <RotatingImage
        images={backgroundImages}
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[600px] [&>svg]:h-auto [&>svg]:w-full">
          <LogoWhite />
        </div>
        <span className="mt-2 uppercase leading-none tracking-[0.02em] text-[clamp(2rem,11vw,4.5rem)]">
          {tagline}
        </span>
      </div>
    </section>
  );
}
