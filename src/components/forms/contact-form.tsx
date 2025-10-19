"use client";

import { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import styles from "./contact-form.module.css";

const contactSchema = z.object({
  name: z.string().min(2, "Tell me your name"),
  email: z.string().email("Use a valid email"),
  message: z.string().min(12, "Add more context so I can help"),
});

type ContactValues = z.infer<typeof contactSchema>;
const FORM_FIELDS = ["name", "email", "message"] as const;
type ContactField = (typeof FORM_FIELDS)[number];

class ContactSubmissionError extends Error {
  constructor(
    message: string,
    public fieldErrors?: Array<{ field: ContactField | "form"; message: string }>,
  ) {
    super(message);
    this.name = "ContactSubmissionError";
  }
}

const DIRECT_EMAIL = "tyschumacher@proton.me";

export const ContactForm = () => {
  const contactMutation = useMutation<void, Error | ContactSubmissionError, ContactValues>({
    mutationFn: async (values: ContactValues) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          message?: string;
          errors?: Array<{ field?: string; message?: string }>;
        };

        const fieldErrors = Array.isArray(data?.errors)
          ? data.errors
              .filter(
                (error): error is { field: string; message: string } =>
                  typeof error?.field === "string" && typeof error?.message === "string",
              )
              .map((error) => ({
                field: FORM_FIELDS.includes(error.field as ContactField)
                  ? (error.field as ContactField)
                  : ("form" as const),
                message: error.message,
              }))
          : undefined;

        throw new ContactSubmissionError(
          data?.message ??
            `We couldn’t send your message right now. Please email ${DIRECT_EMAIL} instead.`,
          fieldErrors,
        );
      }
    },
    onError: (error) => {
      console.error("Contact form submission failed", error);
    },
  });

  const form = useForm<ContactValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: contactSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      FORM_FIELDS.forEach((field) =>
        formApi.setFieldMeta(field, (meta) => ({
          ...meta,
          errors: [],
        })),
      );
      try {
        await contactMutation.mutateAsync(value);
      } catch (error) {
        if (error instanceof ContactSubmissionError) {
          error.fieldErrors?.forEach(({ field, message }) => {
            if (field === "form") {
              return;
            }
            formApi.setFieldMeta(field, (meta) => ({
              ...meta,
              errors: [message],
            }));
          });
        } else {
          console.error("Unexpected contact form error", error);
        }
        return;
      }
      formApi.reset();
    },
  });

  const statusMessage = useMemo(() => {
    if (contactMutation.isSuccess) {
      return "Thanks! I’ll reach out within two business days.";
    }
    if (contactMutation.isError) {
      const message =
        contactMutation.error instanceof Error
          ? contactMutation.error.message
          : `We couldn’t send your message. Please email ${DIRECT_EMAIL} instead.`;
      return message;
    }
    return `Prefer email? ${DIRECT_EMAIL}—include context and I’ll respond quickly.`;
  }, [contactMutation.error, contactMutation.isError, contactMutation.isSuccess]);

  const textInputs = [
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      placeholder: "Leslie Knope",
      autoComplete: "name",
      validator: contactSchema.shape.name,
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "ty.schumacher@example.com",
      autoComplete: "email",
      validator: contactSchema.shape.email,
    },
  ] satisfies Array<{
    name: keyof ContactValues;
    label: string;
    type: "text" | "email";
    placeholder: string;
    autoComplete: string;
    validator: z.ZodTypeAny;
  }>;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className={styles.form}
      noValidate
    >
      <div className={styles.row}>
        {textInputs.map((fieldConfig) => (
          <form.Field
            key={fieldConfig.name}
            name={fieldConfig.name}
            validators={{ onBlur: fieldConfig.validator }}
          >
            {(field) => (
              <label className={styles.field}>
                <span>{fieldConfig.label}</span>
                <input
                  type={fieldConfig.type}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={`contact-${fieldConfig.name}-error`}
                  placeholder={fieldConfig.placeholder}
                  autoComplete={fieldConfig.autoComplete}
                />
                <span id={`contact-${fieldConfig.name}-error`} className={styles.error}>
                  {field.state.meta.errors[0]}
                </span>
              </label>
            )}
          </form.Field>
        ))}
      </div>
      <form.Field
        name="message"
        validators={{ onBlur: contactSchema.shape.message }}
      >
        {(field) => (
          <label className={styles.field}>
            <span>How can I help?</span>
            <textarea
              rows={5}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby="contact-message-error"
              placeholder="Share a bit about your project, stakeholders, and timeline."
            />
            <span id="contact-message-error" className={styles.error}>
              {field.state.meta.errors[0]}
            </span>
          </label>
        )}
      </form.Field>
      <Button type="submit" size="lg" disabled={contactMutation.isPending}>
        {contactMutation.isPending ? "Sending…" : "Send message"}
      </Button>
      <p role="status" aria-live="polite" className={styles.status}>
        {statusMessage}
      </p>
    </form>
  );
};
