"use client";

import React, { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccessibilityStore } from "@/state/accessibility-store";
import { initObservability } from "@/lib/observability";

type ProvidersProps = {
  children: ReactNode;
};

const useInitializePreferences = (): void => {
  const setPrefersReducedMotion = useAccessibilityStore(
    (state) => state.setPrefersReducedMotion,
  );
  const prefersReducedMotion = useAccessibilityStore(
    (state) => state.prefersReducedMotion,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (matches: boolean) => {
      setPrefersReducedMotion(matches);
    };
    handleMotionChange(motionQuery.matches);
    const listener = (event: MediaQueryListEvent) =>
      handleMotionChange(event.matches);
    if ("addEventListener" in motionQuery) {
      motionQuery.addEventListener("change", listener);
      return () => motionQuery.removeEventListener("change", listener);
    }
    (motionQuery as MediaQueryList).addListener(listener);
    return () => (motionQuery as MediaQueryList).removeListener(listener);
  }, [setPrefersReducedMotion]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = prefersReducedMotion ? "reduce" : "safe";
  }, [prefersReducedMotion]);
};

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 60_000,
            gcTime: 5 * 60_000,
          },
        },
      }),
  );

  useInitializePreferences();

  useEffect(() => {
    initObservability();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
