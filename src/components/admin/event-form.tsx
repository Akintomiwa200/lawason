"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { saveEvent } from "@/actions/events";
import { MediaUploader } from "@/components/admin/media-uploader";

interface EventFormProps {
  event?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    type: "CAMP" | "WORKSHOP" | "MASTERCLASS" | "OTHER";
    status: "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED";
    location: string | null;
    format?: "IN_PERSON" | "ONLINE_APP" | "ZOOM" | "GOOGLE_MEET" | "HYBRID";
    meetingUrl?: string | null;
    meetingId?: string | null;
    meetingPasscode?: string | null;
    streamUrl?: string | null;
    timezone?: string;
    startDate: string;
    endDate: string | null;
    capacity: number | null;
    coverImage: string | null;
    priceLabel: string | null;
    category: string | null;
    organizer: string | null;
    requiresPayment: boolean;
    priceAmount: number | null;
    currency: string;
    paymentMethod: "NONE" | "BANK_TRANSFER" | "PAYMENT_LINK" | "PAYSTACK";
    paymentLink: string | null;
    paymentInstructions: string | null;
    outline: string | null;
    audience: string | null;
    includes: string | null;
    scheduleNotes: string | null;
    requireLogin: boolean;
    collectPhone: boolean;
    collectNotes: boolean;
    collectCity: boolean;
    collectEmergency: boolean;
    collectExperience: boolean;
    collectPortfolio: boolean;
    collectGuardian: boolean;
    confirmationMessage: string | null;
  };
}

const fieldClass =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState(event?.coverImage ?? "");
  const [requiresPayment, setRequiresPayment] = useState(event?.requiresPayment ?? false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    try {
      const capacityValue = String(formData.get("capacity") ?? "");
      const saved = await saveEvent({
        id: event?.id,
        title: String(formData.get("title") ?? ""),
        slug: String(formData.get("slug") ?? ""),
        description: String(formData.get("description") ?? ""),
        type: String(formData.get("type") ?? "CAMP") as
          | "CAMP"
          | "WORKSHOP"
          | "MASTERCLASS"
          | "OTHER",
        status: String(formData.get("status") ?? "DRAFT") as
          | "DRAFT"
          | "OPEN"
          | "CLOSED"
          | "COMPLETED",
        location: String(formData.get("location") ?? ""),
        format: String(formData.get("format") ?? "IN_PERSON") as
          | "IN_PERSON"
          | "ONLINE_APP"
          | "ZOOM"
          | "GOOGLE_MEET"
          | "HYBRID",
        meetingUrl: String(formData.get("meetingUrl") ?? ""),
        meetingId: String(formData.get("meetingId") ?? ""),
        meetingPasscode: String(formData.get("meetingPasscode") ?? ""),
        streamUrl: String(formData.get("streamUrl") ?? ""),
        timezone: String(formData.get("timezone") ?? "Africa/Lagos"),
        startDate: String(formData.get("startDate") ?? ""),
        endDate: String(formData.get("endDate") ?? "") || undefined,
        capacity: capacityValue ? Number(capacityValue) : undefined,
        coverImage,
        priceLabel: String(formData.get("priceLabel") ?? ""),
        category: String(formData.get("category") ?? ""),
        organizer: String(formData.get("organizer") ?? ""),
        requiresPayment,
        priceAmount: String(formData.get("priceAmount") ?? "")
          ? Number(formData.get("priceAmount"))
          : undefined,
        currency: String(formData.get("currency") ?? "NGN"),
        paymentMethod: String(formData.get("paymentMethod") ?? "NONE") as
          | "NONE"
          | "BANK_TRANSFER"
          | "PAYMENT_LINK",
        paymentLink: String(formData.get("paymentLink") ?? ""),
        paymentInstructions: String(formData.get("paymentInstructions") ?? ""),
        outline: String(formData.get("outline") ?? ""),
        audience: String(formData.get("audience") ?? ""),
        includes: String(formData.get("includes") ?? ""),
        scheduleNotes: String(formData.get("scheduleNotes") ?? ""),
        requireLogin: formData.get("requireLogin") === "on",
        collectPhone: formData.get("collectPhone") === "on",
        collectNotes: formData.get("collectNotes") === "on",
        collectCity: formData.get("collectCity") === "on",
        collectEmergency: formData.get("collectEmergency") === "on",
        collectExperience: formData.get("collectExperience") === "on",
        collectPortfolio: formData.get("collectPortfolio") === "on",
        collectGuardian: formData.get("collectGuardian") === "on",
        confirmationMessage: String(formData.get("confirmationMessage") ?? ""),
      });
      toast.success("Event saved");
      router.push(`/admin/events/${saved.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save event");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">Title</span>
        <input name="title" defaultValue={event?.title} className={fieldClass} required />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">Slug</span>
        <input name="slug" defaultValue={event?.slug} className={fieldClass} placeholder="summer-camp-2026" />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">Description</span>
        <textarea name="description" defaultValue={event?.description} rows={6} className={fieldClass} required />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">What you will cover</span>
        <textarea
          name="outline"
          defaultValue={event?.outline ?? ""}
          rows={5}
          className={fieldClass}
          placeholder="One point per line"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">Who it is for</span>
        <textarea name="audience" defaultValue={event?.audience ?? ""} rows={3} className={fieldClass} />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">What is included</span>
        <textarea
          name="includes"
          defaultValue={event?.includes ?? ""}
          rows={4}
          className={fieldClass}
          placeholder="One item per line"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">Schedule</span>
        <textarea
          name="scheduleNotes"
          defaultValue={event?.scheduleNotes ?? ""}
          rows={4}
          className={fieldClass}
          placeholder="One session per line"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Type</span>
          <select name="type" defaultValue={event?.type ?? "CAMP"} className={fieldClass}>
            <option value="CAMP">Camp</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="MASTERCLASS">Masterclass</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Status</span>
          <select name="status" defaultValue={event?.status ?? "DRAFT"} className={fieldClass}>
            <option value="DRAFT">Draft</option>
            <option value="OPEN">Open for registration</option>
            <option value="CLOSED">Closed</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">Location</span>
        <input name="location" defaultValue={event?.location ?? ""} className={fieldClass} />
      </label>
      <div className="rounded-3xl border border-border bg-surface-elevated p-5">
        <h2 className="font-display text-lg font-semibold">How people attend</h2>
        <p className="mt-1 text-sm text-muted">
          In-person studio days, live in the app, Zoom, Google Meet, or hybrid.
        </p>
        <label className="mt-4 block space-y-2 text-sm">
          <span className="font-medium">Format</span>
          <select name="format" defaultValue={event?.format ?? "IN_PERSON"} className={fieldClass}>
            <option value="IN_PERSON">In person</option>
            <option value="ONLINE_APP">Live in the app</option>
            <option value="ZOOM">Zoom</option>
            <option value="GOOGLE_MEET">Google Meet</option>
            <option value="HYBRID">Studio + online</option>
          </select>
        </label>
        <label className="mt-4 block space-y-2 text-sm">
          <span className="font-medium">Zoom / Meet link</span>
          <input name="meetingUrl" defaultValue={event?.meetingUrl ?? ""} className={fieldClass} placeholder="https://zoom.us/j/… or https://meet.google.com/…" />
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium">Meeting ID</span>
            <input name="meetingId" defaultValue={event?.meetingId ?? ""} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium">Passcode</span>
            <input name="meetingPasscode" defaultValue={event?.meetingPasscode ?? ""} className={fieldClass} />
          </label>
        </div>
        <label className="mt-4 block space-y-2 text-sm">
          <span className="font-medium">In-app stream URL</span>
          <input
            name="streamUrl"
            defaultValue={event?.streamUrl ?? ""}
            className={fieldClass}
            placeholder="YouTube live embed or studio stream"
          />
        </label>
        <input type="hidden" name="timezone" value={event?.timezone ?? "Africa/Lagos"} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Category tag</span>
          <input name="category" defaultValue={event?.category ?? ""} className={fieldClass} placeholder="Lighting" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Organizer</span>
          <input name="organizer" defaultValue={event?.organizer ?? ""} className={fieldClass} placeholder="GM Lawason Studios" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Start</span>
          <input
            type="datetime-local"
            name="startDate"
            defaultValue={event?.startDate}
            className={fieldClass}
            required
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">End</span>
          <input type="datetime-local" name="endDate" defaultValue={event?.endDate ?? ""} className={fieldClass} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Capacity</span>
          <input type="number" min={1} name="capacity" defaultValue={event?.capacity ?? ""} className={fieldClass} />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Price label</span>
          <input name="priceLabel" defaultValue={event?.priceLabel ?? ""} className={fieldClass} placeholder="Free / ₦50,000" />
        </label>
      </div>
      <MediaUploader
        label="Cover image"
        value={coverImage}
        folder="gmlawason/events"
        onChange={(url) => setCoverImage(url)}
      />

      <div className="rounded-3xl border border-border bg-surface-elevated p-5">
        <h2 className="font-display text-lg font-semibold">Enrollment workflow</h2>
        <p className="mt-1 text-sm text-muted">
          Control how people register, whether they must sign in, and if payment is required.
        </p>
        <div className="mt-4 grid gap-3 text-sm">
          <label className="flex items-center gap-3">
            <input type="checkbox" name="requireLogin" defaultChecked={event?.requireLogin} className="accent-accent" />
            Require signed-in account
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="collectPhone" defaultChecked={event?.collectPhone ?? true} className="accent-accent" />
            Collect phone number
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="collectCity" defaultChecked={event?.collectCity ?? true} className="accent-accent" />
            Collect city
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="collectExperience" defaultChecked={event?.collectExperience ?? true} className="accent-accent" />
            Collect set experience and department
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="collectPortfolio" defaultChecked={event?.collectPortfolio ?? true} className="accent-accent" />
            Collect reel or portfolio link
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="collectEmergency" defaultChecked={event?.collectEmergency ?? true} className="accent-accent" />
            Collect emergency contact
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="collectGuardian" defaultChecked={event?.collectGuardian ?? false} className="accent-accent" />
            Collect parent or guardian (camps)
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="collectNotes" defaultChecked={event?.collectNotes ?? true} className="accent-accent" />
            Collect notes
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={requiresPayment}
              onChange={(eventChange) => setRequiresPayment(eventChange.target.checked)}
              className="accent-accent"
            />
            Payment required
          </label>
        </div>

        {requiresPayment ? (
          <div className="mt-4 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="font-medium">Amount</span>
                <input type="number" min={0} name="priceAmount" defaultValue={event?.priceAmount ?? ""} className={fieldClass} />
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium">Currency</span>
                <input name="currency" defaultValue={event?.currency ?? "NGN"} className={fieldClass} />
              </label>
            </div>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Payment method</span>
              <select name="paymentMethod" defaultValue={event?.paymentMethod ?? "PAYSTACK"} className={fieldClass}>
                <option value="PAYSTACK">Paystack (card, transfer, USSD)</option>
                <option value="BANK_TRANSFER">Manual bank transfer</option>
                <option value="PAYMENT_LINK">External payment link</option>
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Payment link</span>
              <input name="paymentLink" defaultValue={event?.paymentLink ?? ""} className={fieldClass} placeholder="https://" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Payment instructions</span>
              <textarea
                name="paymentInstructions"
                defaultValue={event?.paymentInstructions ?? ""}
                rows={4}
                className={fieldClass}
                placeholder="Bank name, account number, or what to do after paying"
              />
            </label>
          </div>
        ) : null}

        <label className="mt-4 block space-y-2 text-sm">
          <span className="font-medium">Confirmation message</span>
          <textarea
            name="confirmationMessage"
            defaultValue={event?.confirmationMessage ?? ""}
            rows={3}
            className={fieldClass}
            placeholder="Shown after successful enrollment"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow hover:brightness-110"
      >
        {saving ? "Saving…" : "Save event"}
      </button>
    </form>
  );
}
