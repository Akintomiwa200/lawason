import Link from "next/link";

import { cn } from "@/lib/utils";

import { contactChannels } from "./contact-data";

export function ContactInfoCards() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
      {contactChannels.map((channel) => {
        const Icon = channel.icon;
        const Wrapper = channel.external ? "a" : Link;
        const wrapperProps = channel.external
          ? { href: channel.href, target: "_blank", rel: "noreferrer" }
          : { href: channel.href };

        return (
          <Wrapper
            key={channel.title}
            {...wrapperProps}
            className={cn(
              "group rounded-2xl border border-border bg-surface p-5 transition duration-300",
              "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_12px_32px_rgba(22,163,74,0.08)]",
            )}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              {channel.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {channel.description}
            </p>
            <p className="mt-3 text-xs font-medium text-accent group-hover:underline">
              {channel.action}
            </p>
          </Wrapper>
        );
      })}
    </div>
  );
}
