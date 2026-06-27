import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getTelemetryConnectSource,
  type TelemetryEnvironment,
} from "@/lib/telemetry-config";

const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  let str = "";
  array.forEach((value) => {
    str += String.fromCharCode(value);
  });
  return btoa(str);
};

export const createContentSecurityPolicy = (
  nonce: string,
  env?: TelemetryEnvironment,
): string => {
  const connectSources = ["'self'"];
  const telemetryConnectSource = getTelemetryConnectSource(env);

  if (telemetryConnectSource) {
    connectSources.push(telemetryConnectSource);
  }

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-hashes' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk='",
    "img-src 'self' data:",
    "font-src 'self'",
    "object-src 'none'",
    `connect-src ${connectSources.join(" ")}`,
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
};

export function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const cspHeader = createContentSecurityPolicy(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-nextjs-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

export const config = {
  matcher: "/:path*",
};
