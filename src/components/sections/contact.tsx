import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/forms/contact-form";

export const ContactSection = () => (
  <Section
    id="contact"
    label="Contact"
    headline="Let’s build resilient, human-centered products together"
    caption="Drop a note about your team, stakeholders, and timeline. I’ll respond within two business days."
    contentClassName="contact-grid"
  >
    <ContactForm />
    <div className="contact-info">
      <h3 className="contact-info__title">What to expect</h3>
      <ul>
        <li>No spam—just a thoughtful reply with next steps.</li>
        <li>Happy to workshop requirements, roadmaps, or hiring plans.</li>
        <li>Prefer async? I keep detailed notes and Loom updates so stakeholders stay aligned.</li>
      </ul>
      <p className="contact-info__email">
        Or reach me directly at <a href="mailto:hello@example.com">hello@example.com</a>.
      </p>
    </div>
  </Section>
);
