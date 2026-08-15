"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { loginHref, registerHref, safeReturnPath } from "@/lib/auth-redirect";

const fieldClass =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";

interface AuthPanelProps {
  mode: "login" | "register";
  googleEnabled: boolean;
  appleEnabled: boolean;
}

export function AuthPanel({ mode, googleEnabled, appleEnabled }: AuthPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = safeReturnPath(searchParams.get("next"));
  const [pending, setPending] = useState(false);

  async function handleCredentials(formData: FormData) {
    setPending(true);
    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
          }),
        });
        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Could not create account");
        }
      }

      const result = await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirect: false,
        redirectTo: returnPath,
      });

      if (result?.error) {
        throw new Error("Invalid email or password");
      }

      router.push(returnPath);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-[2rem] border border-border bg-surface p-8 shadow-[0_16px_48px_rgba(0,0,0,0.06)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          GM Lawason
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          {mode === "login" ? "Sign in" : "Create an account"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Use email, Google, or Apple to access registrations and studio content.
        </p>
      </div>

      <div className="space-y-3">
        {googleEnabled ? (
          <button
            type="button"
            onClick={() => void signIn("google", { redirectTo: returnPath })}
            className="flex w-full items-center justify-center rounded-full border border-border px-4 py-3 text-sm font-semibold hover:border-accent hover:text-accent"
          >
            Continue with Google
          </button>
        ) : null}
        {appleEnabled ? (
          <button
            type="button"
            onClick={() => void signIn("apple", { redirectTo: returnPath })}
            className="flex w-full items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90"
          >
            Continue with Apple
          </button>
        ) : null}
      </div>

      <div className="relative text-center text-xs uppercase tracking-[0.2em] text-muted">
        <span className="bg-surface px-3">or email</span>
        <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
      </div>

      <form action={handleCredentials} className="space-y-3">
        {mode === "register" ? (
          <input name="name" placeholder="Full name" className={fieldClass} required />
        ) : null}
        <input name="email" type="email" placeholder="Email" className={fieldClass} required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          minLength={8}
          className={fieldClass}
          required
        />
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow hover:brightness-110",
          )}
        >
          {pending
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href={registerHref(returnPath)} className="font-medium text-accent">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href={loginHref(returnPath)} className="font-medium text-accent">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
