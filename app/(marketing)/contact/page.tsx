"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import {
  PageHero,
  PageShell,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
} from "@/components/pages/page-sections";
import { AboutContactCta } from "@/components/about/about-contact-cta";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Enter a valid email"),
  message: z.string().min(10, "Tell us a bit more about your project"),
});

type ContactForm = z.infer<typeof contactSchema>;

const emptyForm: ContactForm = { name: "", email: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

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
    toast.success("Message ready — connect via Instagram to continue the conversation.");
    setForm(emptyForm);
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Questions, collaborations & general inquiries."
        description={`Reach ${company.name} for partnerships, press, academy info, or anything outside a studio booking. Based in ${company.location}.`}
      >
        <PrimaryButton href={company.social.instagram} external>
          Message on Instagram
        </PrimaryButton>
        <SecondaryButton href="/book">Book a session</SecondaryButton>
      </PageHero>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Studio"
            title="Where to find us"
            description="The fastest way to reach the team is through Instagram — share your project details, timeline, and production needs."
          />
          <div className="rounded-2xl border border-border bg-surface p-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Location
                </dt>
                <dd className="mt-1 text-sm text-foreground">{company.location}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Instagram
                </dt>
                <dd className="mt-1">
                  <a
                    href={company.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-accent hover:brightness-110"
                  >
                    @gmlawasonstudios
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Services
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  Filmmaking · Cinematography · Lighting · Scriptwriting
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-border bg-surface p-8"
          noValidate
        >
          <h2 className="font-display text-3xl text-foreground">Send a message</h2>
          <p className="mt-2 text-sm text-muted">
            For general questions or collaboration — not studio booking requests.
          </p>

          <div className="mt-6 space-y-4">
            <Field
              label="Name"
              id="name"
              value={form.name}
              error={errors.name}
              onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            />
            <Field
              label="Email"
              id="email"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            />
            <div>
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
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
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110 sm:w-auto"
          >
            Send inquiry
          </button>
        </form>
      </section>

      <AboutContactCta variant="contact" hideSocialDecor />
    </PageShell>
  );
}

function Field({
  label,
  id,
  value,
  error,
  onChange,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-1.5 w-full rounded-xl border bg-surface-elevated px-4 py-3 text-sm text-foreground outline-none transition",
          error ? "border-red-500/60 focus:border-red-500" : "border-border focus:border-accent",
        )}
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
