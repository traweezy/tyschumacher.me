import { afterEach, describe, expect, it, vi } from "vitest";
import { Resend } from "resend";
import { ContactEmailClient } from "./resend-client";
afterEach(() => vi.restoreAllMocks());
describe("email HTTP timeout", () => {
  it("bounds the actual SDK fetch and preserves existing cancellation", async () => {
    const request = vi
      .spyOn(Resend.prototype, "fetchRequest")
      .mockResolvedValue({ data: { id: "test" }, error: null, headers: null });
    const timeout = vi.spyOn(AbortSignal, "timeout");
    const client = new ContactEmailClient("test-key");
    await client.fetchRequest("/emails", { method: "POST" });
    expect(timeout).toHaveBeenCalledWith(10000);
    expect(request).toHaveBeenCalledWith(
      "/emails",
      expect.objectContaining({
        method: "POST",
        signal: expect.any(AbortSignal),
      }),
    );
    const controller = new AbortController();
    controller.abort();
    await client.fetchRequest("/emails", { signal: controller.signal });
    expect(request.mock.calls[1]?.[1]).toEqual(
      expect.objectContaining({
        signal: expect.objectContaining({ aborted: true }),
      }),
    );
  });
});
