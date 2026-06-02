import { getFooterContent } from "@/lib/contentful";
import { ContactForm } from "./contact-form";

export default async function Footer() {
  const {
    heading,
    firstNamePlaceholder,
    lastNamePlaceholder,
    emailPlaceholder,
    messagePlaceholder,
    submitLabel,
    submittingLabel,
    successMessage,
    errorMessage,
    brandName,
    brandTagline,
    hostLine,
    email,
    phone,
    socialLinks,
  } = await getFooterContent();

  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <footer
      id="footer"
      className="px-2 pt-15 md:pt-32 pb-12 flex flex-col gap-32 md:gap-48"
    >
      <ContactForm
        heading={heading}
        firstNamePlaceholder={firstNamePlaceholder}
        lastNamePlaceholder={lastNamePlaceholder}
        emailPlaceholder={emailPlaceholder}
        messagePlaceholder={messagePlaceholder}
        submitLabel={submitLabel}
        submittingLabel={submittingLabel}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      <div className="flex flex-col space-y-6 md:grid md:grid-cols-4 gap-x-8 md:gap-y-10">
        <p className="uppercase">
          <span className="normal-case">{brandName}</span> – {brandTagline}
        </p>
        <p>{hostLine}</p>
        <div className="flex flex-col gap-1">
          <a href={`mailto:${email}`} className="hover:underline">
            {email}
          </a>
          <a href={telHref} className="hover:underline">
            {phone}
          </a>
        </div>
        <div className="flex flex-col gap-1">
          {socialLinks.map(({ label, url }) => (
            <a
              key={`${label}-${url}`}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline capitalize"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
