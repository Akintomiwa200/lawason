"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "@/components/auth/eye-icons";
import { authFloatingLabelClass, authFieldClass } from "@/components/auth/float-input";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  autoComplete?: string;
  minLength?: number;
  value: string;
  onChange: (value: string) => void;
}

export function PasswordField({
  id,
  name,
  label,
  autoComplete,
  minLength,
  value,
  onChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder=" "
        autoComplete={autoComplete}
        minLength={minLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className={cn(authFieldClass, "pr-11")}
      />
      <label htmlFor={id} className={authFloatingLabelClass}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}
