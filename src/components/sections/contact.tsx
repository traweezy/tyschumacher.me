import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/forms/contact-form";
export const ContactSection = () => (
  <Section
    id="contact"
    label="Contact"
    headline="Let’s build resilient, human centered products together"
    caption="Drop a note about your team, stakeholders, and timeline. I’ll respond within two business days."
    contentClassName="contact-grid"
  >
    <ContactForm />
  </Section>
);
