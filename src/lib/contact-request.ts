const MAX_BODY_BYTES = 16_384;
const READ_TIMEOUT_MS = 10_000;
type BodyResult = { ok: true; value: unknown } | { ok: false; status: 400 | 408 | 413 };
export const readContactBody = async (request: Request): Promise<BodyResult> => {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    return { ok: false, status: 413 };
  const reader = request.body?.getReader();
  if (!reader) return { ok: false, status: 400 };
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => undefined);
  }, READ_TIMEOUT_MS);
  try {
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const result = await reader.read();
      if (timedOut) return { ok: false, status: 408 };
      if (result.done) break;
      length += result.value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        return { ok: false, status: 413 };
      }
      chunks.push(result.value);
    }
    const body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return {
      ok: true,
      value: JSON.parse(new TextDecoder().decode(body)) as unknown,
    };
  } catch {
    return { ok: false, status: 400 };
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
};

// A bounded per-instance delivery budget; deployed edge rate limits complement it.
// No addresses, IPs, or message contents are retained in the limiter.
export const createDeliveryBudget = (
  now: () => number,
  limit = 10,
  windowMs = 60_000,
) => {
  let windowStart = now();
  let count = 0;
  return (): number => {
    const current = now();
    if (current - windowStart >= windowMs) {
      windowStart = current;
      count = 0;
    }
    if (count >= limit)
      return Math.max(1, Math.ceil((windowMs - (current - windowStart)) / 1000));
    count += 1;
    return 0;
  };
};
