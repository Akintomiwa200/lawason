import Link from "next/link";

interface AuthCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="flex items-center justify-center px-4 py-24 md:px-8 lg:min-h-screen lg:py-4">
      <div className="w-full max-w-md">
        {eyebrow ? (
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.28em] text-accent"
          >
            {eyebrow}
          </Link>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold text-foreground">{title}</h1>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
        <div className="mt-8">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </main>
  );
}
