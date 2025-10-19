"use client";

import { ArrowUp, Github, Linkedin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { secondaryNav } from "@/data/navigation";

const github = secondaryNav.find((item) => item.id === "github");
const linkedin = secondaryNav.find((item) => item.id === "linkedin");

export const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[var(--border)] bg-[var(--background)]/80 py-12 backdrop-blur"
      role="contentinfo"
    >
      <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 text-sm text-[var(--foreground)]/70">
          <span>© {year} Tyler Schumacher. All opinions are my own.</span>
          <span>Shipping delightful, resilient experiences from Buffalo, NY.</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {github ? (
            <Button asChild variant="ghost" size="icon" aria-label="GitHub">
              <a href={github.href} target="_blank" rel="noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          ) : null}
          {linkedin ? (
            <Button asChild variant="ghost" size="icon" aria-label="LinkedIn">
              <a href={linkedin.href} target="_blank" rel="noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          ) : null}
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href="#home" aria-label="Back to top">
              <ArrowUp className="h-4 w-4" />
              Back to top
            </a>
          </Button>
        </div>
      </Container>
    </footer>
  );
};
