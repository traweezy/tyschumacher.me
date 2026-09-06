import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/forms/contact-form";
export const ContactSection = () => (
  <Section
    id="contact"
    label="Contact"
    headline="Let’s talk about your team."
    caption="Hiring for a role or planning a project? Share what you’re building and where I could help."
    contentClassName="contact-grid"
  >
    <ContactForm />
  </Section>
);
