import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(12),
});

const resendApiKey = process.env.RESEND_API_KEY;
const resend =
  typeof resendApiKey === "string" && resendApiKey.length > 0
    ? new Resend(resendApiKey)
    : null;

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
    const errors = parsed.error.issues.map((issue) => ({
      field: typeof issue.path[0] === "string" ? issue.path[0] : "form",
      message: issue.message,
    }));
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
        message: "Email service is not configured. Please email tyschumacher@proton.me directly.",
      },
      { status: 503 },
    );
  }

  try {
    await resend.emails.send({
      from: "Tyler Schumacher <noreply@tyschumacher.me>",
      to: "tyschumacher@proton.me",
      replyTo: parsed.data.email,
      subject: `New message from ${parsed.data.name}`,
      text: [
        `Name: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        "",
        parsed.data.message,
      ].join("\n"),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #101736;">
          <p><strong>Name:</strong> ${parsed.data.name}</p>
          <p><strong>Email:</strong> ${parsed.data.email}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="white-space: pre-wrap; margin: 0;">${parsed.data.message}</p>
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
