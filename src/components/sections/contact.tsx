import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/forms/contact-form";
export const ContactSection = () => (
  <Section
    id="contact"
    label="Contact"
    headline="Have a product or platform problem worth untangling?"
    caption="Send the context, the constraints, and what would make it successful. I’ll reply within two business days."
    contentClassName="contact-grid"
  >
    <ContactForm />
  </Section>
);
