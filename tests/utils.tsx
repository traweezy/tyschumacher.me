import React from "react";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Providers } from "@/app/providers";

export const renderWithProviders = (ui: ReactElement) =>
  render(<Providers>{ui}</Providers>);
