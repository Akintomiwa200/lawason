"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { ScrollbarProvider } from "@/components/providers/scrollbar-provider";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ThemeProvider } from "@/contexts/theme-context";
import { useResolvedTheme } from "@/hooks/use-theme";

interface AppProvidersProps {
  children: ReactNode;
}

function SonnerToaster() {
  const resolvedTheme = useResolvedTheme();

  return (
    <Toaster
      theme={resolvedTheme}
      richColors
      closeButton
      position="top-right"
    />
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system">
      <MotionProvider>
        <SessionProvider>
          <ScrollbarProvider>
            {children}
            <SonnerToaster />
          </ScrollbarProvider>
        </SessionProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
