"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PasswordField } from "@/components/auth/password-field";
import { cn } from "@/lib/utils";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not reset password");
      }

      setDone(true);
      toast.success("Password updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reset password");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface-elevated p-5 text-sm text-muted">
          Your password has been updated. You can now sign in with your new password.
        </div>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full cursor-pointer rounded-2xl border border-accent bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          Go to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PasswordField
        id="password"
        name="password"
        label="New password"
        autoComplete="new-password"
        minLength={8}
        value={password}
        onChange={setPassword}
      />
      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        minLength={8}
        value={confirm}
        onChange={setConfirm}
      />

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "w-full cursor-pointer rounded-2xl border border-accent bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
