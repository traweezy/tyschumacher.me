import { z } from "zod";

export const CONTACT_FIELDS = ["name", "email", "message"] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];

export const isContactField = (field: string): field is ContactField =>
  CONTACT_FIELDS.includes(field as ContactField);

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tell me your name")
    .max(120, "Keep your name under 120 characters")
    .refine((value) => !/[\r\n]/.test(value), "Use a single-line name"),
  email: z
    .string()
    .trim()
    .email("Use a valid email")
    .max(254, "Keep your email under 254 characters"),
  message: z
    .string()
    .trim()
    .min(12, "Add more context so I can help")
    .max(4000, "Keep your message under 4000 characters"),
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
