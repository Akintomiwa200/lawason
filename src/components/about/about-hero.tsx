import { homeImages } from "@/lib/home-images";

const heroImages = {
  main: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=680&h=960&fit=crop&q=80",
  top: homeImages.lighting.src,
  bottom: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=680&h=440&fit=crop&q=80",
};

export function AboutHero() {
  return (
    <section className="bg-[var(--lp-bg)] pt-24 md:pt-28">
      <div className="mx-auto max-w-[1140px] px-6">
        <h1 className="mx-auto max-w-[720px] text-center font-display text-[2.125rem] font-normal leading-[1.22] tracking-[-0.025em] text-[var(--lp-text)] sm:text-[2.625rem] md:text-[3rem]">
          You can always{" "}
          <span className="font-bold text-accent">count on us</span> on set.
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-[1.12fr_1fr] md:grid-rows-1 md:gap-[18px]">
          <div className="h-full min-h-[320px] overflow-hidden rounded-[18px] md:min-h-[548px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImages.main}
              alt="Cinematic production on set"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex h-full min-h-[320px] flex-col gap-4 md:min-h-0 md:gap-[18px]">
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImages.top}
                alt={homeImages.lighting.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-h-[150px] flex-1 overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImages.bottom}
                alt="Production crew filming"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
