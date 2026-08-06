import type { Metadata } from "next";

import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${company.name} — book productions, send inquiries, or visit us in ${company.location}.`,
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
