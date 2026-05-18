import { getFooterContent } from "@/lib/contentful";

export default async function Footer() {
  const { heading } = await getFooterContent();

  return (
    <footer id="footer" className=" py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.2em]">
          {heading}
        </h2>
      </div>
    </footer>
  );
}
