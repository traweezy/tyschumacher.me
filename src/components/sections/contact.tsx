import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/forms/contact-form";
export const ContactSection = () => (
  <Section
    id="contact"
    label="Contact"
    headline="Have a messy product or system problem?"
    caption="Send the context and what makes it hard. I’ll reply within two business days."
    contentClassName="contact-grid"
  >
    <ContactForm />
  </Section>
);
