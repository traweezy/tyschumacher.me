import { describe, expect, it } from "vitest";
import { createContentSecurityPolicy } from "@/proxy";

describe("createContentSecurityPolicy", () => {
  it("allows a configured OTLP origin in connect-src", () => {
    const csp = createContentSecurityPolicy("test-nonce", {
      NEXT_PUBLIC_OTEL_EXPORT_URL: "https://otel.example.com/v1/traces",
    });

    expect(csp).toContain("connect-src 'self' https://otel.example.com");
  });

  it("keeps connect-src locked to self for invalid OTLP URLs", () => {
    const csp = createContentSecurityPolicy("test-nonce", {
      NEXT_PUBLIC_OTEL_EXPORT_URL: "javascript:alert(1)",
    });

    expect(csp).toContain("connect-src 'self'");
    expect(csp).not.toContain("javascript:");
  });
});
