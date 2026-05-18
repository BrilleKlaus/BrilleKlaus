import "server-only";
import { cache } from "react";
import {
  createClient,
  type Asset,
  type ContentfulClientApi,
  type EntryFieldTypes,
} from "contentful";

/* -------------------------------------------------------------------------- */
/*  Client                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Returns a configured Contentful client, or `null` when env vars are missing.
 *
 * We return `null` (rather than throwing) so the site can render with the
 * fallback content during local development before CMS credentials are wired
 * up.
 */
const getClient = cache((): ContentfulClientApi<undefined> | null => {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

  if (!space || !accessToken) return null;

  return createClient({ space, accessToken, environment });
});

/* -------------------------------------------------------------------------- */
/*  Asset helper                                                              */
/* -------------------------------------------------------------------------- */

/** Public shape an image needs to render in a module. */
export type ImageContent = {
  src: string;
  alt: string;
};

/**
 * Contentful returns protocol-relative asset URLs (`//images.ctfassets.net/...`).
 * We prefix `https:` so `next/image` accepts them.
 */
function resolveAsset(
  asset: Asset<undefined, string> | undefined,
  fallback: ImageContent,
): ImageContent {
  const file = asset?.fields.file;
  if (!file?.url) return fallback;
  const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;
  const alt =
    (typeof asset?.fields.title === "string" && asset.fields.title) ||
    (typeof asset?.fields.description === "string" &&
      asset.fields.description) ||
    fallback.alt;
  return { src: url, alt };
}

/* -------------------------------------------------------------------------- */
/*  Entry skeletons (mirror the content models in Contentful)                 */
/* -------------------------------------------------------------------------- */

type HeroSkeleton = {
  contentTypeId: "heroSection";
  fields: {
    tagline: EntryFieldTypes.Symbol;
    backgroundImage: EntryFieldTypes.AssetLink;
  };
};

type ManifestoSkeleton = {
  contentTypeId: "manifestoSection";
  fields: {
    leftLine1: EntryFieldTypes.Symbol;
    leftLine2: EntryFieldTypes.Symbol;
    rightLine1: EntryFieldTypes.Symbol;
    rightLine2: EntryFieldTypes.Symbol;
    image: EntryFieldTypes.AssetLink;
  };
};

type AboutSkeleton = {
  contentTypeId: "aboutSection";
  fields: {
    heading: EntryFieldTypes.Symbol;
    body: EntryFieldTypes.Text;
    primaryImage: EntryFieldTypes.AssetLink;
    secondaryImage: EntryFieldTypes.AssetLink;
  };
};

type ProcessSkeleton = {
  contentTypeId: "processSection";
  fields: {
    heading: EntryFieldTypes.Symbol;
    body: EntryFieldTypes.Text;
    image1: EntryFieldTypes.AssetLink;
    image2: EntryFieldTypes.AssetLink;
    image3: EntryFieldTypes.AssetLink;
  };
};

type FooterSkeleton = {
  contentTypeId: "footerSection";
  fields: {
    heading: EntryFieldTypes.Symbol;
  };
};

/* -------------------------------------------------------------------------- */
/*  Public content shapes consumed by modules                                 */
/* -------------------------------------------------------------------------- */

export type HeroContent = {
  tagline: string;
  backgroundImage: ImageContent;
};

export type ManifestoContent = {
  leftLine1: string;
  leftLine2: string;
  rightLine1: string;
  rightLine2: string;
  image: ImageContent;
};

export type AboutContent = {
  heading: string;
  body: string;
  primaryImage: ImageContent;
  secondaryImage: ImageContent;
};

export type ProcessContent = {
  heading: string;
  body: string;
  image1: ImageContent;
  image2: ImageContent;
  image3: ImageContent;
};

export type FooterContent = {
  heading: string;
};

/* -------------------------------------------------------------------------- */
/*  Fallback content (current dummy data)                                     */
/* -------------------------------------------------------------------------- */

const PLACEHOLDER_IMAGE: ImageContent = {
  src: "/assets/images/Klaus Berthelsen Frame 44.png",
  alt: "Klaus Berthelsen",
};

const FALLBACK = {
  hero: {
    tagline: "optiker",
    backgroundImage: { ...PLACEHOLDER_IMAGE, alt: "" },
  } satisfies HeroContent,

  manifesto: {
    leftLine1: "Not just glasses",
    leftLine2: "Experience",
    rightLine1: "Into a new world of glasses",
    rightLine2: "Klaus Berthelsen",
    image: PLACEHOLDER_IMAGE,
  } satisfies ManifestoContent,

  about: {
    heading: "About Brilleklaus",
    body: "Host by Klaus Berthelsen — with us, it's all about your vision and your style. That's why we're thorough when we grind glass and discerning when we choose frames for you with edge and personality.",
    primaryImage: PLACEHOLDER_IMAGE,
    secondaryImage: PLACEHOLDER_IMAGE,
  } satisfies AboutContent,

  process: {
    heading: "About Brilleklaus",
    body: "With us, it's all about your vision and your style. That's why we're thorough when we grind glass and discerning when we choose frames for you with edge and personality.",
    image1: PLACEHOLDER_IMAGE,
    image2: PLACEHOLDER_IMAGE,
    image3: PLACEHOLDER_IMAGE,
  } satisfies ProcessContent,

  footer: {
    heading: "Get in touch",
  } satisfies FooterContent,
};

/* -------------------------------------------------------------------------- */
/*  Generic single-entry fetcher                                              */
/* -------------------------------------------------------------------------- */

/**
 * Fetch the first published entry of a content type. Returns `null` if the
 * client isn't configured, no entry exists, or the request fails. Errors are
 * swallowed (and logged) so a CMS outage never crashes the page — modules
 * fall back to their dummy content.
 */
async function fetchFirstEntry<
  T extends {
    contentTypeId: string;
    fields: Record<string, EntryFieldTypes.Symbol | EntryFieldTypes.Text | EntryFieldTypes.AssetLink>;
  },
>(contentTypeId: T["contentTypeId"]) {
  const client = getClient();
  if (!client) return null;

  try {
    const res = await client.withoutUnresolvableLinks.getEntries<T>({
      content_type: contentTypeId,
      limit: 1,
      include: 2,
    });
    return res.items[0] ?? null;
  } catch (err) {
    console.warn(
      `[contentful] failed to fetch "${contentTypeId}", using fallback:`,
      err,
    );
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Per-section fetchers                                                      */
/* -------------------------------------------------------------------------- */

export const getHeroContent = cache(async (): Promise<HeroContent> => {
  const entry = await fetchFirstEntry<HeroSkeleton>("heroSection");
  if (!entry) return FALLBACK.hero;
  return {
    tagline: entry.fields.tagline ?? FALLBACK.hero.tagline,
    backgroundImage: resolveAsset(
      entry.fields.backgroundImage,
      FALLBACK.hero.backgroundImage,
    ),
  };
});

export const getManifestoContent = cache(
  async (): Promise<ManifestoContent> => {
    const entry = await fetchFirstEntry<ManifestoSkeleton>("manifestoSection");
    if (!entry) return FALLBACK.manifesto;
    return {
      leftLine1: entry.fields.leftLine1 ?? FALLBACK.manifesto.leftLine1,
      leftLine2: entry.fields.leftLine2 ?? FALLBACK.manifesto.leftLine2,
      rightLine1: entry.fields.rightLine1 ?? FALLBACK.manifesto.rightLine1,
      rightLine2: entry.fields.rightLine2 ?? FALLBACK.manifesto.rightLine2,
      image: resolveAsset(entry.fields.image, FALLBACK.manifesto.image),
    };
  },
);

export const getAboutContent = cache(async (): Promise<AboutContent> => {
  const entry = await fetchFirstEntry<AboutSkeleton>("aboutSection");
  if (!entry) return FALLBACK.about;
  return {
    heading: entry.fields.heading ?? FALLBACK.about.heading,
    body: entry.fields.body ?? FALLBACK.about.body,
    primaryImage: resolveAsset(
      entry.fields.primaryImage,
      FALLBACK.about.primaryImage,
    ),
    secondaryImage: resolveAsset(
      entry.fields.secondaryImage,
      FALLBACK.about.secondaryImage,
    ),
  };
});

export const getProcessContent = cache(async (): Promise<ProcessContent> => {
  const entry = await fetchFirstEntry<ProcessSkeleton>("processSection");
  if (!entry) return FALLBACK.process;
  return {
    heading: entry.fields.heading ?? FALLBACK.process.heading,
    body: entry.fields.body ?? FALLBACK.process.body,
    image1: resolveAsset(entry.fields.image1, FALLBACK.process.image1),
    image2: resolveAsset(entry.fields.image2, FALLBACK.process.image2),
    image3: resolveAsset(entry.fields.image3, FALLBACK.process.image3),
  };
});

export const getFooterContent = cache(async (): Promise<FooterContent> => {
  const entry = await fetchFirstEntry<FooterSkeleton>("footerSection");
  if (!entry) return FALLBACK.footer;
  return {
    heading: entry.fields.heading ?? FALLBACK.footer.heading,
  };
});
