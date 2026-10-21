import { MailCheck, MailWarning } from "lucide-react";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import { consumeEmailVerificationToken } from "@/lib/auth-tokens";
import { loginHref } from "@/lib/auth-redirect";

export const metadata = {
  title: "Verify email",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";
  const email = params.email ?? "";

  const verifiedUser = token ? await consumeEmailVerificationToken(token) : null;

  if (verifiedUser) {
    return (
      <AuthCard
        eyebrow="GM Lawason"
        title="Email verified"
        description="Your email address is confirmed. You're all set to access your account."
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-elevated p-5 text-sm text-muted">
            <MailCheck className="size-5 shrink-0 text-accent" aria-hidden="true" />
            <span>{verifiedUser.email} has been verified successfully.</span>
          </div>
          <Link
            href={loginHref()}
            className="flex w-full items-center justify-center rounded-2xl border border-accent bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
          >
            Continue to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (token) {
    return (
      <AuthCard
        eyebrow="GM Lawason"
        title="Link expired"
        description="This verification link is invalid or has already been used. Request a fresh one below."
      >
        <ResendVerificationForm defaultEmail={email} />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="GM Lawason"
      title="Verify your email"
      description="Enter your email and we'll send you a link to confirm your address."
      footer={
        <p className="text-center text-sm text-muted">
          Already verified?{" "}
          <Link href={loginHref()} className="font-medium text-accent hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-elevated p-5 text-sm text-muted">
          <MailWarning className="size-5 shrink-0 text-accent" aria-hidden="true" />
          <span>We&apos;ll email you a secure link that stays valid for 24 hours.</span>
        </div>
        <ResendVerificationForm defaultEmail={email} />
      </div>
    </AuthCard>
  );
}
