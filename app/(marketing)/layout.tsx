import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublishedNavPages } from "@/lib/nav-pages";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const extraNav = (await getPublishedNavPages()).map((page) => ({
    label: page.title,
    href: `/pages/${page.slug}`,
  }));

  return (
    <>
      <SiteHeader extraNav={extraNav} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
