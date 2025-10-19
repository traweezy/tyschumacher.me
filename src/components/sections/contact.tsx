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
    <div className="contact-form-with-note">
      <ContactForm />
      <p className="contact-note type-body-sm measure-short">
        Or reach me directly at <a href="mailto:tyschumacher@proton.me">tyschumacher@proton.me</a>.
      </p>
    </div>
  </Section>
);
