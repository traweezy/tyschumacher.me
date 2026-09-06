# Contact API

`POST /api/contact` accepts `application/json` with `name`, `email`, and `message`; the Zod contract is in `src/lib/contact.ts`. Use a UUID `Idempotency-Key` header for a logical submission and reuse it when retrying that submission. Resend handles delivery idempotency; no local message database exists.

- Maximum body: 16,384 bytes, enforced against the actual stream and advertised size.
- Field limits are inclusive: names have 2 to 120 characters, email addresses have at most 254, and messages have 12 to 4,000. Validation messages use complete sentences and state these limits directly.
- Read deadline: 10 seconds. Resend request deadline: 10 seconds. Browser submit deadline: 15 seconds.
- Delivery budget: ten validated submissions per minute per running instance. A denied request receives `Retry-After` seconds.
- Supplied browser origins must match the request origin or the canonical portfolio origins. Requests without Origin are permitted for API clients; this is not an authentication control.
- User fields are validated and HTML-encoded. Logs contain an event code, request ID and delivery duration, not names, addresses, messages or provider error payloads.

| Status | Meaning                                                      |
| ------ | ------------------------------------------------------------ |
| 200    | Provider accepted delivery; `{ "message": "Message sent." }` |
| 400    | Invalid JSON, field validation or idempotency key            |
| 403    | Disallowed origin                                            |
| 408    | Request body read timeout                                    |
| 413    | Body too large                                               |
| 415    | Unsupported content type                                     |
| 429    | Delivery budget exhausted                                    |
| 502    | Provider failure or timeout                                  |
| 503    | Resend key unavailable                                       |

Errors use `application/problem+json` with `type`, `title`, `status`, `detail`, `instance`, and `requestId`. `message` remains for form compatibility; validation errors also contain `errors: [{ field, message }]`. Success and errors use `Cache-Control: no-store` and `X-Request-ID`.

## Operations

Provision `RESEND_API_KEY` and verify `noreply@tyschumacher.me` with Resend. Monitor `contact.delivery_failed` and `contact.delivery_unavailable`, grouped by request ID; alert on sustained failures or anomalous request volume. Keep logs under the hosting retention policy. Email retention is governed by the mailbox/provider configuration, not this app.

For multiple instances, configure an edge rate-limit policy on this route before relying on abuse protection. Avoid automatically retrying an ambiguous delivery with a new idempotency key. Tests mock the provider and browser submissions; they never send live mail.
