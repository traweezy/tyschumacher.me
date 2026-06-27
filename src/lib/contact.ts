import { z } from "zod";

export const CONTACT_FIELDS = ["name", "email", "message"] as const;
const CONTACT_IDEMPOTENCY_KEY_PREFIX = "contact/";
const CONTACT_IDEMPOTENCY_KEY_PATTERN = /^contact\/[A-Za-z0-9._:-]+$/;

export type ContactField = (typeof CONTACT_FIELDS)[number];

export const isContactField = (field: string): field is ContactField =>
  CONTACT_FIELDS.includes(field as ContactField);

export const createContactIdempotencyKey = (): string => {
  const token =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  return `${CONTACT_IDEMPOTENCY_KEY_PREFIX}${token}`;
};

export const isContactIdempotencyKey = (value: string): boolean =>
  value.length <= 256 && CONTACT_IDEMPOTENCY_KEY_PATTERN.test(value);

const contactNameSchema = z
  .string()
  .trim()
  .min(2, "Tell me your name")
  .max(120, "Keep your name under 120 characters")
  .refine((value) => !/[\r\n]/.test(value), "Use a single-line name")
  .meta({
    title: "Name",
    description: "Single-line sender name for the contact request.",
    examples: ["Jordan Lee"],
  });

const contactEmailSchema = z
  .string()
  .trim()
  .email("Use a valid email")
  .max(254, "Keep your email under 254 characters")
  .meta({
    title: "Email address",
    description: "Reply-to email address for the contact request.",
    examples: ["jordan@company.com"],
  });

const contactMessageSchema = z
  .string()
  .trim()
  .min(12, "Add more context so I can help")
  .max(4000, "Keep your message under 4000 characters")
  .meta({
    title: "Message",
    description: "Project context or question submitted through the form.",
    examples: ["Share the context, the problem, and what good looks like."],
  });

export const contactSchema = z
  .object({
    name: contactNameSchema,
    email: contactEmailSchema,
    message: contactMessageSchema,
  })
  .meta({
    title: "Contact message",
    description: "Payload submitted by the public contact form.",
  });

export type ContactValues = z.infer<typeof contactSchema>;

export type ContactFieldError = {
  field: ContactField | "form";
  message: string;
};

export const contactFieldSchemas = {
  name: contactSchema.shape.name,
  email: contactSchema.shape.email,
  message: contactSchema.shape.message,
} as const;

export const getContactJsonSchema = () => z.toJSONSchema(contactSchema);

export const getContactValidationErrors = (
  error: z.ZodError<ContactValues>,
): ContactFieldError[] =>
  error.issues.map((issue) => {
    const field = issue.path[0];
    return {
      field:
        typeof field === "string" && isContactField(field) ? field : "form",
      message: issue.message,
    };
  });
