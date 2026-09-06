import { NextResponse } from "next/server";
import type { ContactFieldError } from "@/lib/contact";
type ProblemOptions = {
  status: number;
  title: string;
  detail: string;
  requestId: string;
  errors?: ContactFieldError[];
  retryAfter?: number;
};
export const contactProblem = ({
  status,
  title,
  detail,
  requestId,
  errors,
  retryAfter,
}: ProblemOptions) =>
  NextResponse.json(
    {
      type: "about:blank",
      title,
      status,
      detail,
      instance: "/api/contact",
      requestId,
      message: detail,
      ...(errors ? { errors } : {}),
    },
    {
      status,
      headers: {
        "Content-Type": "application/problem+json",
        "Cache-Control": "no-store",
        "X-Request-ID": requestId,
        ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
      },
    },
  );
