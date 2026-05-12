import Image from "next/image";
import LogoWhite from "@/components/logos/logo-white";

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-black text-white">
      <Image
        src="/assets/images/Klaus Berthelsen Frame 44.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[600px] [&>svg]:h-auto [&>svg]:w-full">
          <LogoWhite />
        </div>
        <span className="mt-2 uppercase leading-none tracking-[0.02em] text-[clamp(2rem,11vw,4.5rem)]">
          optiker
        </span>
      </div>
    </section>
  );
}
