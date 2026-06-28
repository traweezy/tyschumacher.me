import type { ComponentPropsWithoutRef } from "react";
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";
import { primaryNav } from "@/data/navigation";
import { useUIStore } from "@/state/ui-store";
import { renderWithProviders } from "@/test-utils/render-with-providers";

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: ComponentPropsWithoutRef<"img">) => (
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
    this.callback(
      entries as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver,
    );
  }
}

const themeModeStorageKey = "tyschumacher.theme-mode";

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
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    MockIntersectionObserver.instances = [];
    useUIStore.setState({ isCommandOpen: false, isMobileNavOpen: false });
    document.documentElement.dataset.theme = "civic-light";
    document.documentElement.dataset.themeMode = "light";
    window.localStorage.clear();
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
    expect(
      screen.getByRole("link", { name: /Experience/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /portrait of tyler schumacher/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /show working mode/i }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByText(/Calm interfaces for live work/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/staff and principal roles/i),
    ).not.toBeInTheDocument();
  });

  test("toggles the Civic theme mode from the app bar", () => {
    renderWithProviders(<SiteHeader />);

    expect(
      screen.queryByRole("combobox", { name: /preview theme/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: /theme mode/i }),
    ).not.toBeInTheDocument();
    const darkModeToggles = screen.getAllByRole("button", {
      name: /switch to dark theme/i,
    });

    expect(darkModeToggles[0]).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "civic-light",
    );
    fireEvent.click(darkModeToggles[0]!);

    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "civic-dark",
    );
    expect(document.documentElement).toHaveAttribute("data-theme-mode", "dark");
    expect(window.localStorage.getItem(themeModeStorageKey)).toBe("dark");
    expect(
      screen.getAllByRole("button", { name: /switch to light theme/i })[0],
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("opens and hides the avatar working mode popover", () => {
    vi.useFakeTimers();
    renderWithProviders(<SiteHeader />);

    const trigger = screen.getByRole("button", {
      name: /show working mode/i,
    });
    const popover = document.getElementById("working-mode-popover");
    expect(popover).toBeInstanceOf(HTMLElement);

    const workingModePopover = popover as HTMLElement;
    let isOpen = false;
    const originalMatches = workingModePopover.matches.bind(workingModePopover);
    const showPopover = vi.fn(() => {
      isOpen = true;
      workingModePopover.dispatchEvent(new Event("toggle", { bubbles: true }));
    });
    const hidePopover = vi.fn(() => {
      isOpen = false;
      workingModePopover.dispatchEvent(new Event("toggle", { bubbles: true }));
    });

    vi.spyOn(workingModePopover, "matches").mockImplementation((selector) =>
      selector === ":popover-open" ? isOpen : originalMatches(selector),
    );
    Object.defineProperty(workingModePopover, "showPopover", {
      configurable: true,
      value: showPopover,
    });
    Object.defineProperty(workingModePopover, "hidePopover", {
      configurable: true,
      value: hidePopover,
    });

    fireEvent.pointerEnter(trigger);

    expect(showPopover).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.pointerLeave(trigger);
    act(() => {
      vi.advanceTimersByTime(160);
    });

    expect(hidePopover).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(showPopover).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  test("keeps avatar popover interactions inert without browser support", () => {
    renderWithProviders(<SiteHeader />);

    const trigger = screen.getByRole("button", {
      name: /show working mode/i,
    });

    fireEvent.click(trigger);
    fireEvent.pointerEnter(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("uses a stored theme mode before the system preference", async () => {
    window.localStorage.setItem(themeModeStorageKey, "dark");
    document.documentElement.dataset.theme = "civic-light";
    document.documentElement.dataset.themeMode = "light";

    renderWithProviders(<SiteHeader />);

    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute(
        "data-theme",
        "civic-dark",
      ),
    );
    expect(document.documentElement).toHaveAttribute("data-theme-mode", "dark");
    expect(
      screen.getAllByRole("button", { name: /switch to light theme/i })[0],
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("syncs theme state from external commands", async () => {
    renderWithProviders(<SiteHeader />);

    window.dispatchEvent(
      new CustomEvent("tyschumacher:theme-mode", {
        detail: { mode: "dark" },
      }),
    );

    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: /switch to light theme/i })[0],
      ).toHaveAttribute("aria-pressed", "true"),
    );
    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "civic-dark",
    );
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
      expect(screen.getByRole("link", { name: /Approach/i })).toHaveAttribute(
        "aria-current",
        "location",
      ),
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
      expect(screen.getByRole("link", { name: /Experience/i })).toHaveAttribute(
        "aria-current",
        "location",
      ),
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

    fireEvent.click(
      screen.getAllByRole("button", { name: /Open command palette/i })[0]!,
    );
    expect(await screen.findByText(/Quick actions/i)).toBeInTheDocument();
  });

  test("opens the mobile sheet with semantic copy and external links", async () => {
    renderWithProviders(<SiteHeader />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Open navigation/i }));
    });

    const dialog = await screen.findByRole("dialog", {
      name: /Site navigation/i,
    });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Site navigation/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Browse page sections, external profiles, and the resume download./i,
      ),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("navigation", { name: /Mobile navigation/i }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText(/Buffalo, NY/i)).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: /GitHub/i }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: /Resume/i }),
    ).toBeInTheDocument();
  });
});
