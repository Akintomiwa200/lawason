"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { registerForEvent, submitPaymentReference } from "@/actions/events";
import { EventCalendarActions } from "@/components/events/event-calendar-actions";
import { loginHref } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";
import {
  formatEventPrice,
  type EnrollmentDetails,
  type EventCardPayload,
} from "@/types/events";

const fieldClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";

interface FormState {
  name: string;
  email: string;
  phone: string;
  notes: string;
  city: string;
  dateOfBirth: string;
  gender: string;
  emergencyName: string;
  emergencyPhone: string;
  experienceLevel: string;
  roleInterest: string;
  portfolioUrl: string;
  heardFrom: string;
  guardianName: string;
  guardianPhone: string;
  reference: string;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function EventRegisterForm({
  event,
  signedIn,
  defaultName,
  defaultEmail,
  onRegistered,
}: {
  event: EventCardPayload;
  signedIn: boolean;
  defaultName?: string;
  defaultEmail?: string;
  onRegistered?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(event.registered);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [pending, setPending] = useState(false);
  const [values, setValues] = useState<FormState>({
    name: defaultName ?? "",
    email: defaultEmail ?? "",
    phone: "",
    notes: "",
    city: "",
    dateOfBirth: "",
    gender: "",
    emergencyName: "",
    emergencyPhone: "",
    experienceLevel: "",
    roleInterest: "",
    portfolioUrl: "",
    heardFrom: "",
    guardianName: "",
    guardianPhone: "",
    reference: "",
  });

  const steps = useMemo(() => {
    const list = [
      { id: "personal", label: "Your details" },
      { id: "programme", label: "Programme" },
    ];
    if (event.collectEmergency || event.collectGuardian) {
      list.push({ id: "contacts", label: "Contacts" });
    }
    list.push({ id: "review", label: event.requiresPayment ? "Review & pay" : "Review" });
    return list;
  }, [event.collectEmergency, event.collectGuardian, event.requiresPayment]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function details(): EnrollmentDetails {
    return {
      city: values.city || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      gender: values.gender || undefined,
      emergencyName: values.emergencyName || undefined,
      emergencyPhone: values.emergencyPhone || undefined,
      experienceLevel: values.experienceLevel || undefined,
      roleInterest: values.roleInterest || undefined,
      portfolioUrl: values.portfolioUrl || undefined,
      heardFrom: values.heardFrom || undefined,
      guardianName: values.guardianName || undefined,
      guardianPhone: values.guardianPhone || undefined,
    };
  }

  function validateStep(index: number) {
    const id = steps[index]?.id;
    if (id === "personal") {
      if (values.name.trim().length < 2) {
        return "Enter your full name.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        return "Enter a valid email.";
      }
      if (event.collectPhone && values.phone.trim().length < 7) {
        return "Enter a phone number the studio can reach.";
      }
      if (event.collectCity && values.city.trim().length < 2) {
        return "Enter your city.";
      }
    }
    if (id === "programme" && event.collectExperience && !values.experienceLevel) {
      return "Select your experience level.";
    }
    if (id === "contacts") {
      if (event.collectEmergency && (values.emergencyName.trim().length < 2 || values.emergencyPhone.trim().length < 7)) {
        return "Enter an emergency contact name and phone.";
      }
      if (event.collectGuardian && (values.guardianName.trim().length < 2 || values.guardianPhone.trim().length < 7)) {
        return "Enter a parent or guardian name and phone.";
      }
    }
    return null;
  }

  function goNext() {
    const error = validateStep(step);
    if (error) {
      toast.error(error);
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function handleSubmit() {
    const error = validateStep(step);
    if (error) {
      toast.error(error);
      return;
    }

    setPending(true);
    try {
      if (!event.id.startsWith("sample-")) {
        await registerForEvent({
          eventSlug: event.slug,
          name: values.name,
          email: values.email,
          phone: values.phone,
          notes: values.notes,
          details: details(),
        });
      }
      setSubmitted(true);
      setNeedsPayment(event.requiresPayment);
      onRegistered?.();
      toast.success(
        event.requiresPayment ? "Enrollment saved. Complete payment below." : "You're registered",
      );
      if (event.paymentMethod === "PAYSTACK" && !event.id.startsWith("sample-")) {
        await startPaystack();
      }
    } catch (submitError) {
      toast.error(submitError instanceof Error ? submitError.message : "Registration failed");
    } finally {
      setPending(false);
    }
  }

  async function startPaystack() {
    const response = await fetch("/api/payments/paystack/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventSlug: event.slug, email: values.email }),
    });
    const payload = (await response.json()) as { url?: string; error?: string; alreadyPaid?: boolean };
    if (payload.url) {
      window.location.href = payload.url;
      return;
    }
    if (payload.alreadyPaid) {
      window.location.href = `/events/${event.slug}/live?paid=1`;
      return;
    }
    toast.error(payload.error ?? "Could not start Paystack");
  }

  async function handlePayment() {
    if (values.reference.trim().length < 3) {
      toast.error("Enter the payment reference from your transfer or receipt.");
      return;
    }
    setPending(true);
    try {
      if (!event.id.startsWith("sample-")) {
        await submitPaymentReference(event.slug, values.reference);
      }
      toast.success("Payment reference submitted. Admin will confirm.");
      setNeedsPayment(false);
    } catch (paymentError) {
      toast.error(paymentError instanceof Error ? paymentError.message : "Could not save payment reference");
    } finally {
      setPending(false);
    }
  }

  if (event.requireLogin && !signedIn) {
    return (
      <div className="rounded-[1.6rem] border border-border bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Enrollment</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Sign in to enroll</h2>
        <p className="mt-2 text-sm text-muted">
          This programme requires an account before the studio can take your details.
        </p>
        <Link
          href={loginHref(`/events/${event.slug}`)}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (submitted && needsPayment) {
    return (
      <div className="space-y-5 rounded-[1.6rem] border border-border bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Payment</p>
        <h2 className="font-display text-2xl font-semibold">Pay {formatEventPrice(event)}</h2>
        {event.paymentMethod === "PAYSTACK" ? (
          <>
            <p className="text-sm text-muted">
              Card, bank transfer, or USSD through Paystack. The room and calendar unlock when payment confirms.
            </p>
            <button
              type="button"
              disabled={pending}
              onClick={() => void startPaystack()}
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow hover:brightness-110"
            >
              {pending ? "Opening Paystack…" : "Pay with Paystack"}
            </button>
          </>
        ) : null}
        {event.paymentInstructions ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
            {event.paymentInstructions}
          </p>
        ) : event.paymentMethod !== "PAYSTACK" ? (
          <p className="text-sm text-muted">The studio will share payment details after review.</p>
        ) : null}
        {event.paymentLink ? (
          <a
            href={event.paymentLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent"
          >
            Open payment link
          </a>
        ) : null}
        {event.paymentMethod !== "PAYSTACK" ? (
          <>
            <Field label="Payment reference" hint="Bank narration, transfer ID, or receipt.">
              <input
                value={values.reference}
                onChange={(change) => update("reference", change.target.value)}
                className={fieldClass}
                placeholder="e.g. TRF-20481"
              />
            </Field>
            <button
              type="button"
              disabled={pending}
              onClick={() => void handlePayment()}
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow hover:brightness-110"
            >
              {pending ? "Saving…" : "I've paid"}
            </button>
          </>
        ) : null}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-[1.6rem] border border-accent/30 bg-accent/10 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Received</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">You are on the list</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          {event.confirmationMessage ||
            "Registration received. The studio will follow up with call time and what to bring."}
        </p>
        <div className="mt-5 space-y-3">
          <EventCalendarActions event={event} />
          {event.format !== "IN_PERSON" ? (
            <Link
              href={`/events/${event.slug}/live`}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Open live room
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  const current = steps[step];

  return (
    <div className="rounded-[1.6rem] border border-border bg-surface p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Enrollment</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">Register for {event.title}</h2>
      <p className="mt-2 text-sm text-muted">
        Step {step + 1} of {steps.length} · {current.label}
      </p>

      <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              "rounded-full px-3 py-1.5 text-center text-[11px] font-medium",
              index === step
                ? "bg-accent text-accent-foreground"
                : index < step
                  ? "bg-accent/15 text-accent"
                  : "bg-surface-elevated text-muted",
            )}
          >
            {item.label}
          </li>
        ))}
      </ol>

      <div className="mt-6 space-y-4">
        {current.id === "personal" ? (
          <>
            <Field label="Full name">
              <input
                value={values.name}
                onChange={(change) => update("name", change.target.value)}
                className={fieldClass}
                autoComplete="name"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={values.email}
                onChange={(change) => update("email", change.target.value)}
                className={fieldClass}
                autoComplete="email"
              />
            </Field>
            {event.collectPhone ? (
              <Field label="Phone" hint="WhatsApp number is fine.">
                <input
                  value={values.phone}
                  onChange={(change) => update("phone", change.target.value)}
                  className={fieldClass}
                  autoComplete="tel"
                />
              </Field>
            ) : null}
            {event.collectCity ? (
              <Field label="City">
                <input
                  value={values.city}
                  onChange={(change) => update("city", change.target.value)}
                  className={fieldClass}
                  placeholder="Ikorodu, Lagos"
                />
              </Field>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date of birth">
                <input
                  type="date"
                  value={values.dateOfBirth}
                  onChange={(change) => update("dateOfBirth", change.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Gender">
                <select
                  value={values.gender}
                  onChange={(change) => update("gender", change.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="unspecified">Prefer not to say</option>
                </select>
              </Field>
            </div>
          </>
        ) : null}

        {current.id === "programme" ? (
          <>
            {event.collectExperience ? (
              <>
                <Field label="Experience on set">
                  <select
                    value={values.experienceLevel}
                    onChange={(change) => update("experienceLevel", change.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Select</option>
                    <option value="first-time">First time on a set</option>
                    <option value="some-days">A few set days</option>
                    <option value="working-crew">Working crew</option>
                    <option value="department-head">Department head</option>
                  </select>
                </Field>
                <Field label="Department you want">
                  <select
                    value={values.roleInterest}
                    onChange={(change) => update("roleInterest", change.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Select</option>
                    <option value="camera">Camera</option>
                    <option value="lighting">Lighting / gaffer</option>
                    <option value="grip">Grip</option>
                    <option value="directing">Directing</option>
                    <option value="sound">Sound</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </>
            ) : null}
            {event.collectPortfolio ? (
              <Field label="Reel or portfolio link" hint="Instagram, Drive, or Vimeo is fine.">
                <input
                  value={values.portfolioUrl}
                  onChange={(change) => update("portfolioUrl", change.target.value)}
                  className={fieldClass}
                  placeholder="https://"
                />
              </Field>
            ) : null}
            <Field label="How did you hear about this?">
              <select
                value={values.heardFrom}
                onChange={(change) => update("heardFrom", change.target.value)}
                className={fieldClass}
              >
                <option value="">Select</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="friend">Friend or crew</option>
                <option value="website">This website</option>
                <option value="other">Other</option>
              </select>
            </Field>
            {event.collectNotes ? (
              <Field label="Anything the studio should know?">
                <textarea
                  rows={5}
                  value={values.notes}
                  onChange={(change) => update("notes", change.target.value)}
                  className={fieldClass}
                  placeholder="Diet, access needs, kit you can bring, or questions."
                />
              </Field>
            ) : null}
          </>
        ) : null}

        {current.id === "contacts" ? (
          <>
            {event.collectEmergency ? (
              <>
                <Field label="Emergency contact name">
                  <input
                    value={values.emergencyName}
                    onChange={(change) => update("emergencyName", change.target.value)}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Emergency contact phone">
                  <input
                    value={values.emergencyPhone}
                    onChange={(change) => update("emergencyPhone", change.target.value)}
                    className={fieldClass}
                  />
                </Field>
              </>
            ) : null}
            {event.collectGuardian ? (
              <>
                <Field label="Parent or guardian name">
                  <input
                    value={values.guardianName}
                    onChange={(change) => update("guardianName", change.target.value)}
                    className={fieldClass}
                  />
                </Field>
                <Field label="Parent or guardian phone">
                  <input
                    value={values.guardianPhone}
                    onChange={(change) => update("guardianPhone", change.target.value)}
                    className={fieldClass}
                  />
                </Field>
              </>
            ) : null}
          </>
        ) : null}

        {current.id === "review" ? (
          <div className="space-y-3 rounded-2xl bg-surface-elevated p-4 text-sm">
            <p><span className="text-muted">Name</span> · {values.name}</p>
            <p><span className="text-muted">Email</span> · {values.email}</p>
            {values.phone ? <p><span className="text-muted">Phone</span> · {values.phone}</p> : null}
            {values.city ? <p><span className="text-muted">City</span> · {values.city}</p> : null}
            {values.experienceLevel ? (
              <p><span className="text-muted">Experience</span> · {values.experienceLevel}</p>
            ) : null}
            {values.roleInterest ? <p><span className="text-muted">Department</span> · {values.roleInterest}</p> : null}
            <p><span className="text-muted">Fee</span> · {formatEventPrice(event)}</p>
            {event.requiresPayment ? (
              <p className="text-muted">
                After you submit, you will get the studio payment step.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current - 1)}
            className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold hover:border-accent"
          >
            Back
          </button>
        ) : null}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow hover:brightness-110"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => void handleSubmit()}
            className="flex-1 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow hover:brightness-110"
          >
            {pending ? "Submitting…" : event.requiresPayment ? "Submit and pay" : "Submit registration"}
          </button>
        )}
      </div>
    </div>
  );
}
