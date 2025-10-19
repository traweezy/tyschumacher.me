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

const FALLBACK_ERROR_MESSAGE =
  "We couldn’t send your message right now. Please try again later.";

export const ContactForm = () => {
  const contactMutation = useMutation<void, Error, ContactValues>({
    mutationFn: async (values: ContactValues) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string; errors?: Array<{ field?: string; message?: string }> };

        const fieldErrors = Array.isArray(data?.errors)
          ? data.errors
              .filter(
                (error): error is { field: string; message: string } =>
                  typeof error?.field === "string" && typeof error?.message === "string",
              )
              .map((error) => ({
                field: error.field,
                message: error.message,
              }))
          : undefined;

        const errorMessage = data?.message ?? FALLBACK_ERROR_MESSAGE;

        const error = new Error(errorMessage) as Error & {
          fieldErrors?: Array<{ field: string; message: string }>;
        };
        if (fieldErrors) {
          error.fieldErrors = fieldErrors;
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error("Contact form submission failed", error);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<ContactValues, any>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validatorAdapter: zodValidator() as any,
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: contactSchema as any,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await contactMutation.mutateAsync(value);
      } catch (error) {
        const typedError = error as Error & {
          fieldErrors?: Array<{ field: string; message: string }>;
        };
        const fieldErrors = typedError.fieldErrors;
        if (fieldErrors) {
          fieldErrors.forEach(({ field, message }) => {
            if (!FORM_FIELDS.includes(field as ContactField)) return;
            formApi.setFieldMeta(field as ContactField, (meta) => ({
              ...meta,
              isTouched: true,
              errorMap: {
                ...meta.errorMap,
                onSubmit: message,
              },
              errors: [message],
            }));
          });
        }
        if (!fieldErrors?.length) {
          formApi.setFieldMeta("message", (meta) => ({
            ...meta,
            errors: [typedError.message],
          }));
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
          : FALLBACK_ERROR_MESSAGE;
      return message;
    }
    return "I reply to every message within two business days.";
  }, [contactMutation.error, contactMutation.isError, contactMutation.isSuccess]);

  const textInputs = [
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      placeholder: "Philip J Fry",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "bender@planetexpress.com",
      autoComplete: "email",
    },
  ] satisfies Array<{
    name: keyof ContactValues;
    label: string;
    type: "text" | "email";
    placeholder: string;
    autoComplete: string;
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            validators={{ onBlur: contactSchema.shape[fieldConfig.name] as any }}
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validators={{ onBlur: contactSchema.shape.message as any }}
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
              placeholder="Tell me what you need and why it matters to the crew"
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
