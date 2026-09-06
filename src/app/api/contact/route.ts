import { NextResponse } from "next/server";
import { ContactEmailClient } from "@/lib/resend-client";
import { SITE_URL } from "@/lib/site";
import { contactProblem } from "@/lib/http-problem";
import { createDeliveryBudget, readContactBody } from "@/lib/contact-request";
import {
  contactSchema,
  createContactIdempotencyKey,
  getContactValidationErrors,
  isContactIdempotencyKey,
} from "@/lib/contact";

const claimDelivery = createDeliveryBudget(Date.now);

const resendApiKey = process.env.RESEND_API_KEY;
const resend =
  typeof resendApiKey === "string" && resendApiKey.length > 0
    ? new ContactEmailClient(resendApiKey)
    : null;

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });

const getResendIdempotencyKey = (request: Request): string | null => {
  const idempotencyKey = request.headers.get("Idempotency-Key")?.trim();

  if (idempotencyKey && !isContactIdempotencyKey(idempotencyKey)) {
    return null;
  }

  return idempotencyKey ?? createContactIdempotencyKey();
};

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const started = performance.now();
  const problem = (
    status: number,
    title: string,
    detail: string,
    extra: {
      errors?: ReturnType<typeof getContactValidationErrors>;
      retryAfter?: number;
    } = {},
  ) => contactProblem({ status, title, detail, requestId, ...extra });
  const origin = request.headers.get("origin");
  if (
    origin &&
    origin !== new URL(request.url).origin &&
    origin !== SITE_URL &&
    origin !== "https://tyschumacher.me"
  ) {
    return problem(
      403,
      "Forbidden",
      "This form must be submitted from the portfolio site.",
    );
  }
  if (
    request.headers.get("content-type")?.split(";")[0]?.trim() !==
    "application/json"
  ) {
    return problem(
      415,
      "Unsupported media type",
      "Use an application/json request.",
    );
  }
  const body = await readContactBody(request);
  if (!body.ok)
    return problem(
      body.status,
      body.status === 413 ? "Payload too large" : "Invalid request",
      "The message could not be read. Use 4,000 characters or fewer and try again.",
    );

  const parsed = contactSchema.safeParse(body.value);

  if (!parsed.success) {
    const errors = getContactValidationErrors(parsed.error);
    return problem(
      400,
      "Validation failed",
      "Please check the highlighted fields.",
      { errors },
    );
  }

  const idempotencyKey = getResendIdempotencyKey(request);

  if (!idempotencyKey) {
    return problem(400, "Invalid idempotency key", "Invalid idempotency key.");
  }

  if (!resend) {
    console.error("contact.delivery_unavailable", { requestId });
    return problem(
      503,
      "Service unavailable",
      "Email service is not configured. Please email tyschumacher@proton.me directly.",
    );
  }

  const retryAfter = claimDelivery();
  if (retryAfter)
    return problem(
      429,
      "Too many requests",
      "Please wait a minute before trying again, or email tyschumacher@proton.me directly.",
      { retryAfter },
    );

  try {
    const { email, message, name } = parsed.data;
    const htmlEmail = escapeHtml(email);
    const htmlMessage = escapeHtml(message);
    const htmlName = escapeHtml(name);

    const result = await resend.emails.send(
      {
        from: "Tyler Schumacher <noreply@tyschumacher.me>",
        to: "tyschumacher@proton.me",
        replyTo: email,
        subject: `New message from ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #101736;">
            <p><strong>Name:</strong> ${htmlName}</p>
            <p><strong>Email:</strong> ${htmlEmail}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="white-space: pre-wrap; margin: 0;">${htmlMessage}</p>
          </div>
        `,
      },
      { idempotencyKey },
    );

    if (result.error || !result.data) {
      console.error("contact.delivery_failed", {
        requestId,
        durationMs: Math.round(performance.now() - started),
      });
      return problem(
        502,
        "Delivery failed",
        "We couldn’t send your message right now. Please try again or email tyschumacher@proton.me directly.",
      );
    }
    console.info("contact.delivered", {
      requestId,
      durationMs: Math.round(performance.now() - started),
    });
    return NextResponse.json(
      { message: "Message sent." },
      { headers: { "Cache-Control": "no-store", "X-Request-ID": requestId } },
    );
  } catch {
    console.error("contact.delivery_failed", {
      requestId,
      durationMs: Math.round(performance.now() - started),
    });
    return problem(
      502,
      "Delivery failed",
      "We couldn’t send your message right now. Please try again or email tyschumacher@proton.me directly.",
    );
  }
}
