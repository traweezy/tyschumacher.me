import { describe, expect, it } from "vitest";
import {
  getTelemetryConnectSource,
  getTelemetryExportUrl,
  getTelemetryMode,
} from "@/lib/telemetry-config";

describe("telemetry config", () => {
  it("normalizes valid OTLP export URLs", () => {
    expect(
      getTelemetryExportUrl({
        NEXT_PUBLIC_OTEL_EXPORT_URL: " https://otel.example.com/v1/traces ",
      }),
    ).toBe("https://otel.example.com/v1/traces");
  });

  it("rejects missing or non-http OTLP export URLs", () => {
    expect(getTelemetryExportUrl({})).toBeNull();
    expect(
      getTelemetryExportUrl({
        NEXT_PUBLIC_OTEL_EXPORT_URL: "javascript:alert(1)",
      }),
    ).toBeNull();
  });

  it("derives the CSP connect source from the OTLP origin", () => {
    expect(
      getTelemetryConnectSource({
        NEXT_PUBLIC_OTEL_EXPORT_URL: "https://otel.example.com/v1/traces",
      }),
    ).toBe("https://otel.example.com");
  });

  it("disables telemetry exporting in production without an OTLP URL", () => {
    expect(getTelemetryMode({ NODE_ENV: "production" })).toBe("disabled");
  });

  it("uses the development console exporter only outside production", () => {
    expect(getTelemetryMode({ NODE_ENV: "development" })).toBe("console");
  });

  it("uses OTLP mode when an export URL is configured", () => {
    expect(
      getTelemetryMode({
        NEXT_PUBLIC_OTEL_EXPORT_URL: "https://otel.example.com/v1/traces",
        NODE_ENV: "production",
      }),
    ).toBe("otlp");
  });
});
