import type { Metadata } from "next";

import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${company.name} for general inquiries, collaborations, and questions.`,
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
