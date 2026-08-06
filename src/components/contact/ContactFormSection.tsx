"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  message: z.string().min(10, "Tell us a bit more about your project"),
});

type ContactForm = z.infer<typeof contactSchema>;

const emptyForm: ContactForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

const countryCodes = [
  { code: "+234", label: "NG" },
  { code: "+1", label: "US" },
  { code: "+44", label: "UK" },
  { code: "+27", label: "ZA" },
] as const;

export function ContactFormSection() {
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [countryCode, setCountryCode] = useState<(typeof countryCodes)[number]["code"]>(
    "+234",
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactForm, string>>
  >({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = contactSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactForm;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the form errors");
      return;
    }

    setErrors({});
    toast.success(
      "Message ready — we'll follow up via Instagram to continue the conversation.",
    );
    setForm(emptyForm);
  }

  return (
    <section className="relative overflow-hidden pb-28 pt-28 md:pb-36 md:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#ecfdf5_0%,#f8fafc_55%,#ffffff_100%)] dark:bg-[linear-gradient(180deg,#052e16_0%,#0a0a0a_55%,#0a0a0a_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(22,163,74,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,163,74,0.06)_1px,transparent_1px)] [background-size:48px_48px] dark:opacity-[0.12]"
      />

      <div className="relative mx-auto w-full max-w-3xl px-6 text-center">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-5xl">
          Contact {company.shortName}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Reach {company.name} for collaborations, production bookings, academy
          inquiries, and press — from Ikorodu, Lagos to sets across Nollywood.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto mt-10 max-w-xl rounded-[1.75rem] border border-border/80 bg-surface/95 p-6 text-left shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="First name"
              id="firstName"
              value={form.firstName}
              error={errors.firstName}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, firstName: value }))
              }
            />
            <Field
              label="Last name"
              id="lastName"
              value={form.lastName}
              error={errors.lastName}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, lastName: value }))
              }
            />
          </div>

          <div className="mt-4 space-y-4">
            <Field
              label="Email"
              id="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              error={errors.email}
              onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            />

            <div>
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone number
              </label>
              <div className="mt-1.5 flex gap-2">
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(event) =>
                      setCountryCode(
                        event.target.value as (typeof countryCodes)[number]["code"],
                      )
                    }
                    className="h-full appearance-none rounded-xl border border-border bg-surface-elevated py-3 pl-3 pr-8 text-sm text-foreground outline-none transition focus:border-accent"
                    aria-label="Country code"
                  >
                    {countryCodes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label} {item.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden
                  />
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="801 234 5678"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className={cn(
                    "min-w-0 flex-1 rounded-xl border bg-surface-elevated px-4 py-3 text-sm text-foreground outline-none transition",
                    errors.phone
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-border focus:border-accent",
                  )}
                />
              </div>
              {errors.phone ? (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Leave us a message..."
                value={form.message}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, message: event.target.value }))
                }
                className={cn(
                  "mt-1.5 w-full rounded-xl border bg-surface-elevated px-4 py-3 text-sm text-foreground outline-none transition",
                  errors.message
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-border focus:border-accent",
                )}
              />
              {errors.message ? (
                <p className="mt-1 text-xs text-red-500">{errors.message}</p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_10px_30px_rgba(22,163,74,0.25)] transition hover:brightness-110"
          >
            Send message
          </button>
        </form>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-16 bg-background [clip-path:ellipse(120%_100%_at_50%_100%)]"
      />
    </section>
  );
}

function Field({
  label,
  id,
  value,
  error,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-1.5 w-full rounded-xl border bg-surface-elevated px-4 py-3 text-sm text-foreground outline-none transition",
          error
            ? "border-red-500/60 focus:border-red-500"
            : "border-border focus:border-accent",
        )}
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
