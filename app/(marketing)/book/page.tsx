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
import { company, services } from "@/lib/company";
import { cn } from "@/lib/utils";

const bookSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Enter a valid email"),
  service: z.string().min(1, "Select a service"),
  timeline: z.string().min(3, "Share your preferred dates or timeline"),
  details: z.string().min(10, "Tell us about the shoot or session you need"),
});

type BookForm = z.infer<typeof bookSchema>;

const emptyForm: BookForm = {
  name: "",
  email: "",
  service: "",
  timeline: "",
  details: "",
};

export default function BookPage() {
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof BookForm, string>>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = bookSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof BookForm;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the form errors");
      return;
    }

    setErrors({});
    toast.success("Booking request ready — we'll confirm via Instagram.");
    setForm(emptyForm);
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Book a session"
        title="Reserve the studio for your production."
        description={`Schedule gaffer services, lighting design, or on-set support with ${company.name}. Based in ${company.location}.`}
      >
        <PrimaryButton href={company.social.instagram} external>
          Confirm on Instagram
        </PrimaryButton>
        <SecondaryButton href="/contact">General contact</SecondaryButton>
      </PageHero>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Studio booking"
            title="What to include"
            description="Share your shoot dates, location, crew size, and lighting needs so we can prepare the right gaffer unit and equipment."
          />
          <div className="rounded-2xl border border-border bg-surface p-6">
            <ul className="space-y-3 text-sm leading-relaxed text-muted">
              <li>Production type — film, commercial, music video, etc.</li>
              <li>Preferred shoot dates or window</li>
              <li>Location (studio, outdoor, or set address)</li>
              <li>Lighting or gaffer requirements</li>
            </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-border bg-surface p-8"
          noValidate
        >
          <h2 className="font-display text-3xl text-foreground">Session request</h2>
          <p className="mt-2 text-sm text-muted">
            Submit your booking details. We&apos;ll follow up to confirm availability.
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
              <label htmlFor="service" className="text-sm font-medium text-foreground">
                Service
              </label>
              <select
                id="service"
                value={form.service}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, service: event.target.value }))
                }
                className={cn(
                  "mt-1.5 w-full rounded-xl border bg-surface-elevated px-4 py-3 text-sm text-foreground outline-none transition",
                  errors.service
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-border focus:border-accent",
                )}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.slug} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
              {errors.service ? (
                <p className="mt-1 text-xs text-red-500">{errors.service}</p>
              ) : null}
            </div>
            <Field
              label="Preferred dates or timeline"
              id="timeline"
              value={form.timeline}
              error={errors.timeline}
              onChange={(value) => setForm((prev) => ({ ...prev, timeline: value }))}
            />
            <div>
              <label htmlFor="details" className="text-sm font-medium text-foreground">
                Session details
              </label>
              <textarea
                id="details"
                rows={5}
                value={form.details}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, details: event.target.value }))
                }
                className={cn(
                  "mt-1.5 w-full rounded-xl border bg-surface-elevated px-4 py-3 text-sm text-foreground outline-none transition",
                  errors.details
                    ? "border-red-500/60 focus:border-red-500"
                    : "border-border focus:border-accent",
                )}
              />
              {errors.details ? (
                <p className="mt-1 text-xs text-red-500">{errors.details}</p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110 sm:w-auto"
          >
            Request booking
          </button>
        </form>
      </section>
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
