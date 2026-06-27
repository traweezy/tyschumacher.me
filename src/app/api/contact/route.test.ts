import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
const resendConstructor = vi.fn(function ResendMock() {
  return {
    emails: {
      send: sendMock,
    },
  };
});

vi.mock("resend", () => ({
  Resend: resendConstructor,
}));

const loadRoute = async () => {
  const routeModule = await import("@/app/api/contact/route");
  return routeModule.POST;
};

const createRequest = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const successfulResendResult = {
  data: { id: "email-id" },
  error: null,
  headers: null,
};

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

  it("returns validation errors for multi-line names", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const POST = await loadRoute();

    const response = await POST(
      createRequest({
        name: "Philip\nFry",
        email: "fry@planetexpress.com",
        message: "Delivery for Professor Farnsworth",
      }),
    );

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "name",
          message: "Use a single-line name",
        }),
      ]),
    );
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid idempotency keys", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const POST = await loadRoute();

    const response = await POST(
      createRequest(
        {
          name: "Philip J Fry",
          email: "fry@planetexpress.com",
          message: "Delivery for Professor Farnsworth",
        },
        { "Idempotency-Key": "contact/invalid key" },
      ),
    );

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.message).toMatch(/invalid idempotency key/i);
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
    sendMock.mockResolvedValue(successfulResendResult);

    const response = await POST(
      createRequest(
        {
          name: "Philip J Fry",
          email: "fry@planetexpress.com",
          message: "Delivery for Professor Farnsworth",
        },
        { "Idempotency-Key": "contact/test-send" },
      ),
    );

    expect(response.status).toBe(200);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: "fry@planetexpress.com",
      }),
      expect.objectContaining({
        idempotencyKey: "contact/test-send",
      }),
    );
  });

  it("trims validated values and escapes user input in email html", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const POST = await loadRoute();
    sendMock.mockResolvedValue(successfulResendResult);

    const response = await POST(
      createRequest({
        name: " <Philip & Fry> ",
        email: " fry@planetexpress.com ",
        message: ' Delivery <urgent> & "fragile" package ',
      }),
    );

    expect(response.status).toBe(200);
    expect(sendMock).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        idempotencyKey: expect.stringMatching(/^contact\//),
      }),
    );
    const emailPayload = sendMock.mock.calls[0]?.[0] as
      | {
          html: string;
          replyTo: string;
          subject: string;
          text: string;
        }
      | undefined;

    expect(emailPayload).toEqual(
      expect.objectContaining({
        replyTo: "fry@planetexpress.com",
        subject: "New message from <Philip & Fry>",
      }),
    );
    expect(emailPayload?.text).toContain("Name: <Philip & Fry>");
    expect(emailPayload?.text).toContain(
      'Delivery <urgent> & "fragile" package',
    );
    expect(emailPayload?.html).toContain("&lt;Philip &amp; Fry&gt;");
    expect(emailPayload?.html).toContain(
      "Delivery &lt;urgent&gt; &amp; &quot;fragile&quot; package",
    );
    expect(emailPayload?.html).not.toContain("<urgent>");
  });

  it("propagates resend error results as 502", async () => {
    process.env.RESEND_API_KEY = "test-key";
    const POST = await loadRoute();
    sendMock.mockResolvedValue({
      data: null,
      error: {
        message: "Rate limit exceeded",
        name: "rate_limit_exceeded",
        statusCode: 429,
      },
      headers: null,
    });

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
