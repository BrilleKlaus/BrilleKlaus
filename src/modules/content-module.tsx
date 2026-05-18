import Image from "next/image";
import { getAboutContent } from "@/lib/contentful";

export default async function ContentModule() {
  const { heading, body, primaryImage, secondaryImage } =
    await getAboutContent();

  return (
    <section
      id="about"
      className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 px-2 py-24 md:py-32"
    >
      <div className="md:col-span-5 md:col-start-1 order-2 md:order-1">
        <div className="md:sticky md:top-24 md:pb-24 flex flex-col gap-6">
          <h2 className="text-[10px] md:text-[15px] uppercase tracking-[0.15em]">
            {heading}
          </h2>
          <p className="text-[10px] md:text-[15px] tracking-[0.15em] leading-[1.6] max-w-md whitespace-pre-line">
            {body}
          </p>
        </div>
      </div>

      <div className="md:col-span-7 md:col-start-6 order-1 md:order-2 flex flex-col gap-4">
        <div className="relative aspect-16/10 w-full">
          <Image
            src={primaryImage.src}
            alt={primaryImage.alt}
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="relative aspect-3/4 w-1/3 ml-auto">
          <Image
            src={secondaryImage.src}
            alt={secondaryImage.alt}
            fill
            sizes="(min-width: 768px) 19vw, 33vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
