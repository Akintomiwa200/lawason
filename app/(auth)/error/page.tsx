import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { loginHref } from "@/lib/auth-redirect";

export const metadata = {
  title: "Authentication error",
};

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "That sign-in link is no longer valid.",
  OAuthSignin: "Could not start the sign-in flow. Please try again.",
  OAuthCallback: "Could not complete sign-in with the provider.",
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Use your original method to continue.",
  CredentialsSignin: "Invalid email or password.",
  SessionRequired: "Please sign in to continue.",
  Default: "Unable to sign in. Please try again.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const code = params.error ?? "Default";
  const message = errorMessages[code] ?? errorMessages.Default;

  return (
    <AuthCard
      eyebrow="GM Lawason"
      title="Sign-in problem"
      description="Something interrupted your sign-in. Here's what happened."
      footer={
        <p className="text-center text-sm text-muted">
          Need a hand?{" "}
          <Link href="/contact" className="font-medium text-accent hover:underline">
            Contact the studio
          </Link>
        </p>
      }
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-elevated p-5 text-sm text-muted">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-medium text-foreground">{message}</p>
            <p className="mt-1 text-xs">Error code: {code}</p>
          </div>
        </div>

        <Link
          href={loginHref()}
          className="flex w-full items-center justify-center rounded-2xl border border-accent bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
        >
          Try signing in again
        </Link>
      </div>
    </AuthCard>
  );
}
