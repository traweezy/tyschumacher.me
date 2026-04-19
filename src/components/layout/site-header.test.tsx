import type { ComponentPropsWithoutRef } from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";
import { primaryNav } from "@/data/navigation";
import { useUIStore } from "@/state/ui-store";
import { renderWithProviders } from "@/test-utils/render-with-providers";

vi.mock("next/image", () => ({
  default: ({
    alt,
    ...props
  }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}));

type MockIntersectionEntry = Pick<
  IntersectionObserverEntry,
  "boundingClientRect" | "intersectionRatio" | "isIntersecting" | "target"
>;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  callback: IntersectionObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  trigger(entries: MockIntersectionEntry[]) {
    this.callback(entries as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
  }
}

const renderHeaderWithSections = () =>
  renderWithProviders(
    <>
      <SiteHeader />
      {primaryNav.map((item) => (
        <section key={item.id} id={item.id}>
          {item.title}
        </section>
      ))}
    </>,
  );

describe("SiteHeader", () => {
  const originalCSS = globalThis.CSS;

  beforeEach(() => {
    Object.defineProperty(globalThis, "IntersectionObserver", {
      configurable: true,
      writable: true,
      value: MockIntersectionObserver,
    });
    Object.defineProperty(globalThis, "CSS", {
      configurable: true,
      writable: true,
      value: { supports: vi.fn(() => true) },
    });
  });

  afterEach(() => {
    MockIntersectionObserver.instances = [];
    useUIStore.setState({ isCommandOpen: false, isMobileNavOpen: false });
    window.history.replaceState({}, "", "/");
    Object.defineProperty(globalThis, "CSS", {
      configurable: true,
      writable: true,
      value: originalCSS,
    });
  });

  test("renders primary navigation landmarks", () => {
    renderWithProviders(<SiteHeader />);
    const navigation = screen.getByRole("navigation", { name: /primary/i });
    expect(navigation).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Experience/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /portrait of tyler schumacher/i })).toBeInTheDocument();
  });

  test("opens command palette via keyboard shortcut", async () => {
    renderWithProviders(<SiteHeader />);
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(await screen.findByText(/Quick actions/i)).toBeInTheDocument();
  });

  test("tracks the active section from hash changes and intersections", async () => {
    window.history.replaceState({}, "", "/#about");
    renderHeaderWithSections();

    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Approach/i })).toHaveAttribute("aria-current", "location"),
    );

    const observer = MockIntersectionObserver.instances[0];
    expect(observer).toBeDefined();
    observer?.trigger([
      {
        target: document.getElementById("about")!,
        isIntersecting: true,
        intersectionRatio: 0.3,
        boundingClientRect: { top: 220 } as DOMRectReadOnly,
      },
      {
        target: document.getElementById("experience")!,
        isIntersecting: true,
        intersectionRatio: 0.72,
        boundingClientRect: { top: 140 } as DOMRectReadOnly,
      },
    ]);

    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Experience/i })).toHaveAttribute("aria-current", "location"),
    );
  });

  test("updates the scroll fallback and opens the command palette from the button", async () => {
    Object.defineProperty(globalThis, "CSS", {
      configurable: true,
      writable: true,
      value: { supports: vi.fn(() => false) },
    });

    renderHeaderWithSections();

    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    expect(progress?.style.getPropertyValue("--progress-scale")).toBe("0");

    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 1800,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 900,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 180,
    });

    fireEvent.scroll(window);

    expect(progress?.style.getPropertyValue("--progress-scale")).toBe("0.2");
    expect(screen.getByRole("banner")).toHaveClass("site-header--condensed");

    fireEvent.click(screen.getAllByRole("button", { name: /Open command palette/i })[0]!);
    expect(await screen.findByText(/Quick actions/i)).toBeInTheDocument();
  });

  test("opens the mobile sheet with semantic copy and external links", async () => {
    renderWithProviders(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: /Open navigation/i }));

    expect(await screen.findByRole("dialog", { name: /Site navigation/i })).toBeInTheDocument();
    expect(screen.getByText(/Site navigation/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Browse page sections, external profiles, and the resume download./i),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /Mobile navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Resume/i })).toBeInTheDocument();
  });
});
