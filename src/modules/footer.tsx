import { getFooterContent } from "@/lib/contentful";

export default async function Footer() {
  const {
    heading,
    firstNamePlaceholder,
    lastNamePlaceholder,
    messagePlaceholder,
    submitLabel,
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
      <form
        className="flex flex-col gap-6 uppercase max-w-xl"
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p hidden>
          <label>
            Don&apos;t fill this out if you&apos;re human:{" "}
            <input name="bot-field" />
          </label>
        </p>

        <p>{heading}</p>

        <div className="flex flex-col gap-5 pt-8">
          <FormField name="firstName" placeholder={firstNamePlaceholder} />
          <FormField name="lastName" placeholder={lastNamePlaceholder} />
          <FormField
            name="message"
            placeholder={messagePlaceholder}
            as="textarea"
            rows={4}
          />
        </div>

        <div className="pt-8 border-b border-black w-full">
          <button
            type="submit"
            className="uppercase pb-2 cursor-pointer"
          >
            {submitLabel}
          </button>
        </div>
      </form>

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

type FormFieldProps = {
  name: string;
  placeholder: string;
  as?: "input" | "textarea";
  rows?: number;
};

function FormField({ name, placeholder, as = "input", rows }: FormFieldProps) {
  const sharedClasses =
    "flex-1 bg-transparent border-0 outline-none normal-case placeholder:uppercase placeholder:text-neutral-400";

  return (
    <label
      className={`group flex gap-3 ${as === "textarea" ? "items-start" : "items-center"}`}
    >
      <span
        aria-hidden
        className={`hidden group-focus-within:inline-block ${as === "textarea" ? "mt-px" : ""}`}
      >
        →
      </span>
      {as === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={rows}
          className={`${sharedClasses} resize-none`}
        />
      ) : (
        <input type="text" name={name} placeholder={placeholder} className={sharedClasses} />
      )}
    </label>
  );
}
