"use client";
import { memo } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { getTelemetryMode } from "@/lib/telemetry-config";
type Reporter = Parameters<typeof useReportWebVitals>[0];
const reportVital: Reporter = ({ name, value, rating }) => {
  if (getTelemetryMode() === "disabled") return;
  void import("@/lib/observability")
    .then(({ initObservability, reportWebVital }) => {
      initObservability();
      reportWebVital({ name, value, rating });
    })
    .catch(() => console.error("telemetry.vital_failed"));
};
export const WebVitals = memo(() => {
  useReportWebVitals(reportVital);
  return null;
});
WebVitals.displayName = "WebVitals";
