import { AdminShell } from "@/components/admin/admin-shell";
import { Panel } from "@/components/admin/ui";
import {
  SettingsForm,
  type SettingField,
} from "@/components/admin/settings-form";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const fields: SettingField[] = [
  {
    key: "site.tagline",
    label: "Tagline",
    placeholder: "Filmmaking · Cinematography · Special Effect Lighting",
    description: "Short line shown under the site name.",
  },
  {
    key: "site.email",
    label: "Contact email",
    placeholder: "studio@gmlawason.com",
    description: "Public email address shown on the contact page.",
  },
  {
    key: "site.phone",
    label: "Contact phone",
    placeholder: "+234 …",
  },
  {
    key: "site.address",
    label: "Studio address",
    placeholder: "Ikorodu, Lagos State, Nigeria",
  },
  {
    key: "site.announcement",
    label: "Announcement banner",
    type: "textarea",
    placeholder: "Upcoming workshop this weekend…",
    description: "Optional banner shown across the site.",
  },
  {
    key: "social.instagram",
    label: "Instagram URL",
    type: "url",
    placeholder: "https://instagram.com/…",
  },
  {
    key: "social.linkedin",
    label: "LinkedIn URL",
    type: "url",
    placeholder: "https://linkedin.com/…",
  },
  {
    key: "social.youtube",
    label: "YouTube URL",
    type: "url",
    placeholder: "https://youtube.com/@…",
  },
];

export default async function AdminSettingsPage() {
  const stored = await prisma.siteSetting.findMany();
  const values: Record<string, string> = {};
  for (const setting of stored) {
    values[setting.key] = setting.value;
  }

  const knownKeys = new Set(fields.map((field) => field.key));
  const extras = stored.filter((setting) => !knownKeys.has(setting.key));

  return (
    <AdminShell
      title="Settings"
      description="Site-wide content and contact details."
    >
      <Panel>
        <SettingsForm fields={fields} values={values} />
      </Panel>

      {extras.length > 0 ? (
        <Panel
          title="Other stored values"
          description="Keys created elsewhere (e.g. YouTube sync)."
        >
          <ul className="divide-y divide-border">
            {extras.map((setting) => (
              <li key={setting.key} className="py-3">
                <p className="font-code text-xs text-muted">{setting.key}</p>
                <p className="mt-1 break-all text-sm text-foreground">
                  {setting.value}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </AdminShell>
  );
}
