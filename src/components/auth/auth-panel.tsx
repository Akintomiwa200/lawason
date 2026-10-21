"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { FloatInput } from "@/components/auth/float-input";
import { PasswordField } from "@/components/auth/password-field";
import { loginHref, registerHref, safeReturnPath } from "@/lib/auth-redirect";

interface AuthPanelProps {
  mode: "login" | "register";
  googleEnabled: boolean;
  appleEnabled: boolean;
  googleConfigured?: boolean;
  appleConfigured?: boolean;
}

export function AuthPanel({
  mode,
  googleEnabled,
  appleEnabled,
  googleConfigured = false,
  appleConfigured = false,
}: AuthPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = safeReturnPath(searchParams.get("next"));
  const [pending, setPending] = useState<"credentials" | "google" | "apple" | null>(
    null,
  );
  const [password, setPassword] = useState("");

  async function handleCredentials(formData: FormData) {
    setPending("credentials");
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
        const payload = (await response.json()) as {
          error?: string;
          verificationUrl?: string;
        };
        if (!response.ok) {
          throw new Error(payload.error ?? "Could not create account");
        }
        if (payload.verificationUrl) {
          toast.message("Verify your email", {
            description: "Check your inbox to confirm your account.",
            action: {
              label: "Open link",
              onClick: () => window.open(payload.verificationUrl, "_blank"),
            },
          });
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

      toast.success(mode === "register" ? "Account created" : "Signed in");
      router.push(returnPath);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setPending(null);
    }
  }

  async function handleOauth(provider: "google" | "apple") {
    const configured = provider === "google" ? googleConfigured : appleConfigured;

    if (!configured) {
      toast.error(
        `${provider === "google" ? "Google" : "Apple"} sign-in is not configured yet`,
      );
      return;
    }

    setPending(provider);
    try {
      await signIn(provider, { redirectTo: returnPath });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
      setPending(null);
    }
  }

  const isRegister = mode === "register";
  const showDivider = googleEnabled || appleEnabled;

  return (
    <div className="w-full">
      <h1 className="mb-10 text-3xl font-bold text-foreground">
        {isRegister ? "Create an account" : "Sign in"}
      </h1>

      <form action={handleCredentials} className="space-y-6">
        {isRegister ? (
          <FloatInput id="name" name="name" label="Full name" autoComplete="name" />
        ) : null}

        <FloatInput
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          minLength={8}
          autoComplete={isRegister ? "new-password" : "current-password"}
          value={password}
          onChange={setPassword}
        />

        <div className="flex flex-wrap items-start gap-2">
          <label className="group flex cursor-pointer items-center text-muted has-[input:checked]:text-foreground">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="peer sr-only"
            />
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-surface group-has-[input:checked]:border-accent group-has-[input:checked]:bg-accent group-focus-within:ring-2 group-focus-within:ring-accent/30"
              aria-hidden="true"
            >
              <svg
                className="size-3 text-accent-foreground opacity-0 group-has-[input:checked]:opacity-100"
                viewBox="0 0 12 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 5l3 3 7-7" />
              </svg>
            </span>
            <span className="ml-3 text-sm">Remember me</span>
          </label>

          {!isRegister ? (
            <Link
              href="/forgot-password"
              className="ml-auto rounded text-sm font-medium text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Forgot password?
            </Link>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={pending !== null}
          className="w-full cursor-pointer rounded-2xl border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending === "credentials"
            ? "Please wait…"
            : isRegister
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      {showDivider ? (
        <div className="my-8 flex items-center gap-4">
          <hr className="w-full border-border" />
          <p className="text-center text-sm text-muted">or</p>
          <hr className="w-full border-border" />
        </div>
      ) : null}

      <div className="space-y-3">
        {googleEnabled ? (
          <button
            type="button"
            onClick={() => void handleOauth("google")}
            disabled={pending !== null}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon />
            {pending === "google"
              ? "Connecting…"
              : isRegister
                ? "Sign up with Google"
                : "Sign in with Google"}
          </button>
        ) : null}

        {appleEnabled ? (
          <button
            type="button"
            onClick={() => void handleOauth("apple")}
            disabled={pending !== null}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-foreground px-3.5 py-2 text-sm font-semibold text-background transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <AppleIcon />
            {pending === "apple"
              ? "Connecting…"
              : isRegister
                ? "Sign up with Apple"
                : "Sign in with Apple"}
          </button>
        ) : null}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link
              href={loginHref(returnPath)}
              className="ml-1 font-medium text-accent hover:underline"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account{" "}
            <Link
              href={registerHref(returnPath)}
              className="ml-1 font-medium text-accent hover:underline"
            >
              Register here
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-[18px]"
      viewBox="0 0 512 512"
      aria-hidden="true"
    >
      <path
        fill="#fbbd00"
        d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
      />
      <path
        fill="#0f9d58"
        d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
      />
      <path
        fill="#31aa52"
        d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
      />
      <path
        fill="#3c79e6"
        d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
      />
      <path
        fill="#cf2d48"
        d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
      />
      <path
        fill="#eb4132"
        d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-[18px]"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 12.536c-.024-2.405 1.964-3.56 2.053-3.616-1.118-1.635-2.86-1.859-3.478-1.884-1.48-.15-2.888.87-3.639.87-.75 0-1.91-.848-3.14-.825-1.616.024-3.106.94-3.936 2.386-1.68 2.91-.428 7.217 1.206 9.58.799 1.157 1.75 2.455 2.997 2.408 1.203-.048 1.657-.778 3.11-.778 1.454 0 1.86.778 3.13.754 1.293-.024 2.11-1.178 2.9-2.34.914-1.343 1.29-2.642 1.31-2.71-.028-.013-2.512-.963-2.537-3.822zM14.66 5.5c.66-.8 1.106-1.914 1.985-1.914.09.9-.263 1.914-.857 2.714-.593.79-1.55 1.478-2.472 1.384-.107-.878.34-1.9.944-2.5h.4z" />
    </svg>
  );
}
