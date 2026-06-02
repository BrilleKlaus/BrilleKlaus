#!/usr/bin/env node
/**
 * Creates / updates the content models the site uses and seeds initial Danish
 * content for any entry that doesn't already exist.
 *
 * Idempotent: safe to run multiple times. Existing content types get any
 * missing fields added, and existing entries are left untouched.
 *
 * Usage:
 *   CONTENTFUL_SPACE_ID=xxx CONTENTFUL_MANAGEMENT_TOKEN=yyy \
 *     node scripts/setup-contentful.mjs
 *
 * Get a Management API token at:
 *   https://app.contentful.com/account/profile/cma_tokens
 * Revoke it after you're done.
 */

import { createClient } from "contentful-management";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

if (!spaceId || !managementToken) {
  console.error(
    "Missing env vars. Provide CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN.",
  );
  process.exit(1);
}

const client = createClient(
  { accessToken: managementToken },
  {
    type: "plain",
    defaults: { spaceId, environmentId },
  },
);

const locales = await client.locale.getMany({});
const defaultLocale =
  locales.items.find((l) => l.default)?.code ?? "en-US";

console.log(
  `Using space ${spaceId} / env ${environmentId} / locale ${defaultLocale}\n`,
);

/* -------------------------------------------------------------------------- */
/*  Content type definitions                                                   */
/* -------------------------------------------------------------------------- */

const symbol = (id, name, opts = {}) => ({
  id,
  name,
  type: "Symbol",
  required: opts.required ?? false,
  localized: false,
});

const text = (id, name, opts = {}) => ({
  id,
  name,
  type: "Text",
  required: opts.required ?? false,
  localized: false,
});

const assetArray = (id, name) => ({
  id,
  name,
  type: "Array",
  localized: false,
  items: { type: "Link", linkType: "Asset", validations: [] },
});

const entryArray = (id, name, linkContentType) => ({
  id,
  name,
  type: "Array",
  localized: false,
  items: {
    type: "Link",
    linkType: "Entry",
    validations: [{ linkContentType: [linkContentType] }],
  },
});

const contentTypes = [
  {
    id: "socialLink",
    name: "Social Link",
    displayField: "label",
    fields: [
      symbol("label", "Label", { required: true }),
      symbol("url", "URL", { required: true }),
    ],
  },
  {
    id: "heroSection",
    name: "Hero Section",
    displayField: "tagline",
    fields: [
      symbol("tagline", "Tagline", { required: true }),
      assetArray("backgroundImages", "Background images"),
    ],
  },
  {
    id: "manifestoSection",
    name: "Manifesto Section",
    displayField: "leftLine1",
    fields: [
      symbol("leftLine1", "Left line 1"),
      symbol("leftLine2", "Left line 2"),
      symbol("rightLine1", "Right line 1"),
      symbol("rightLine2", "Right line 2"),
      assetArray("images", "Images"),
    ],
  },
  {
    id: "aboutSection",
    name: "About Section",
    displayField: "heading",
    fields: [
      symbol("heading", "Heading"),
      text("body", "Body"),
      assetArray("primaryImages", "Primary images"),
      assetArray("secondaryImages", "Secondary images"),
    ],
  },
  {
    id: "processSection",
    name: "Process Section",
    displayField: "heading",
    fields: [
      symbol("heading", "Heading"),
      text("body", "Body"),
      assetArray("images1", "Images (row 1)"),
      assetArray("images2", "Images (row 2)"),
      assetArray("images3", "Images (row 3)"),
    ],
  },
  {
    id: "footerSection",
    name: "Footer Section",
    displayField: "heading",
    fields: [
      symbol("heading", "Heading"),
      symbol("firstNamePlaceholder", "First name placeholder"),
      symbol("lastNamePlaceholder", "Last name placeholder"),
      symbol("emailPlaceholder", "Email placeholder"),
      symbol("messagePlaceholder", "Message placeholder"),
      symbol("submitLabel", "Submit label"),
      symbol("submittingLabel", "Submitting label"),
      symbol("successMessage", "Success message"),
      symbol("errorMessage", "Error message"),
      symbol("brandName", "Brand name"),
      symbol("brandTagline", "Brand tagline"),
      symbol("hostLine", "Host line"),
      symbol("email", "Contact email"),
      symbol("phone", "Phone"),
      entryArray("socialLinks", "Social links", "socialLink"),
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Create / update content types                                              */
/* -------------------------------------------------------------------------- */

async function getContentTypeOrNull(contentTypeId) {
  try {
    return await client.contentType.get({ contentTypeId });
  } catch (err) {
    if (err?.name === "NotFound" || err?.status === 404) return null;
    if (typeof err?.message === "string" && err.message.includes("404")) {
      return null;
    }
    throw err;
  }
}

for (const ct of contentTypes) {
  const existing = await getContentTypeOrNull(ct.id);

  if (existing) {
    const existingIds = new Set(existing.fields.map((f) => f.id));
    const missing = ct.fields.filter((f) => !existingIds.has(f.id));
    if (missing.length > 0) {
      const updatedBody = {
        ...existing,
        name: ct.name,
        displayField: ct.displayField,
        fields: [...existing.fields, ...missing],
      };
      const updated = await client.contentType.update(
        { contentTypeId: ct.id },
        updatedBody,
      );
      await client.contentType.publish(
        { contentTypeId: ct.id },
        updated,
      );
      console.log(
        `✓ Patched ${ct.id} (added: ${missing.map((m) => m.id).join(", ")})`,
      );
    } else {
      console.log(`· ${ct.id} already up to date`);
    }
  } else {
    const created = await client.contentType.createWithId(
      { contentTypeId: ct.id },
      {
        name: ct.name,
        displayField: ct.displayField,
        fields: ct.fields,
      },
    );
    await client.contentType.publish({ contentTypeId: ct.id }, created);
    console.log(`✓ Created ${ct.id}`);
  }
}

/* -------------------------------------------------------------------------- */
/*  Danish seed content                                                        */
/* -------------------------------------------------------------------------- */

const seeds = {
  heroSection: {
    tagline: "optiker",
  },
  manifestoSection: {
    leftLine1: "Ikke bare briller",
    leftLine2: "En oplevelse",
    rightLine1: "Ind i en ny verden af briller",
    rightLine2: "Klaus Berthelsen",
  },
  aboutSection: {
    heading: "Om Brilleklaus",
    body: "Drevet af Klaus Berthelsen – hos os handler det om dit syn og din stil. Derfor er vi grundige, når vi sliber glas, og kræsne, når vi vælger stel til dig med kant og personlighed.",
  },
  processSection: {
    heading: "Sådan arbejder vi",
    body: "Hos os handler det om dit syn og din stil. Derfor er vi grundige, når vi sliber glas, og kræsne, når vi vælger stel til dig med kant og personlighed.",
  },
  footerSection: {
    heading: "Kom i kontakt",
    firstNamePlaceholder: "Fornavn",
    lastNamePlaceholder: "Efternavn",
    emailPlaceholder: "Email",
    messagePlaceholder: "Skriv din besked",
    submitLabel: "Send besked",
    submittingLabel: "Sender …",
    successMessage:
      "Tak for din besked – vi vender tilbage hurtigst muligt.",
    errorMessage: "Noget gik galt – prøv igen om lidt.",
    brandName: "BrilleKlaus",
    brandTagline: "Optiker siden XXXX",
    hostLine: "Drevet af Klaus Berthelsen",
    email: "studio@brilleklaus.dk",
    phone: "+45 3315 0184",
  },
};

const socialLinkSeed = {
  label: "Instagram",
  url: "https://www.instagram.com/",
};

const localize = (fields) =>
  Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, { [defaultLocale]: v }]),
  );

let socialLinkEntryId = null;
{
  const existing = await client.entry.getMany({
    query: { content_type: "socialLink", limit: 1 },
  });
  if (existing.items.length > 0) {
    socialLinkEntryId = existing.items[0].sys.id;
    console.log(`· socialLink entry already exists (${socialLinkEntryId})`);
  } else {
    const entry = await client.entry.create(
      { contentTypeId: "socialLink" },
      { fields: localize(socialLinkSeed) },
    );
    await client.entry.publish({ entryId: entry.sys.id }, entry);
    socialLinkEntryId = entry.sys.id;
    console.log(`✓ Seeded socialLink (${socialLinkEntryId})`);
  }
}

for (const [contentTypeId, fields] of Object.entries(seeds)) {
  const existing = await client.entry.getMany({
    query: { content_type: contentTypeId, limit: 1 },
  });
  if (existing.items.length > 0) {
    console.log(`· ${contentTypeId} entry already exists — leaving untouched`);
    continue;
  }

  const entryFields = localize(fields);
  if (contentTypeId === "footerSection" && socialLinkEntryId) {
    entryFields.socialLinks = {
      [defaultLocale]: [
        { sys: { type: "Link", linkType: "Entry", id: socialLinkEntryId } },
      ],
    };
  }

  const entry = await client.entry.create(
    { contentTypeId },
    { fields: entryFields },
  );
  await client.entry.publish({ entryId: entry.sys.id }, entry);
  console.log(`✓ Seeded ${contentTypeId}`);
}

console.log("\nDone.");
