"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface OtpFormProps {
  token: string;
  email: string;
}

const OTP_LENGTH = 6;

export function OtpForm({ token, email }: OtpFormProps) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [pending, setPending] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  function setDigit(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      setDigits((current) => current.map((d, i) => (i === index ? "" : d)));
      return;
    }

    setDigits((current) => {
      const next = [...current];
      const chars = cleaned.split("");
      let cursor = index;

      for (const char of chars) {
        if (cursor >= OTP_LENGTH) {
          break;
        }
        next[cursor] = char;
        cursor += 1;
      }

      const focusIndex = Math.min(cursor, OTP_LENGTH - 1);
      requestAnimationFrame(() => inputs.current[focusIndex]?.focus());

      return next;
    });
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  async function handleComplete(code: string) {
    setPending(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code }),
      });

      const payload = (await response.json()) as {
        error?: string;
        ticket?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Invalid code");
      }

      toast.success("Code verified");
      router.push(
        `/reset-password?ticket=${encodeURIComponent(payload.ticket ?? token)}`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid code");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = digits.join("");

    if (code.length !== OTP_LENGTH) {
      toast.error("Enter the full 6-digit code");
      return;
    }

    void handleComplete(code);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputs.current[index] = element;
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={OTP_LENGTH}
            value={digit}
            onChange={(event) => setDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={(event) => event.target.select()}
            aria-label={`Digit ${index + 1}`}
            className="h-14 w-11 rounded-2xl border border-border bg-surface text-center text-xl font-semibold text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 sm:h-16 sm:w-13"
          />
        ))}
      </div>

      <p className="text-center text-sm text-muted">
        Enter the code we sent to <span className="text-foreground">{email}</span>
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer rounded-2xl border border-accent bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Verifying…" : "Verify code"}
      </button>
    </form>
  );
}
