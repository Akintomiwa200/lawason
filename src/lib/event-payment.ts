import { publishEventLive } from "@/lib/event-bus";
import { prisma } from "@/lib/db";
import { getEventLiveSnapshot } from "@/lib/event-queries";

export async function markRegistrationPaid(reference: string) {
  const registration = await prisma.eventRegistration.findFirst({
    where: {
      OR: [{ paymentReference: reference }, { id: reference }],
    },
    include: { event: { select: { id: true, slug: true } } },
  });

  if (!registration) {
    return null;
  }

  const updated = await prisma.eventRegistration.update({
    where: { id: registration.id },
    data: {
      paymentStatus: "PAID",
      paymentProvider: "PAYSTACK",
      paymentReference: reference,
      status: "CONFIRMED",
      paidAt: new Date(),
    },
  });

  const snapshot = await getEventLiveSnapshot(registration.event.id);
  if (snapshot) {
    publishEventLive(snapshot);
  }

  return { ...updated, slug: registration.event.slug };
}
