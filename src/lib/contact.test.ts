import { describe, expect, it } from "vitest";
import {
  contactFieldSchemas,
  contactSchema,
  getContactJsonSchema,
} from "@/lib/contact";

describe("contact schema", () => {
  it("keeps documentation metadata on the Zod schemas", () => {
    expect(contactSchema.meta()).toMatchObject({
      title: "Contact message",
      description: "Payload submitted by the public contact form.",
    });
    expect(contactFieldSchemas.name.meta()).toMatchObject({
      title: "Name",
      description: "Single-line sender name for the contact request.",
      examples: ["Jordan Lee"],
    });
    expect(contactFieldSchemas.email.meta()).toMatchObject({
      title: "Email address",
      examples: ["jordan@company.com"],
    });
    expect(contactFieldSchemas.message.meta()).toMatchObject({
      title: "Message",
      examples: [
        "Share the context, the constraint, and what good looks like.",
      ],
    });
  });

  it("exports JSON Schema with shared validation constraints", () => {
    expect(getContactJsonSchema()).toMatchObject({
      title: "Contact message",
      description: "Payload submitted by the public contact form.",
      type: "object",
      required: ["name", "email", "message"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          title: "Name",
          minLength: 2,
          maxLength: 120,
        },
        email: {
          type: "string",
          title: "Email address",
          format: "email",
          maxLength: 254,
        },
        message: {
          type: "string",
          title: "Message",
          minLength: 12,
          maxLength: 4000,
        },
      },
    });
  });
});
