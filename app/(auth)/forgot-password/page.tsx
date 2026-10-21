import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { auth } from "@/lib/auth";
import { loginHref } from "@/lib/auth-redirect";

export const metadata = {
  title: "Forgot password",
};

export default async function ForgotPasswordPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <AuthCard
      eyebrow="GM Lawason"
      title="Forgot your password?"
      description="Enter the email linked to your account and we'll send you a secure link to reset it."
      footer={
        <p className="text-center text-sm text-muted">
          Remembered it?{" "}
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
