import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/forms/contact-form";
export const ContactSection = () => (
  <Section
    id="contact"
    label="Contact"
    headline="Need someone who can steady the product, the system, and the team?"
    caption="Send the context, the constraint, and what kind of help you need. I’ll reply within two business days."
    contentClassName="contact-grid"
  >
    <ContactForm />
  </Section>
);
