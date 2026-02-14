import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("SiteFooter branch behavior", () => {
  afterEach(() => {
    vi.doUnmock("@/data/navigation");
    vi.resetModules();
  });

  it("omits social links when nav config does not include them", async () => {
    vi.doMock("@/data/navigation", () => ({
      secondaryNav: [
        { id: "resume", title: "Resume", href: "/tyler-schumacher-resume.pdf" },
      ],
    }));

    const { SiteFooter } = await import("./site-footer");
    render(<SiteFooter />);

    expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "LinkedIn" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to top/i })).toBeInTheDocument();
  });
});
