import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/forms/contact-form";
export const ContactSection = () => (
  <Section
    id="contact"
    label="Contact"
    headline="Need an engineer who can steady the work?"
    caption="Send the context and the constraint. I’ll reply within two business days."
    contentClassName="contact-grid"
  >
    <ContactForm />
  </Section>
);
