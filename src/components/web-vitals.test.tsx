import { render, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { WebVitals } from "./web-vitals";
const mocks = vi.hoisted(() => ({
  hook: vi.fn(),
  mode: vi.fn(),
  init: vi.fn(),
  report: vi.fn(),
}));
vi.mock("next/web-vitals", () => ({ useReportWebVitals: mocks.hook }));
vi.mock("@/lib/telemetry-config", () => ({ getTelemetryMode: mocks.mode }));
vi.mock("@/lib/observability", () => ({
  initObservability: mocks.init,
  reportWebVital: mocks.report,
}));
beforeEach(() => mocks.mode.mockReturnValue("disabled"));
it("keeps telemetry off when no production collector is configured", async () => {
  render(<WebVitals />);
  const report = mocks.hook.mock.calls[0]?.[0];
  report({ name: "LCP", value: 800, rating: "good", id: "private-session" });
  await Promise.resolve();
  expect(mocks.report).not.toHaveBeenCalled();
});
it("exports only the measurement, name, and rating", async () => {
  mocks.mode.mockReturnValue("otlp");
  render(<WebVitals />);
  const report = mocks.hook.mock.calls[0]?.[0];
  report({
    name: "LCP",
    value: 800,
    rating: "good",
    id: "private-session",
    entries: [],
  });
  await waitFor(() =>
    expect(mocks.report).toHaveBeenCalledWith({
      name: "LCP",
      value: 800,
      rating: "good",
    }),
  );
  expect(mocks.init).toHaveBeenCalledOnce();
});
