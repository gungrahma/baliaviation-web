import { ArrowUpRight } from "../components/ArrowUpRight";
import { PageHero } from "../components/PageHero";
import { contactEmail } from "../data/community";

export function ContactPage() {
  return (
    <>
      <PageHero
        image="contact"
        eyebrow="Your people are up here"
        title={<>Let&apos;s talk<br /><span>aviation.</span></>}
        copy="Curious about the community, looking to meet fellow aviation enthusiasts, or just want to say hello? We&apos;d love to hear from you."
      />
      <section className="contact-page section-wrap">
        <div className="contact-page-copy">
          <p className="eyebrow eyebrow--dark">Your first point of contact</p>
          <h2>Every good<br />connection starts<br /><span>with hello.</span></h2>
          <p className="body-copy">
            Tell us a little about yourself and what brings you to aviation. Whether you&apos;re an old hand or just starting to look up, there&apos;s a place for you here.
          </p>
          <a className="button button--amber" href={`mailto:${contactEmail}?subject=Hello%20from%20the%20Bali%20Aviation%20Community`}>
            Email the community <ArrowUpRight />
          </a>
        </div>
        <aside className="contact-card">
          <span className="contact-label">SAY HELLO</span>
          <a className="contact-card-email" href={`mailto:${contactEmail}`}>
            {contactEmail}<ArrowUpRight />
          </a>
          <span className="contact-location">DENPASAR, BALI<br />INDONESIA · UTC+8</span>
          <div className="contact-card-divider" />
          <p>We&apos;re a community of aviation enthusiasts across the island. Start a conversation and we&apos;ll help you find your people.</p>
        </aside>
      </section>
    </>
  );
}
