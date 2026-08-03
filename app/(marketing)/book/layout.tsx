import type { Metadata } from "next";

import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Book a Session",
  description: `Book a studio session with ${company.name} for filmmaking, gaffer services, and special effect lighting.`,
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
