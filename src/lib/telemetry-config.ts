export type TelemetryEnvironment = {
  NEXT_PUBLIC_OTEL_EXPORT_URL?: string;
  NODE_ENV?: string;
};

export type TelemetryMode = "console" | "disabled" | "otlp";

const getEnvironment = (): TelemetryEnvironment => ({
  NEXT_PUBLIC_OTEL_EXPORT_URL: process.env.NEXT_PUBLIC_OTEL_EXPORT_URL ?? "",
  NODE_ENV: process.env.NODE_ENV ?? "development",
});

const isHttpUrl = (url: URL): boolean =>
  url.protocol === "http:" || url.protocol === "https:";

export const getTelemetryExportUrl = (
  env: TelemetryEnvironment = getEnvironment(),
): string | null => {
  const value = env.NEXT_PUBLIC_OTEL_EXPORT_URL?.trim();

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return isHttpUrl(url) &&
      !url.username &&
      !url.password &&
      (env.NODE_ENV !== "production" || url.protocol === "https:")
      ? url.toString()
      : null;
  } catch {
    return null;
  }
};

export const getTelemetryConnectSource = (
  env: TelemetryEnvironment = getEnvironment(),
): string | null => {
  const exportUrl = getTelemetryExportUrl(env);

  if (!exportUrl) {
    return null;
  }

  return new URL(exportUrl).origin;
};

export const getTelemetryMode = (
  env: TelemetryEnvironment = getEnvironment(),
): TelemetryMode => {
  if (getTelemetryExportUrl(env)) {
    return "otlp";
  }

  return env.NODE_ENV === "production" ? "disabled" : "console";
};
