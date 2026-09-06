"use client";

import { ArrowUp, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { secondaryNav } from "@/data/navigation";
import { newTabLinkProps } from "@/lib/link-behavior";

const github = secondaryNav.find((item) => item.id === "github");
const linkedin = secondaryNav.find((item) => item.id === "linkedin");

export const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[var(--border)] bg-[var(--surface-0)] py-12 backdrop-blur"
      role="contentinfo"
    >
      <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
          <span>© {year} Tyler Schumacher. All opinions are my own.</span>
          <span>
            Buffalo-based product engineering for web tools and platforms.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {github ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2"
              aria-label="GitHub"
            >
              <a href={github.href} {...newTabLinkProps}>
                <GitHubIcon className="h-4 w-4" aria-hidden="true" /> GitHub
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Button>
          ) : null}
          {linkedin ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2"
              aria-label="LinkedIn"
            >
              <a href={linkedin.href} {...newTabLinkProps}>
                <LinkedInIcon className="h-4 w-4" aria-hidden="true" /> LinkedIn
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Button>
          ) : null}
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href="#home" aria-label="Back to top">
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              Back to top
            </a>
          </Button>
        </div>
      </Container>
    </footer>
  );
};
