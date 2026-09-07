"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useEffectEvent, useState } from "react";
import { WebVitals } from "@/components/web-vitals";
import { getTelemetryMode } from "@/lib/telemetry-config";
import {
  usePrefersReducedMotion,
  useSetPrefersReducedMotion,
} from "@/state/accessibility-store";

type ProvidersProps = {
  children: ReactNode;
};

const useInitializePreferences = (): void => {
  const setPrefersReducedMotion = useSetPrefersReducedMotion();
  const prefersReducedMotion = usePrefersReducedMotion();
  const handleMotionPreference = useEffectEvent((matches: boolean) => {
    setPrefersReducedMotion(matches);
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    handleMotionPreference(motionQuery.matches);
    const listener = (event: MediaQueryListEvent) =>
      handleMotionPreference(event.matches);
    if ("addEventListener" in motionQuery) {
      motionQuery.addEventListener("change", listener);
      return () => motionQuery.removeEventListener("change", listener);
    }
    (motionQuery as MediaQueryList).addListener(listener);
    return () => (motionQuery as MediaQueryList).removeListener(listener);
  }, []);

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
    if (getTelemetryMode() === "disabled") return;
    let active = true;
    void import("@/lib/observability")
      .then(({ initObservability }) => {
        if (active) initObservability();
      })
      .catch(() => console.error("telemetry.load_failed"));
    return () => {
      active = false;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WebVitals />
      {children}
    </QueryClientProvider>
  );
};
