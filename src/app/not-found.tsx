import Link from "next/link";
import { Container } from "@/components/layout/container";
const NotFound = () => (
  <Container className="py-24">
    <p className="type-eyebrow">404 · Page not found</p>
    <h1 className="type-heading-2 mt-4">Let’s get you back to the work.</h1>
    <p className="type-body mt-6 max-w-prose">
      This page may have moved. You can explore my projects, review my
      experience, or get in touch from the homepage.
    </p>
    <Link href="/#projects" className="hero__cta hero__cta--primary mt-8">
      Explore projects
    </Link>
  </Container>
);
export default NotFound;
