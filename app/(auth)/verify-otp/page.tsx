import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { OtpForm } from "@/components/auth/otp-form";
import { auth } from "@/lib/auth";
import { loginHref } from "@/lib/auth-redirect";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = {
  title: "Verify code",
};

async function isValidTicket(token: string) {
  if (!isDatabaseConfigured() || !token) {
    return false;
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  return Boolean(record && !record.usedAt && record.expires > new Date());
}

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; email?: string; dev?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  if (session?.user) {
    redirect("/");
  }

  const token = params.t ?? "";
  const email = params.email ?? "";
  const devCode = params.dev;
  const valid = await isValidTicket(token);

  if (!valid) {
    return (
      <AuthCard
        eyebrow="GM Lawason"
        title="Request a new code"
        description="Your verification session expired. Enter your email to get a fresh 6-digit code."
        footer={
          <p className="text-center text-sm text-muted">
            <Link href={loginHref()} className="font-medium text-accent hover:underline">
              Back to sign in
            </Link>
          </p>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="GM Lawason"
      title="Enter verification code"
      description="We emailed you a 6-digit code. It expires in 15 minutes."
      footer={
        <p className="text-center text-sm text-muted">
          Didn&apos;t get it?{" "}
          <Link
            href="/forgot-password"
            className="font-medium text-accent hover:underline"
          >
            Resend code
          </Link>
        </p>
      }
    >
      <div className="space-y-6">
        {devCode ? (
          <div className="rounded-2xl border border-dashed border-accent/50 bg-accent/5 p-4 text-sm text-muted">
            <p className="font-semibold text-accent">Development mode</p>
            <p className="mt-1">
              No email provider is configured. Your code is{" "}
              <span className="font-mono font-semibold tracking-[0.3em] text-foreground">
                {devCode}
              </span>
            </p>
          </div>
        ) : null}

        <OtpForm token={token} email={email} />
      </div>
    </AuthCard>
  );
}
