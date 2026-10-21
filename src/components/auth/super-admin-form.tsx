"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { FloatInput } from "@/components/auth/float-input";
import { PasswordField } from "@/components/auth/password-field";
import { safeReturnPath } from "@/lib/auth-redirect";

interface SuperAdminFormProps {
  returnPath?: string;
}

export function SuperAdminForm({ returnPath = "/admin" }: SuperAdminFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      const result = await signIn("super-admin", {
        username: String(formData.get("username") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirect: false,
        redirectTo: safeReturnPath(returnPath),
      });

      if (result?.error) {
        throw new Error("Invalid admin username or password");
      }

      toast.success("Signed in as super admin");
      router.push(safeReturnPath(returnPath));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 w-full text-center text-xs font-medium text-muted underline-offset-4 transition hover:text-accent hover:underline"
      >
        Super admin sign in
      </button>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-surface-elevated p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Super admin access</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-muted transition hover:text-foreground"
        >
          Cancel
        </button>
      </div>
      <p className="mt-1 text-xs text-muted">
        Restricted dashboard access. Enter your admin credentials.
      </p>

      <form action={handleSubmit} className="mt-4 space-y-4">
        <FloatInput
          id="super-admin-username"
          name="username"
          label="Username"
          autoComplete="username"
        />
        <PasswordField
          id="super-admin-password"
          name="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full cursor-pointer rounded-2xl border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Enter dashboard"}
        </button>
      </form>
    </div>
  );
}
