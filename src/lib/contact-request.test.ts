import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeliveryBudget, readContactBody } from "./contact-request";
afterEach(() => vi.useRealTimers());
const request = (body: string, headers: Record<string, string> = {}) =>
  new Request("https://example.com/api/contact", {
    method: "POST",
    body,
    headers,
  });
describe("contact request boundary", () => {
  it("reads valid JSON and rejects malformed or missing bodies", async () => {
    await expect(
      readContactBody(request('{"hello":"world"}')),
    ).resolves.toEqual({ ok: true, value: { hello: "world" } });
    await expect(readContactBody(request("{"))).resolves.toEqual({
      ok: false,
      status: 400,
    });
    await expect(
      readContactBody(new Request("https://example.com")),
    ).resolves.toEqual({ ok: false, status: 400 });
  });
  it("caps actual bytes even when Content-Length is omitted or forged", async () => {
    for (const headers of [
      {},
      { "content-length": "2" },
      { "content-length": "17000" },
    ])
      await expect(
        readContactBody(request("x".repeat(17000), headers)),
      ).resolves.toEqual({ ok: false, status: 413 });
  });
  it("cancels stalled request bodies", async () => {
    vi.useFakeTimers();
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({ cancel });
    const init: RequestInit & { duplex: "half" } = {
      method: "POST",
      body,
      duplex: "half",
    };
    const result = readContactBody(new Request("https://example.com", init));
    await vi.advanceTimersByTimeAsync(10000);
    await expect(result).resolves.toEqual({ ok: false, status: 408 });
    expect(cancel).toHaveBeenCalledOnce();
  });
  it("limits deliveries and reopens after the window", () => {
    let now = 1000;
    const claim = createDeliveryBudget(() => now, 2, 60000);
    expect(claim()).toBe(0);
    expect(claim()).toBe(0);
    expect(claim()).toBe(60);
    now += 59999;
    expect(claim()).toBe(1);
    now += 1;
    expect(claim()).toBe(0);
  });
});
