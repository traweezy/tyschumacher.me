import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SITE_URL } from "@/lib/site";
import ErrorPage from "./error";
import manifest from "./manifest";
import NotFound from "./not-found";
import robots from "./robots";
import sitemap from "./sitemap";

describe("web essentials", () => {
  it("advertises one canonical homepage and a fetchable sitemap", () => {
    expect(robots()).toMatchObject({
      host: SITE_URL,
      sitemap: `${SITE_URL}/sitemap.xml`,
    });
    expect(sitemap()).toEqual([
      { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    ]);
    expect(manifest().icons).toHaveLength(2);
  });
  it("offers recovery from missing and failed pages", () => {
    const view = render(<NotFound />);
    expect(screen.getByRole("link", { name: "Explore projects" })).toHaveAttribute(
      "href",
      "/#projects",
    );
    view.unmount();
    const reset = vi.fn();
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<ErrorPage error={new Error("private details")} reset={reset} />);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledWith("page.render_failed", {
      digest: "unknown",
    });
    expect(screen.queryByText("private details")).not.toBeInTheDocument();
    log.mockRestore();
  });
});
