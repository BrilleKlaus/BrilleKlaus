import { getFooterContent } from "@/lib/contentful";

export default async function Footer() {
  const { heading } = await getFooterContent();

  return (
    <footer
      id="footer"
      className="px-2 pt-32 pb-12 flex flex-col gap-32 md:gap-48"
    >
      <form
        className="flex flex-col gap-6 text-[10px] md:text-[15px] uppercase tracking-[0.15em] max-w-xl"
        action="#"
      >
        <p>{heading}</p>

        <div className="flex flex-col gap-5 pt-8">
          <FormField name="firstName" placeholder="First name" />
          <FormField name="lastName" placeholder="Last name" />
          <FormField
            name="message"
            placeholder="Leave your message"
            as="textarea"
            rows={4}
          />
        </div>

        <div className="pt-8 border-b border-black w-full">
          <button
            type="submit"
            className="uppercase tracking-[0.15em] pb-2 cursor-pointer"
          >
            Send your message
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 text-[10px] md:text-[15px] tracking-[0.15em]">
        <p className="uppercase">
          <span className="normal-case">BrilleKlaus</span> – Optiker since XXXX
        </p>
        <p>Host by Klaus Berthelsen</p>
        <div className="flex flex-col gap-1">
          <a href="mailto:butik@nr-26.dk" className="hover:underline">
            butik@nr-26.dk
          </a>
          <a href="tel:+4533150184" className="hover:underline">
            +45 3315 0184
          </a>
        </div>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          Instagram
        </a>
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
    "flex-1 bg-transparent border-0 outline-none normal-case tracking-[0.15em] placeholder:uppercase placeholder:text-neutral-400";

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
