"use client";
import { memo, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
type ErrorProps = { error: Error & { digest?: string }; reset: () => void };
const ErrorPage = memo<ErrorProps>(({ error, reset }) => {
  useEffect(() => {
    console.error("page.render_failed", { digest: error.digest ?? "unknown" });
  }, [error]);
  return (
    <Container className="py-24">
      <h1 className="type-heading-2">Something interrupted the page.</h1>
      <p className="type-body mt-6">
        Please try again, or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          className="hero__cta hero__cta--primary"
          onClick={reset}
        >
          Try again
        </button>
        <Link href="/" className="hero__cta hero__cta--outline">
          Go home
        </Link>
      </div>
    </Container>
  );
});
ErrorPage.displayName = "ErrorPage";
export default ErrorPage;
