"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { EducationItem, JobItem, ProfilePayload } from "@/types/events";

const fieldClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-[#16a34a]";

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProfileEditor({
  profile,
  onClose,
  onSave,
}: {
  profile: ProfilePayload;
  onClose: () => void;
  onSave: (profile: ProfilePayload) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [education, setEducation] = useState<EducationItem[]>(
    profile.education.length ? profile.education : [{ school: "", degree: "", dates: "" }],
  );
  const [jobs, setJobs] = useState<JobItem[]>(
    profile.jobs.length ? profile.jobs : [{ title: "", company: "", dates: "" }],
  );

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          location: String(formData.get("location") ?? ""),
          facebook: String(formData.get("facebook") ?? ""),
          twitter: String(formData.get("twitter") ?? ""),
          linkedin: String(formData.get("linkedin") ?? ""),
          instagram: String(formData.get("instagram") ?? ""),
          education: education.filter((item) => item.school && item.degree),
          jobs: jobs.filter((item) => item.title && item.company),
          skills: splitTags(String(formData.get("skills") ?? "")),
          interestTags: splitTags(String(formData.get("interestTags") ?? "")),
        }),
      });
      const payload = (await response.json()) as { profile?: ProfilePayload; error?: string };
      if (!response.ok || !payload.profile) {
        throw new Error(payload.error ?? "Could not save profile");
      }
      toast.success("Profile updated");
      onSave(payload.profile);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <form
        action={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Edit profile</h2>
          <button type="button" onClick={onClose} className="text-sm text-neutral-500">
            Close
          </button>
        </div>
        <div className="space-y-3">
          <input name="name" defaultValue={profile.name ?? ""} placeholder="Name" className={fieldClass} />
          <input name="location" defaultValue={profile.location ?? ""} placeholder="City" className={fieldClass} />
          <input name="facebook" defaultValue={profile.facebook ?? ""} placeholder="Facebook URL" className={fieldClass} />
          <input name="twitter" defaultValue={profile.twitter ?? ""} placeholder="X URL" className={fieldClass} />
          <input name="linkedin" defaultValue={profile.linkedin ?? ""} placeholder="LinkedIn URL" className={fieldClass} />
          <input name="instagram" defaultValue={profile.instagram ?? ""} placeholder="Instagram URL" className={fieldClass} />
        </div>

        <p className="mt-5 text-sm font-semibold">Education</p>
        {education.map((item, index) => (
          <div key={`edu-${index}`} className="mt-2 grid gap-2">
            <input
              className={fieldClass}
              placeholder="School"
              value={item.school}
              onChange={(event) =>
                setEducation((current) =>
                  current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, school: event.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={fieldClass}
              placeholder="Programme"
              value={item.degree}
              onChange={(event) =>
                setEducation((current) =>
                  current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, degree: event.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={fieldClass}
              placeholder="2018 - 2022"
              value={item.dates ?? ""}
              onChange={(event) =>
                setEducation((current) =>
                  current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, dates: event.target.value } : row,
                  ),
                )
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="mt-2 text-xs font-semibold text-[#16a34a]"
          onClick={() => setEducation((current) => [...current, { school: "", degree: "", dates: "" }])}
        >
          Add education
        </button>

        <p className="mt-5 text-sm font-semibold">Job history</p>
        {jobs.map((item, index) => (
          <div key={`job-${index}`} className="mt-2 grid gap-2">
            <input
              className={fieldClass}
              placeholder="Role"
              value={item.title}
              onChange={(event) =>
                setJobs((current) =>
                  current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, title: event.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={fieldClass}
              placeholder="Production / company"
              value={item.company}
              onChange={(event) =>
                setJobs((current) =>
                  current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, company: event.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={fieldClass}
              placeholder="2022 - Present"
              value={item.dates ?? ""}
              onChange={(event) =>
                setJobs((current) =>
                  current.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, dates: event.target.value } : row,
                  ),
                )
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="mt-2 text-xs font-semibold text-[#16a34a]"
          onClick={() => setJobs((current) => [...current, { title: "", company: "", dates: "" }])}
        >
          Add role
        </button>

        <p className="mt-5 text-sm font-semibold">Skills</p>
        <input
          name="skills"
          defaultValue={profile.skills.join(", ")}
          placeholder="Lighting, Camera, Gaffer"
          className={`${fieldClass} mt-2`}
        />
        <p className="mt-5 text-sm font-semibold">Interests</p>
        <input
          name="interestTags"
          defaultValue={profile.interestTags.join(", ")}
          placeholder="Film, Lighting, Storytelling"
          className={`${fieldClass} mt-2`}
        />

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full rounded-full bg-[#16a34a] px-4 py-2.5 text-sm font-semibold text-white"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
