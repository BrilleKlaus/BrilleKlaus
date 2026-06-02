import "server-only";
import { cache } from "react";
import {
  createClient,
  type Asset,
  type ContentfulClientApi,
  type EntryFieldTypes,
  type EntrySkeletonType,
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
 *
 * Falls back to the provided default array when no assets resolve — so each
 * image slot always renders something.
 */
function resolveSocialLinks(
  entries:
    | ReadonlyArray<
        { fields?: { label?: string; url?: string } } | undefined
      >
    | undefined,
  fallback: SocialLink[],
): SocialLink[] {
  if (!entries || entries.length === 0) return fallback;
  const resolved: SocialLink[] = [];
  for (const entry of entries) {
    const label = entry?.fields?.label;
    const url = entry?.fields?.url;
    if (typeof label === "string" && typeof url === "string" && label && url) {
      resolved.push({ label, url });
    }
  }
  return resolved.length > 0 ? resolved : fallback;
}

function resolveAssets(
  assets: ReadonlyArray<Asset<undefined, string> | undefined> | undefined,
  fallback: ImageContent[],
): ImageContent[] {
  if (!assets || assets.length === 0) return fallback;
  const resolved: ImageContent[] = [];
  for (const asset of assets) {
    const file = asset?.fields.file;
    if (!file?.url) continue;
    const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;
    const alt =
      (typeof asset?.fields.title === "string" && asset.fields.title) ||
      (typeof asset?.fields.description === "string" &&
        asset.fields.description) ||
      fallback[0]?.alt ||
      "";
    resolved.push({ src: url, alt });
  }
  return resolved.length > 0 ? resolved : fallback;
}

/* -------------------------------------------------------------------------- */
/*  Entry skeletons (mirror the content models in Contentful)                 */
/* -------------------------------------------------------------------------- */

type AssetArray = EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;

type HeroSkeleton = {
  contentTypeId: "heroSection";
  fields: {
    tagline: EntryFieldTypes.Symbol;
    backgroundImages: AssetArray;
  };
};

type ManifestoSkeleton = {
  contentTypeId: "manifestoSection";
  fields: {
    leftLine1: EntryFieldTypes.Symbol;
    leftLine2: EntryFieldTypes.Symbol;
    rightLine1: EntryFieldTypes.Symbol;
    rightLine2: EntryFieldTypes.Symbol;
    images: AssetArray;
  };
};

type AboutSkeleton = {
  contentTypeId: "aboutSection";
  fields: {
    heading: EntryFieldTypes.Symbol;
    body: EntryFieldTypes.Text;
    primaryImages: AssetArray;
    secondaryImages: AssetArray;
  };
};

type ProcessSkeleton = {
  contentTypeId: "processSection";
  fields: {
    heading: EntryFieldTypes.Symbol;
    body: EntryFieldTypes.Text;
    images1: AssetArray;
    images2: AssetArray;
    images3: AssetArray;
  };
};

type SocialLinkSkeleton = {
  contentTypeId: "socialLink";
  fields: {
    label: EntryFieldTypes.Symbol;
    url: EntryFieldTypes.Symbol;
  };
};

type FooterSkeleton = {
  contentTypeId: "footerSection";
  fields: {
    heading: EntryFieldTypes.Symbol;
    firstNamePlaceholder: EntryFieldTypes.Symbol;
    lastNamePlaceholder: EntryFieldTypes.Symbol;
    emailPlaceholder: EntryFieldTypes.Symbol;
    messagePlaceholder: EntryFieldTypes.Symbol;
    submitLabel: EntryFieldTypes.Symbol;
    submittingLabel: EntryFieldTypes.Symbol;
    successMessage: EntryFieldTypes.Symbol;
    errorMessage: EntryFieldTypes.Symbol;
    brandName: EntryFieldTypes.Symbol;
    brandTagline: EntryFieldTypes.Symbol;
    hostLine: EntryFieldTypes.Symbol;
    email: EntryFieldTypes.Symbol;
    phone: EntryFieldTypes.Symbol;
    socialLinks: EntryFieldTypes.Array<
      EntryFieldTypes.EntryLink<SocialLinkSkeleton>
    >;
  };
};

/* -------------------------------------------------------------------------- */
/*  Public content shapes consumed by modules                                 */
/* -------------------------------------------------------------------------- */

export type HeroContent = {
  tagline: string;
  backgroundImages: ImageContent[];
};

export type ManifestoContent = {
  leftLine1: string;
  leftLine2: string;
  rightLine1: string;
  rightLine2: string;
  images: ImageContent[];
};

export type AboutContent = {
  heading: string;
  body: string;
  primaryImages: ImageContent[];
  secondaryImages: ImageContent[];
};

export type ProcessContent = {
  heading: string;
  body: string;
  images1: ImageContent[];
  images2: ImageContent[];
  images3: ImageContent[];
};

export type SocialLink = {
  label: string;
  url: string;
};

export type FooterContent = {
  heading: string;
  firstNamePlaceholder: string;
  lastNamePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  errorMessage: string;
  brandName: string;
  brandTagline: string;
  hostLine: string;
  email: string;
  phone: string;
  socialLinks: SocialLink[];
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
    backgroundImages: [{ ...PLACEHOLDER_IMAGE, alt: "" }],
  } satisfies HeroContent,

  manifesto: {
    leftLine1: "Not just glasses",
    leftLine2: "Experience",
    rightLine1: "Into a new world of glasses",
    rightLine2: "Klaus Berthelsen",
    images: [PLACEHOLDER_IMAGE],
  } satisfies ManifestoContent,

  about: {
    heading: "About Brilleklaus",
    body: "Host by Klaus Berthelsen — with us, it's all about your vision and your style. That's why we're thorough when we grind glass and discerning when we choose frames for you with edge and personality.",
    primaryImages: [PLACEHOLDER_IMAGE],
    secondaryImages: [PLACEHOLDER_IMAGE],
  } satisfies AboutContent,

  process: {
    heading: "About Brilleklaus",
    body: "With us, it's all about your vision and your style. That's why we're thorough when we grind glass and discerning when we choose frames for you with edge and personality.",
    images1: [PLACEHOLDER_IMAGE],
    images2: [PLACEHOLDER_IMAGE],
    images3: [PLACEHOLDER_IMAGE],
  } satisfies ProcessContent,

  footer: {
    heading: "Get in touch",
    firstNamePlaceholder: "First name",
    lastNamePlaceholder: "Last name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Leave your message",
    submitLabel: "Send your message",
    submittingLabel: "Sending…",
    successMessage:
      "Tak for din besked – vi vender tilbage hurtigst muligt.",
    errorMessage: "Noget gik galt – prøv igen om lidt.",
    brandName: "BrilleKlaus",
    brandTagline: "Optiker since XXXX",
    hostLine: "Host by Klaus Berthelsen",
    email: "butik@nr-26.dk",
    phone: "",
    socialLinks: [
      { label: "Instagram", url: "https://www.instagram.com/" },
    ],
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
    fields: Record<
      string,
      | EntryFieldTypes.Symbol
      | EntryFieldTypes.Text
      | EntryFieldTypes.AssetLink
      | AssetArray
      | EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeletonType>>
    >;
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
    backgroundImages: resolveAssets(
      entry.fields.backgroundImages,
      FALLBACK.hero.backgroundImages,
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
      images: resolveAssets(entry.fields.images, FALLBACK.manifesto.images),
    };
  },
);

export const getAboutContent = cache(async (): Promise<AboutContent> => {
  const entry = await fetchFirstEntry<AboutSkeleton>("aboutSection");
  if (!entry) return FALLBACK.about;
  return {
    heading: entry.fields.heading ?? FALLBACK.about.heading,
    body: entry.fields.body ?? FALLBACK.about.body,
    primaryImages: resolveAssets(
      entry.fields.primaryImages,
      FALLBACK.about.primaryImages,
    ),
    secondaryImages: resolveAssets(
      entry.fields.secondaryImages,
      FALLBACK.about.secondaryImages,
    ),
  };
});

export const getProcessContent = cache(async (): Promise<ProcessContent> => {
  const entry = await fetchFirstEntry<ProcessSkeleton>("processSection");
  if (!entry) return FALLBACK.process;
  return {
    heading: entry.fields.heading ?? FALLBACK.process.heading,
    body: entry.fields.body ?? FALLBACK.process.body,
    images1: resolveAssets(entry.fields.images1, FALLBACK.process.images1),
    images2: resolveAssets(entry.fields.images2, FALLBACK.process.images2),
    images3: resolveAssets(entry.fields.images3, FALLBACK.process.images3),
  };
});

export const getFooterContent = cache(async (): Promise<FooterContent> => {
  const entry = await fetchFirstEntry<FooterSkeleton>("footerSection");
  if (!entry) return FALLBACK.footer;
  const f = entry.fields;
  return {
    heading: f.heading ?? FALLBACK.footer.heading,
    firstNamePlaceholder:
      f.firstNamePlaceholder ?? FALLBACK.footer.firstNamePlaceholder,
    lastNamePlaceholder:
      f.lastNamePlaceholder ?? FALLBACK.footer.lastNamePlaceholder,
    emailPlaceholder:
      f.emailPlaceholder ?? FALLBACK.footer.emailPlaceholder,
    messagePlaceholder:
      f.messagePlaceholder ?? FALLBACK.footer.messagePlaceholder,
    submitLabel: f.submitLabel ?? FALLBACK.footer.submitLabel,
    submittingLabel: f.submittingLabel ?? FALLBACK.footer.submittingLabel,
    successMessage: f.successMessage ?? FALLBACK.footer.successMessage,
    errorMessage: f.errorMessage ?? FALLBACK.footer.errorMessage,
    brandName: f.brandName ?? FALLBACK.footer.brandName,
    brandTagline: f.brandTagline ?? FALLBACK.footer.brandTagline,
    hostLine: f.hostLine ?? FALLBACK.footer.hostLine,
    email: f.email ?? FALLBACK.footer.email,
    phone: f.phone ?? FALLBACK.footer.phone,
    socialLinks: resolveSocialLinks(
      f.socialLinks,
      FALLBACK.footer.socialLinks,
    ),
  };
});
