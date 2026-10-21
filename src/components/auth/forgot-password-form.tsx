"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { authFloatingLabelClass, authFieldClass } from "@/components/auth/float-input";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      const email = String(formData.get("email") ?? "");
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as {
        error?: string;
        token?: string;
        devCode?: string;
        emailDelivery?: boolean;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Something went wrong");
      }

      toast.success("We sent a 6-digit code to your email");

      const params = new URLSearchParams({ email });
      if (payload.token) {
        params.set("t", payload.token);
      }
      if (payload.devCode) {
        params.set("dev", payload.devCode);
      }

      router.push(`/verify-otp?${params.toString()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setPending(false);
    }
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
        {pending ? "Sending code…" : "Send verification code"}
      </button>
    </form>
  );
}
