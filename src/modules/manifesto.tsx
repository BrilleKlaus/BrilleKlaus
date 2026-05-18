import LogoBlack from "@/components/logos/logo-black";
import RotatingImage from "@/components/rotating-image";
import { getManifestoContent } from "@/lib/contentful";

export default async function Manifesto() {
  const { leftLine1, leftLine2, rightLine1, rightLine2, images } =
    await getManifestoContent();

  return (
    <section
      id="manifesto"
      className="grid md:grid-cols-8 grid-cols-1 order-2 md:order-1 pt-10 md:pt-0 px-2 pb-48 gap-y-20 md:gap-0"
    >
      <div className="relative col-span-2 ml-auto aspect-3/4 w-2/3 md:ml-0 md:w-auto md:col-start-7 md:row-start-1">
        <RotatingImage
          images={images}
          sizes="(min-width: 768px) 25vw, 66vw"
          className="object-cover"
        />
      </div>

      <div className="col-span-3 row-start-1">
        <div className="md:sticky md:top-24 md:pt-5 flex gap-6">
          <div className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.15em] md:text-[15px] whitespace-nowrap">
            <div className="mb-1 w-20 md:w-24 [&>svg]:h-auto [&>svg]:w-full">
              <LogoBlack />
            </div>
            <p>{leftLine1}</p>
            <p>{leftLine2}</p>
          </div>

          <div className="col-span-12 flex flex-col items-end text-right text-[10px] uppercase tracking-[0.15em] md:col-span-4 md:text-[15px] whitespace-nowrap">
            <p>{rightLine1}</p>
            <p>{rightLine2}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
