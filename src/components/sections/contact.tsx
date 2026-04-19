import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/forms/contact-form";
export const ContactSection = () => (
  <Section
    id="contact"
    label="Contact"
    headline="Need a product engineer who can work across interface, systems, and delivery?"
    caption="Send the team context, the problem, and what kind of help you need. I’ll reply within two business days."
    contentClassName="contact-grid"
  >
    <ContactForm />
  </Section>
);
