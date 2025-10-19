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
      <h3 className="contact-info__title type-heading-4 measure-short">What to expect</h3>
      <ul className="contact-info__list type-body measure">
        <li className="text-pretty">No spam—just a thoughtful reply with next steps.</li>
        <li className="text-pretty">
          Happy to workshop requirements, roadmaps, or hiring plans.
        </li>
        <li className="text-pretty">
          Prefer async? I keep detailed notes and Loom updates so stakeholders stay aligned.
        </li>
      </ul>
      <p className="contact-info__email type-body-sm measure-short">
        Or reach me directly at <a href="mailto:hello@example.com">hello@example.com</a>.
      </p>
    </div>
  </Section>
);
