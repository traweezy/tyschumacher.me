"use client";

import { trace, context } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  type SpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import {
  getTelemetryExportUrl,
  getTelemetryMode,
} from "@/lib/telemetry-config";

let tracerInitialized = false;
const instrumentedElements = new WeakSet<Element>();

const attachClickInstrumentation = (): void => {
  const tracer = trace.getTracer("tyschumacher.me");

  const handleElement = (element: Element) => {
    if (
      !(element instanceof HTMLElement) ||
      instrumentedElements.has(element)
    ) {
      return;
    }
    const spanName = element.dataset.observeClick ?? "interaction";
    element.addEventListener("click", () => {
      context.with(context.active(), () => {
        tracer.startActiveSpan(spanName, (span) => {
          span.setAttribute("component", "ui");
          span.setAttribute("target", spanName);
          span.end();
        });
      });
    });
    instrumentedElements.add(element);
  };

  document.querySelectorAll("[data-observe-click]").forEach(handleElement);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }
        if (node.matches("[data-observe-click]")) {
          handleElement(node);
        }
        node.querySelectorAll?.("[data-observe-click]").forEach(handleElement);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

const createSpanProcessor = (): SpanProcessor | null => {
  if (process.env.NODE_ENV === "test") {
    return null;
  }

  const exporterUrl = getTelemetryExportUrl();

  if (exporterUrl) {
    return new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: exporterUrl,
      }),
    );
  }

  if (getTelemetryMode() === "console") {
    return new SimpleSpanProcessor(new ConsoleSpanExporter());
  }

  return null;
};

export const initObservability = (): void => {
  if (tracerInitialized || typeof window === "undefined") {
    return;
  }

  try {
    const spanProcessor = createSpanProcessor();

    if (!spanProcessor) {
      tracerInitialized = true;
      return;
    }

    const provider = new WebTracerProvider({
      resource: resourceFromAttributes({
        "deployment.environment.name": process.env.NODE_ENV ?? "development",
        "service.name": "tyschumacher.me",
        "service.namespace": "portfolio",
      }),
      spanProcessors: [spanProcessor],
    });

    provider.register();
    tracerInitialized = true;

    attachClickInstrumentation();
  } catch (error) {
    console.error("Observability initialization failed", error);
  }
};
