"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
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

const DIRECT_EMAIL = "tyschumacher@proton.me";

export const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const contactMutation = useMutation({
    mutationFn: async (values: ContactValues) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(
          data?.message ??
            `We couldn’t send your message right now. Please email ${DIRECT_EMAIL} instead.`,
        );
      }
    },
    onSuccess: (_data, _variables, context) => {
      context?.reset?.();
      setStatus("success");
    },
    onError: (error: unknown) => {
      console.error("Contact form submission failed", error);
      setStatus("error");
      const message =
        error instanceof Error
          ? error.message
          : `We couldn’t send your message. Please email ${DIRECT_EMAIL} instead.`;
      setErrorMessage(message);
    },
  });

  const form = useForm<ContactValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const parsed = contactSchema.safeParse(value);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => formApi.setFieldMeta(issue.path[0] as keyof ContactValues, (meta) => ({
          ...meta,
          errors: [issue.message],
        })));
        return;
      }
      setStatus("pending");
      setErrorMessage(null);
      contactMutation.mutate(parsed.data, {
        onSuccess: () => {
          formApi.reset();
        },
        context: { reset: formApi.reset },
      });
    },
  });

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
        <form.Field name="name">
          {(field) => (
            <label className={styles.field}>
              <span>Name</span>
              <input
                type="text"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby="contact-name-error"
                placeholder="Leslie Knope"
              />
              <span id="contact-name-error" className={styles.error}>
                {field.state.meta.errors[0]}
              </span>
            </label>
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby="contact-email-error"
                placeholder="hello@example.com"
              />
              <span id="contact-email-error" className={styles.error}>
                {field.state.meta.errors[0]}
              </span>
            </label>
          )}
        </form.Field>
      </div>
      <form.Field name="message">
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
      <Button type="submit" size="lg" disabled={status === "pending"}>
        {status === "pending" ? "Sending…" : "Send message"}
      </Button>
      <p role="status" aria-live="polite" className={styles.status}>
        {status === "success"
          ? "Thanks! I’ll reach out within two business days."
          : status === "error" && errorMessage
            ? errorMessage
            : `Prefer email? ${DIRECT_EMAIL}—include context and I’ll respond quickly.`}
      </p>
    </form>
  );
};
