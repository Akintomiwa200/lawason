import type { Metadata } from "next";

import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${company.name}, founder Godwin Lawani, and the studio's mission in Nigerian film and media production.`,
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
