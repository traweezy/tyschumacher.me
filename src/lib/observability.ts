"use client";

import { trace, context, SpanStatusCode } from "@opentelemetry/api";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

let tracerInitialized = false;
const instrumentedElements = new WeakSet<Element>();

const attachClickInstrumentation = (): void => {
  const tracer = trace.getTracer("tyschumacher.me");

  const handleElement = (element: Element) => {
    if (!(element instanceof HTMLElement) || instrumentedElements.has(element)) {
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

  document.querySelectorAll('[data-observe-click]').forEach(handleElement);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }
        if (node.matches('[data-observe-click]')) {
          handleElement(node);
        }
        node.querySelectorAll?.('[data-observe-click]').forEach(handleElement);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

export const initObservability = (): void => {
  if (tracerInitialized || typeof window === "undefined") {
    return;
  }

  try {
    const provider = new WebTracerProvider();
    const exporterUrl = process.env.NEXT_PUBLIC_OTEL_EXPORT_URL;

    if (exporterUrl) {
      provider.addSpanProcessor(
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: exporterUrl,
          }),
        ),
      );
    } else {
      provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    }

    provider.register();
    tracerInitialized = true;

    attachClickInstrumentation();
  } catch (error) {
    console.error("Observability initialization failed", error);
  }
};
