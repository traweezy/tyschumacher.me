import { renderWithProviders } from "@/test-utils/render-with-providers";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/forms/contact-form";

const createFetchMock = (response: Partial<Response> & { json?: () => Promise<unknown> }) =>
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
    ...response,
  });

describe("ContactForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows validation errors when submitting empty form", async () => {
    renderWithProviders(<ContactForm />);
    const submitButton = screen.getByRole("button", { name: /send message/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/Tell me your name/i)).toBeInTheDocument();
    expect(screen.getByText(/Use a valid email/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Add more context so I can help/i),
    ).toBeInTheDocument();
  });

  it("submits successfully when data is valid", async () => {
    const fetchMock = createFetchMock({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<ContactForm />);

    await userEvent.type(screen.getByLabelText(/Name/i), "Philip J Fry");
    await userEvent.type(screen.getByLabelText(/Email/i), "fry@planetexpress.com");
    await userEvent.type(
      screen.getByLabelText(/How can I help/i),
      "Deliver a package to Luna Park",
    );

    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(
      await screen.findByText(/Thanks! I’ll reach out within two business days./i),
    ).toBeInTheDocument();
  });

  it("surfaces field errors returned by the server", async () => {
    const fetchMock = createFetchMock({
      ok: false,
      json: async () => ({
        message: "Some personal delivery error",
        errors: [
          {
            field: "email",
            message: "Zap! That address bounced",
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<ContactForm />);

    await userEvent.type(screen.getByLabelText(/Name/i), "Philip J Fry");
    await userEvent.type(
      screen.getByLabelText(/Email/i),
      "bender@planetexpress.com",
    );
    await userEvent.type(
      screen.getByLabelText(/How can I help/i),
      "Deliver a package to the Slurm factory",
    );

    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(
      await screen.findByText(/Zap! That address bounced/i),
    ).toBeInTheDocument();
  });
});
