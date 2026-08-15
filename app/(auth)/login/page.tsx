import { redirect } from "next/navigation";

import { AuthPanel } from "@/components/auth/auth-panel";
import { auth } from "@/lib/auth";
import { safeReturnPath } from "@/lib/auth-redirect";
import { isAppleAuthConfigured, isGoogleAuthConfigured } from "@/lib/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const returnPath = safeReturnPath(params.next);

  if (session?.user) {
    redirect(returnPath === "/" && session.user.role === "ADMIN" ? "/admin" : returnPath);
  }

  return (
    <div className="flex min-h-screen items-center bg-background px-6 py-16">
      <AuthPanel
        mode="login"
        googleEnabled={isGoogleAuthConfigured()}
        appleEnabled={isAppleAuthConfigured()}
      />
    </div>
  );
}
