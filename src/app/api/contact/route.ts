import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, getContactValidationErrors } from "@/lib/contact";

const resendApiKey = process.env.RESEND_API_KEY;
const resend =
  typeof resendApiKey === "string" && resendApiKey.length > 0
    ? new Resend(resendApiKey)
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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const errors = getContactValidationErrors(parsed.error);
    return NextResponse.json(
      {
        message: "Please double-check the highlighted fields.",
        errors,
      },
      { status: 400 },
    );
  }

  if (!resend) {
    console.error("RESEND_API_KEY is not configured.");
    return NextResponse.json(
      {
        message:
          "Email service is not configured. Please email tyschumacher@proton.me directly.",
      },
      { status: 503 },
    );
  }

  try {
    const { email, message, name } = parsed.data;
    const htmlEmail = escapeHtml(email);
    const htmlMessage = escapeHtml(message);
    const htmlName = escapeHtml(name);

    await resend.emails.send({
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
    });

    return NextResponse.json({ message: "Message sent." });
  } catch (error) {
    console.error("Unable to send contact email", error);
    return NextResponse.json(
      {
        message:
          "We couldn’t send your message right now. Please try again or email tyschumacher@proton.me directly.",
      },
      { status: 502 },
    );
  }
}
