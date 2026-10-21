import { redirect } from "next/navigation";

import { AuthPanel } from "@/components/auth/auth-panel";
import { auth } from "@/lib/auth";
import { safeReturnPath } from "@/lib/auth-redirect";
import {
  isAppleAuthConfigured,
  isGoogleAuthConfigured,
} from "@/lib/env";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  const returnPath = safeReturnPath(params.next);

  if (session?.user) {
    redirect(returnPath);
  }

  return (
    <main className="flex flex-col items-center justify-center px-4 py-4 md:px-8 lg:min-h-screen">
      <div className="grid max-w-lg items-center gap-12 lg:max-w-6xl lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold leading-tight text-foreground lg:text-5xl">
            Start Your Success Story Today
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Create your account in seconds and unlock exclusive access to
            registrations, studio content, and everything GM Lawason has to offer.
          </p>
        </div>

        <div className="w-full max-w-md lg:ml-auto">
          <AuthPanel
            mode="register"
            googleEnabled
            appleEnabled
            googleConfigured={isGoogleAuthConfigured()}
            appleConfigured={isAppleAuthConfigured()}
          />
        </div>
      </div>
    </main>
  );
}
