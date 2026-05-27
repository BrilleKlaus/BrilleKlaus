import RotatingImage from "@/components/rotating-image";
import { getAboutContent } from "@/lib/contentful";

export default async function ContentModule() {
  const { heading, body, primaryImages, secondaryImages } =
    await getAboutContent();

  return (
    <section
      id="about"
      className="grid grid-cols-1 md:grid-cols-12 md:gap-y-12 md:gap-x-8 px-4 md:py-32"
    >
      <div className="md:col-span-5 md:col-start-1 order-2 md:order-1 py-20 md:py-0">
        <div className="md:sticky md:top-24 md:pb-24 flex flex-col gap-6">
          <h2 className="uppercase">{heading}</h2>
          <p className="max-w-md whitespace-pre-line">{body}</p>
        </div>
      </div>

      <div className="md:col-span-7 md:col-start-6 order-1 md:order-2 flex flex-col gap-4">
        <div className="relative aspect-16/10 w-full">
          <RotatingImage
            images={primaryImages}
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="relative aspect-3/4 w-1/3 ml-auto">
          <RotatingImage
            images={secondaryImages}
            sizes="(min-width: 768px) 19vw, 33vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
