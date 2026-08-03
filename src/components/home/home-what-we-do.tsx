import {
  Compass,
  FileCheck,
  ImageIcon,
  NotebookPen,
  Package,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const STEP_WIDTH = "w-full max-w-[20rem] sm:max-w-[22rem]";

interface ProcessStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

const processSteps = {
  discover: {
    title: "Discover",
    description:
      "We start with a deep dive into your goals, audience, and vision to lay the foundation for impactful creative work.",
    icon: Compass,
  },
  strategize: {
    title: "Strategize",
    description:
      "Our team develops a tailored concept and storyboard, aligning every detail with your brand message and objectives.",
    icon: NotebookPen,
  },
  create: {
    title: "Create",
    description:
      "The magic happens here. From crafting stunning visuals to refining animations, we bring your vision to life with precision.",
    icon: ImageIcon,
  },
  refine: {
    title: "Refine",
    description:
      "Collaboration is key. We incorporate your feedback to ensure the final product aligns perfectly with your expectations.",
    icon: FileCheck,
  },
  deliver: {
    title: "Deliver",
    description:
      "On time and optimized for every platform, we hand over a polished project ready to captivate your audience.",
    icon: Package,
  },
} satisfies Record<string, ProcessStep>;

function StepContent({ step }: { step: ProcessStep }) {
  const Icon = step.icon;

  return (
    <div className={STEP_WIDTH}>
      <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent text-accent-foreground">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
      </div>
      <h3 className="mt-3 text-[15px] font-bold leading-none text-accent">
        {step.title}
      </h3>
      <p className="mt-2.5 text-[13px] leading-[1.7] text-muted">
        {step.description}
      </p>
    </div>
  );
}

function StepCell({
  step,
  className,
}: {
  step: ProcessStep;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-9 sm:px-10 sm:py-10 md:px-12 md:py-11", className)}>
      <StepContent step={step} />
    </div>
  );
}

export function HomeWhatWeDo() {
  return (
    <section className="w-full bg-background py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[clamp(1.65rem,3.8vw,2.25rem)] font-bold leading-[1.25] tracking-[-0.01em] text-foreground">
            Our Creative Process From Concept to Completion
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[13px] leading-[1.75] text-muted sm:text-sm">
            Here&apos;s how we ensure every project delivers exceptional results
            across motion graphics, short-form videos, and graphic creatives.
          </p>
        </header>

        <div className="mt-12 w-full border-t border-border">
          {/* Discover — center */}
          <div className="grid w-full grid-cols-1 md:grid-cols-[1fr_minmax(280px,22rem)_1fr]">
            <div className="hidden border-b border-border md:block" />
            <StepCell
              step={processSteps.discover}
              className="border-b border-border md:border-x"
            />
            <div className="hidden border-b border-border md:block" />
          </div>

          {/* Strategize — left */}
          <div className="grid w-full grid-cols-1 md:grid-cols-[minmax(280px,22rem)_1fr]">
            <StepCell
              step={processSteps.strategize}
              className="border-b border-border md:border-r"
            />
            <div className="hidden border-b border-border md:block" />
          </div>

          {/* Create — right */}
          <div className="grid w-full grid-cols-1 md:grid-cols-[1fr_minmax(280px,22rem)]">
            <div className="hidden border-b border-border md:block" />
            <StepCell
              step={processSteps.create}
              className="border-b border-border md:border-l"
            />
          </div>

          {/* Refine — center, open left */}
          <div className="grid w-full grid-cols-1 md:grid-cols-[1fr_minmax(280px,22rem)_1fr]">
            <div className="hidden border-b border-border md:block" />
            <StepCell
              step={processSteps.refine}
              className="border-b border-border md:border-r"
            />
            <div className="hidden border-b border-border md:block" />
          </div>

          {/* Deliver — left */}
          <div className="grid w-full grid-cols-1 md:grid-cols-[minmax(280px,22rem)_1fr]">
            <StepCell step={processSteps.deliver} className="md:border-r md:border-border" />
            <div className="hidden md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
