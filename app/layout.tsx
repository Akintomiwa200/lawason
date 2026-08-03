import type { Metadata } from "next";
import Script from "next/script";

import { AppProviders } from "@/components/providers/app-providers";
import { company } from "@/lib/company";
import { fontVariables } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: company.name,
    template: `%s · ${company.shortName} Studios`,
  },
  description: company.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: company.name,
    description: company.description,
    type: "website",
  },
};

const themeInitScript = `
(function () {
  var key = "gmlawason-theme";

  function getTheme() {
    try {
      var stored = localStorage.getItem(key);
      if (stored === "system") return "system";
      if (stored === "light" || stored === "dark") {
        localStorage.setItem(key, "system");
        return "system";
      }
      return "system";
    } catch (e) {
      return "system";
    }
  }

  function resolveTheme(theme) {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }

  function applyTheme() {
    var resolved = resolveTheme(getTheme());
    var root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  }

  applyTheme();

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (getTheme() === "system") {
      applyTheme();
    }
  });

  window.addEventListener("storage", function (event) {
    if (event.key === key) {
      applyTheme();
    }
  });
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} min-h-full font-sans antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
