"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import Link from "next/link";

import { ProfileEditor } from "@/components/events/profile-editor";
import { loginHref } from "@/lib/auth-redirect";
import type { ProfilePayload } from "@/types/events";

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-400">Add a few tags in edit profile.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function SocialIcon({ href, label, children }: { href?: string | null; label: string; children: React.ReactNode }) {
  if (!href) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-300">
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-[#2563eb] hover:text-white"
    >
      {children}
    </a>
  );
}

export function ProfileSidebar({
  profile,
  onSave,
}: {
  profile: ProfilePayload | null;
  onSave: (profile: ProfilePayload) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (!profile) {
    return (
      <aside className="rounded-[1.6rem] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
        <p className="font-display text-xl font-semibold text-neutral-900">Your studio profile</p>
        <p className="mt-2 text-sm text-neutral-500">
          Sign in to save programmes, register for camp, and keep your filmmaking profile here.
        </p>
        <Link
          href={loginHref("/events")}
          className="mt-5 inline-flex rounded-full bg-[#16a34a] px-4 py-2 text-sm font-semibold text-white"
        >
          Sign in
        </Link>
      </aside>
    );
  }

  return (
    <aside className="rounded-[1.6rem] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-center text-center">
          {profile.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.image}
              alt={profile.name ?? "Profile"}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-200 text-xl font-semibold text-neutral-600">
              {(profile.name ?? "U").slice(0, 1)}
            </div>
          )}
          <h2 className="mt-3 font-display text-xl font-semibold text-neutral-900">
            {profile.name || "Studio member"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">{profile.location || "Add your city"}</p>
          <div className="mt-3 flex items-center gap-2">
            <SocialIcon href={profile.facebook} label="Facebook">f</SocialIcon>
            <SocialIcon href={profile.twitter} label="X">x</SocialIcon>
            <SocialIcon href={profile.linkedin} label="LinkedIn">in</SocialIcon>
            <SocialIcon href={profile.instagram} label="Instagram">ig</SocialIcon>
          </div>
        </div>
        <button
          type="button"
          aria-label="Edit profile"
          onClick={() => setEditing(true)}
          className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <section className="mt-8">
        <h3 className="text-sm font-semibold text-neutral-900">Education Details</h3>
        <div className="mt-3 space-y-3">
          {profile.education.length === 0 ? (
            <p className="text-sm text-neutral-400">Add school and programme details.</p>
          ) : (
            profile.education.map((item) => (
              <div key={`${item.school}-${item.degree}`}>
                <p className="text-sm font-medium text-neutral-800">{item.school}</p>
                <p className="text-xs text-neutral-500">{item.degree}</p>
                {item.dates ? <p className="text-xs text-neutral-400">{item.dates}</p> : null}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-neutral-900">Job History</h3>
        <div className="mt-3 space-y-3">
          {profile.jobs.length === 0 ? (
            <p className="text-sm text-neutral-400">Add on-set roles and productions.</p>
          ) : (
            profile.jobs.map((item) => (
              <div key={`${item.title}-${item.company}`}>
                <p className="text-sm font-medium text-neutral-800">{item.title}</p>
                <p className="text-xs text-neutral-500">{item.company}</p>
                {item.dates ? <p className="text-xs text-neutral-400">{item.dates}</p> : null}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-neutral-900">Skills</h3>
        <div className="mt-3">
          <TagList items={profile.skills} />
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-neutral-900">Interest</h3>
        <div className="mt-3">
          <TagList items={profile.interestTags} />
        </div>
      </section>

      {editing ? (
        <ProfileEditor
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={(next) => {
            onSave(next);
            setEditing(false);
          }}
        />
      ) : null}
    </aside>
  );
}
