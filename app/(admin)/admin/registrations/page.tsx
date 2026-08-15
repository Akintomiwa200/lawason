import { updateRegistrationStatus } from "@/actions/events";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import type { EnrollmentDetails } from "@/types/events";

function asDetails(value: unknown): EnrollmentDetails {
  if (!value || typeof value !== "object") {
    return {};
  }
  return value as EnrollmentDetails;
}

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.eventRegistration.findMany({
    include: { event: { select: { title: true, slug: true, requiresPayment: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="Registrations">
      <div className="overflow-x-auto rounded-3xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-elevated text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Applicant</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Details</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => {
              const details = asDetails(registration.details);
              return (
                <tr key={registration.id} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{registration.name}</p>
                    <p className="text-muted">{registration.email}</p>
                    {registration.phone ? <p className="text-muted">{registration.phone}</p> : null}
                  </td>
                  <td className="px-4 py-3">{registration.event.title}</td>
                  <td className="px-4 py-3 text-muted">
                    {details.city ? <p>City: {details.city}</p> : null}
                    {details.experienceLevel ? <p>Experience: {details.experienceLevel}</p> : null}
                    {details.roleInterest ? <p>Department: {details.roleInterest}</p> : null}
                    {details.emergencyName ? (
                      <p>
                        Emergency: {details.emergencyName} {details.emergencyPhone}
                      </p>
                    ) : null}
                    {registration.notes ? <p className="mt-1">{registration.notes}</p> : null}
                  </td>
                  <td className="px-4 py-3">{registration.status}</td>
                  <td className="px-4 py-3">
                    <p>{registration.paymentStatus}</p>
                    {registration.paymentReference ? (
                      <p className="text-xs text-muted">{registration.paymentReference}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <form
                      action={async () => {
                        "use server";
                        await updateRegistrationStatus(registration.id, "CONFIRMED");
                      }}
                    >
                      <button type="submit" className="text-accent hover:underline">
                        Confirm
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {registrations.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted">No registrations yet.</p>
        ) : null}
      </div>
    </AdminShell>
  );
}
