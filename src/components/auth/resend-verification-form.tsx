"use client";

import { useState } from "react";
import { toast } from "sonner";

import { authFloatingLabelClass, authFieldClass } from "@/components/auth/float-input";

interface ResendVerificationFormProps {
  defaultEmail?: string;
}

export function ResendVerificationForm({ defaultEmail = "" }: ResendVerificationFormProps) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      const response = await fetch("/api/auth/verify-email/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(formData.get("email") ?? "") }),
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Something went wrong");
      }

      setSent(true);
      if (payload.url) {
        setDevLink(payload.url);
      }
      toast.success("Verification email sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface-elevated p-5 text-sm text-muted">
          If that email is registered and not yet verified, a fresh verification
          link is on its way. It expires in 24 hours.
        </div>
        {devLink ? (
          <div className="rounded-2xl border border-dashed border-accent/50 bg-accent/5 p-4 text-xs text-muted">
            <p className="font-semibold text-accent">Development mode</p>
            <p className="mt-1">No email provider is configured. Use this link:</p>
            <a
              href={devLink}
              className="mt-2 block break-all font-medium text-accent hover:underline"
            >
              {devLink}
            </a>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          placeholder=" "
          autoComplete="email"
          defaultValue={defaultEmail}
          required
          className={authFieldClass}
        />
        <label htmlFor="email" className={authFloatingLabelClass}>
          Email
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer rounded-2xl border border-accent bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Resend verification email"}
      </button>
    </form>
  );
}
