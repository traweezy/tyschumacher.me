import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type TestSpan = {
  end: ReturnType<typeof vi.fn>;
  setAttribute: ReturnType<typeof vi.fn>;
};

const otelMocks = vi.hoisted(() => {
  const register = vi.fn();

  return {
    activeContext: vi.fn(() => ({})),
    batchSpanProcessor: vi.fn(function BatchSpanProcessor(
      this: { exporter?: unknown },
      exporter: unknown,
    ) {
      this.exporter = exporter;
    }),
    consoleSpanExporter: vi.fn(function ConsoleSpanExporter() {}),
    contextWith: vi.fn((_context: unknown, callback: () => void) => {
      callback();
    }),
    getTracer: vi.fn(),
    otlpTraceExporter: vi.fn(function OTLPTraceExporter(
      this: { options?: unknown },
      options: unknown,
    ) {
      this.options = options;
    }),
    register,
    resourceFromAttributes: vi.fn((attributes: unknown) => attributes),
    simpleSpanProcessor: vi.fn(function SimpleSpanProcessor(
      this: { exporter?: unknown },
      exporter: unknown,
    ) {
      this.exporter = exporter;
    }),
    webTracerProvider: vi.fn(function WebTracerProvider(
      this: { config?: unknown; register?: () => void },
      config: unknown,
    ) {
      this.config = config;
      this.register = register;
    }),
  };
});

vi.mock("@opentelemetry/api", () => ({
  context: {
    active: otelMocks.activeContext,
    with: otelMocks.contextWith,
  },
  trace: {
    getTracer: otelMocks.getTracer,
  },
}));

vi.mock("@opentelemetry/exporter-trace-otlp-http", () => ({
  OTLPTraceExporter: otelMocks.otlpTraceExporter,
}));

vi.mock("@opentelemetry/resources", () => ({
  resourceFromAttributes: otelMocks.resourceFromAttributes,
}));

vi.mock("@opentelemetry/sdk-trace-base", () => ({
  BatchSpanProcessor: otelMocks.batchSpanProcessor,
  ConsoleSpanExporter: otelMocks.consoleSpanExporter,
  SimpleSpanProcessor: otelMocks.simpleSpanProcessor,
}));

vi.mock("@opentelemetry/sdk-trace-web", () => ({
  WebTracerProvider: otelMocks.webTracerProvider,
}));

const originalGlobalMutationObserver = globalThis.MutationObserver;
const originalWindowMutationObserver = window.MutationObserver;

class TestMutationObserver {
  disconnect() {}
  observe() {}
  takeRecords(): MutationRecord[] {
    return [];
  }
}

const importObservability = async () => import("@/lib/observability");

const mockTracer = () => {
  const span: TestSpan = {
    end: vi.fn(),
    setAttribute: vi.fn(),
  };
  const startActiveSpan = vi.fn(
    (_name: string, callback: (currentSpan: TestSpan) => void) => {
      callback(span);
    },
  );

  otelMocks.getTracer.mockReturnValue({ startActiveSpan });

  return { span, startActiveSpan };
};

describe("observability", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    document.body.innerHTML = "";
    Object.defineProperty(window, "MutationObserver", {
      configurable: true,
      value: TestMutationObserver,
      writable: true,
    });
    Object.defineProperty(globalThis, "MutationObserver", {
      configurable: true,
      value: TestMutationObserver,
      writable: true,
    });
    mockTracer();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    document.body.innerHTML = "";
    Object.defineProperty(window, "MutationObserver", {
      configurable: true,
      value: originalWindowMutationObserver,
      writable: true,
    });
    Object.defineProperty(globalThis, "MutationObserver", {
      configurable: true,
      value: originalGlobalMutationObserver,
      writable: true,
    });
  });

  it("skips real span processors in the Vitest environment", async () => {
    const { initObservability } = await importObservability();

    initObservability();

    expect(otelMocks.webTracerProvider).not.toHaveBeenCalled();
    expect(otelMocks.batchSpanProcessor).not.toHaveBeenCalled();
    expect(otelMocks.simpleSpanProcessor).not.toHaveBeenCalled();
  });

  it("configures an OTLP exporter when an endpoint is available", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv(
      "NEXT_PUBLIC_OTEL_EXPORT_URL",
      "https://otel.example.com/v1/traces",
    );
    const { initObservability } = await importObservability();

    initObservability();

    expect(otelMocks.otlpTraceExporter).toHaveBeenCalledWith({
      url: "https://otel.example.com/v1/traces",
    });
    expect(otelMocks.batchSpanProcessor).toHaveBeenCalledTimes(1);
    expect(otelMocks.webTracerProvider).toHaveBeenCalledTimes(1);
    expect(otelMocks.register).toHaveBeenCalledTimes(1);
  });

  it("uses the console exporter for non-production local tracing", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { span, startActiveSpan } = mockTracer();
    const button = document.createElement("button");
    button.dataset.observeClick = "contact-submit";
    document.body.append(button);
    const { initObservability } = await importObservability();

    initObservability();
    button.click();

    expect(otelMocks.consoleSpanExporter).toHaveBeenCalledTimes(1);
    expect(otelMocks.simpleSpanProcessor).toHaveBeenCalledTimes(1);
    expect(startActiveSpan).toHaveBeenCalledWith(
      "contact-submit",
      expect.any(Function),
    );
    expect(span.setAttribute).toHaveBeenCalledWith("component", "ui");
    expect(span.setAttribute).toHaveBeenCalledWith("target", "contact-submit");
    expect(span.end).toHaveBeenCalledTimes(1);
  });

  it("leaves production telemetry disabled without an endpoint", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { initObservability } = await importObservability();

    initObservability();

    expect(otelMocks.webTracerProvider).not.toHaveBeenCalled();
    expect(otelMocks.batchSpanProcessor).not.toHaveBeenCalled();
    expect(otelMocks.simpleSpanProcessor).not.toHaveBeenCalled();
  });

  it("initializes only once per module instance", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { initObservability } = await importObservability();

    initObservability();
    initObservability();

    expect(otelMocks.webTracerProvider).toHaveBeenCalledTimes(1);
    expect(otelMocks.register).toHaveBeenCalledTimes(1);
  });

  it("reports initialization failures without throwing", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const error = new Error("provider failed");
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    otelMocks.webTracerProvider.mockImplementationOnce(
      function WebTracerProvider() {
        throw error;
      },
    );
    const { initObservability } = await importObservability();

    initObservability();

    expect(consoleError).toHaveBeenCalledWith(
      "Observability initialization failed",
      error,
    );

    consoleError.mockRestore();
  });
});
