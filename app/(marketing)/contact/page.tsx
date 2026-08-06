import { AboutContactCta } from "@/components/about/about-contact-cta";
import { ContactFormSection, ContactVisitSection } from "@/components/contact";
import { PageShell } from "@/components/pages/page-sections";

export default function ContactPage() {
  return (
    <PageShell hideSpotlight>
      <ContactFormSection />
      <ContactVisitSection />
      <AboutContactCta variant="contact" />
    </PageShell>
  );
}
