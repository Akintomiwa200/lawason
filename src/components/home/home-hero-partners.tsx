import { PartnerMarquee } from "@/components/shared/partner-marquee";

export function HomeHeroPartners() {
  return (
    <div className="bg-background/90 py-5">
      <div className="relative mx-auto max-w-6xl overflow-hidden px-6">
        <PartnerMarquee fadeClassName="from-background" itemClassName="text-foreground" />
      </div>
    </div>
  );
}
