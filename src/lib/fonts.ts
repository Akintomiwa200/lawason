import {
  Bricolage_Grotesque,
  DM_Sans,
  JetBrains_Mono,
  Nunito_Sans,
  Plus_Jakarta_Sans,
} from "next/font/google";

export const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const nunitoSans = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const fontVariables = [
  dmSans.variable,
  jakarta.variable,
  jetbrainsMono.variable,
  nunitoSans.variable,
  bricolageGrotesque.variable,
].join(" ");
