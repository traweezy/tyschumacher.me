import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
const resendConstructor = vi.fn(() => ({
  emails: {
    send: sendMock,
  },
}));

vi.mock("resend", () => ({
  Resend: resendConstructor,
}));

const loadRoute = async () => {
  const routeModule = await import("@/app/api/contact/route");
  return routeModule.POST;
};

const createRequest = (body: unknown) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.resetModules();
    sendMock.mockReset();
    resendConstructor.mockClear();
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
  });

  it("returns 400 for invalid json", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const POST = await loadRoute();
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: "{not-json",
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.message).toMatch(/invalid/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns validation errors when fields are missing", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const POST = await loadRoute();

    const response = await POST(createRequest({}));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.errors).toHaveLength(3);
    expect(payload.message).toMatch(/double-check/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 503 when resend key is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const POST = await loadRoute();
    const response = await POST(
      createRequest({
        name: "Philip J Fry",
        email: "fry@planetexpress.com",
        message: "Delivery for Professor Farnsworth",
      }),
    );

    expect(response.status).toBe(503);
    const payload = await response.json();
    expect(payload.message).toMatch(/email service is not configured/i);
  });

  it("sends email payload when data is valid", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const POST = await loadRoute();
    sendMock.mockResolvedValue({});

    const response = await POST(
      createRequest({
        name: "Philip J Fry",
        email: "fry@planetexpress.com",
        message: "Delivery for Professor Farnsworth",
      }),
    );

    expect(response.status).toBe(200);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: "fry@planetexpress.com",
      }),
    );
  });

  it("propagates resend failures as 502", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const POST = await loadRoute();
    sendMock.mockRejectedValue(new Error("Resend outage"));

    const response = await POST(
      createRequest({
        name: "Philip J Fry",
        email: "fry@planetexpress.com",
        message: "Delivery for Professor Farnsworth",
      }),
    );

    expect(response.status).toBe(502);
    const payload = await response.json();
    expect(payload.message).toMatch(/couldn’t send your message/i);
  });
});
