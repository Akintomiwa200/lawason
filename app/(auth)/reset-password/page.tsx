import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { auth } from "@/lib/auth";
import { loginHref } from "@/lib/auth-redirect";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = {
  title: "Reset password",
};

async function isValidToken(token: string) {
  if (!isDatabaseConfigured() || !token) {
    return false;
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  return Boolean(record && !record.usedAt && record.expires > new Date());
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  if (session?.user) {
    redirect("/");
  }

  const token = params.token ?? "";
  const valid = await isValidToken(token);

  if (!valid) {
    return (
      <AuthCard
        eyebrow="GM Lawason"
        title="Reset link expired"
        description="This password reset link is invalid or has already been used. Request a new one to continue."
        footer={
          <p className="text-center text-sm text-muted">
            <Link
              href="/forgot-password"
              className="font-medium text-accent hover:underline"
            >
              Request a new link
            </Link>
          </p>
        }
      >
        <Link
          href={loginHref()}
          className="flex w-full items-center justify-center rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-elevated"
        >
          Back to sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="GM Lawason"
      title="Set a new password"
      description="Choose a strong password you haven't used before. You'll use it to sign in from now on."
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
