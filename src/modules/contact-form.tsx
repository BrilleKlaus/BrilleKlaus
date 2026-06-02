"use client";

import { useState } from "react";

type ContactFormProps = {
  heading: string;
  firstNamePlaceholder: string;
  lastNamePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  errorMessage: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  heading,
  firstNamePlaceholder,
  lastNamePlaceholder,
  emailPlaceholder,
  messagePlaceholder,
  submitLabel,
  submittingLabel,
  successMessage,
  errorMessage,
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === "string") params.append(key, value);
    });

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error("Form submission failed:", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-6 uppercase max-w-xl">
        <p>{heading}</p>
        <p className="pt-8 normal-case">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-6 uppercase max-w-xl"
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
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
          name="email"
          placeholder={emailPlaceholder}
          type="email"
          required
        />
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
          disabled={status === "submitting"}
          className="uppercase pb-2 cursor-pointer disabled:opacity-50"
        >
          {status === "submitting" ? submittingLabel : submitLabel}
        </button>
      </div>

      {status === "error" && (
        <p className="text-red-600 normal-case">{errorMessage}</p>
      )}
    </form>
  );
}

type FormFieldProps = {
  name: string;
  placeholder: string;
  as?: "input" | "textarea";
  type?: "text" | "email";
  required?: boolean;
  rows?: number;
};

function FormField({
  name,
  placeholder,
  as = "input",
  type = "text",
  required,
  rows,
}: FormFieldProps) {
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
          required={required}
          className={`${sharedClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className={sharedClasses}
        />
      )}
    </label>
  );
}
