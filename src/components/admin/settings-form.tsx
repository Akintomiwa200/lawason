"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { saveSettings } from "@/actions/settings";
import { cn } from "@/lib/utils";

export interface SettingField {
  key: string;
  label: string;
  description?: string;
  type?: "text" | "textarea" | "url";
  placeholder?: string;
}

interface SettingsFormProps {
  fields: SettingField[];
  values: Record<string, string>;
}

const fieldClass =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";

export function SettingsForm({ fields, values }: SettingsFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of fields) {
      initial[field.key] = values[field.key] ?? "";
    }
    return initial;
  });

  function handleSubmit(formData: FormData) {
    const entries = fields.map((field) => ({
      key: field.key,
      value: String(formData.get(field.key) ?? ""),
    }));

    startTransition(async () => {
      try {
        await saveSettings(entries);
        toast.success("Settings saved");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not save settings");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.key}
            className={cn(
              "block space-y-2 text-sm",
              field.type === "textarea" && "sm:col-span-2",
            )}
          >
            <span className="font-medium text-foreground">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                name={field.key}
                rows={4}
                value={draft[field.key] ?? ""}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
                placeholder={field.placeholder}
                className={cn(fieldClass, "resize-y")}
              />
            ) : (
              <input
                name={field.key}
                type={field.type === "url" ? "url" : "text"}
                value={draft[field.key] ?? ""}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
                placeholder={field.placeholder}
                className={fieldClass}
              />
            )}
            {field.description ? (
              <span className="block text-xs text-muted">{field.description}</span>
            ) : null}
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
