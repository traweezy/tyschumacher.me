"use client";

import { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  contactFieldSchemas,
  contactSchema,
  isContactField,
  type ContactValues,
} from "@/lib/contact";
import styles from "./contact-form.module.css";

const FALLBACK_ERROR_MESSAGE =
  "We couldn’t send your message right now. Please try again later.";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "";
};

export const ContactForm = () => {
  const contactMutation = useMutation<void, Error, ContactValues>({
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
                  typeof error?.field === "string" &&
                  typeof error?.message === "string",
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

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    } satisfies ContactValues,
    validators: {
      onSubmit: contactSchema,
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
            if (!isContactField(field)) return;
            formApi.setFieldMeta(field, (meta) => ({
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
    return null;
  }, [
    contactMutation.error,
    contactMutation.isError,
    contactMutation.isSuccess,
  ]);

  const textInputs = [
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      placeholder: "Jordan Lee",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "jordan@company.com",
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
            validators={{ onBlur: contactFieldSchemas[fieldConfig.name] }}
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
                <span
                  id={`contact-${fieldConfig.name}-error`}
                  className={styles.error}
                >
                  {getErrorMessage(field.state.meta.errors[0])}
                </span>
              </label>
            )}
          </form.Field>
        ))}
      </div>
      <form.Field
        name="message"
        validators={{ onBlur: contactFieldSchemas.message }}
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
              placeholder="Share the context, the problem, and what good looks like."
            />
            <span id="contact-message-error" className={styles.error}>
              {getErrorMessage(field.state.meta.errors[0])}
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
