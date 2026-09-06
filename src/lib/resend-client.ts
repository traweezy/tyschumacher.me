import { Resend } from "resend";
import type { Response as ResendResponse } from "resend";

// The SDK's public request hook is the cancellation boundary; send() only
// exposes email-specific options. Keep the timeout on the actual HTTP request.
export class ContactEmailClient extends Resend {
  override fetchRequest<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<ResendResponse<T>> {
    const timeout = AbortSignal.timeout(10_000);
    return super.fetchRequest<T>(path, {
      ...options,
      signal: options.signal
        ? AbortSignal.any([options.signal, timeout])
        : timeout,
    });
  }
}
