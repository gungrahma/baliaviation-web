import { CommunityPillars } from "../components/CommunityPillars";
import { PageHero } from "../components/PageHero";
import { contactEmail } from "../data/community";
import { ArrowUpRight } from "../components/ArrowUpRight";

export function AboutPage() {
  return (
    <>
      <PageHero
        image="about"
        eyebrow="Tentang kami"
        title={<>Mengenal lebih jauh<br /><span>komunitas.</span></>}
        copy="DImulai dari sebuah grup instagram hingga melebar menuju grup whatsapp."
      />
      <section className="about-story section-wrap">
        <div className="section-index"><span>01</span> / TENTANG KAMI</div>
        <div className="about-story-copy">
          <h2>Dimulai dari<br /><span>Instagram.</span></h2>
          <p className="body-copy">
            Bali Aviation Community is a welcoming meeting point for the people who make aviation part of their lives. We bring together pilots, plane spotters, aviation professionals, students, and anyone who simply loves the view from above.
          </p>
          <p className="body-copy">
            There&apos;s no checklist to join and no one way to belong. Bring your questions, your experience, or just your curiosity. We&apos;re here to learn from each other, make real connections, and share the moments that keep us looking skyward.
          </p>
          <a className="inline-link" href={`mailto:${contactEmail}`}>Find your place here <ArrowUpRight /></a>
        </div>
        <div className="about-story-image" role="img" aria-label="A light aircraft flying above the clouds" />
      </section>
      <CommunityPillars />
      <section className="about-invite">
        <p className="eyebrow eyebrow--dark">KONTAK KAMI!</p>
        <h2>Ingin <br /><span>bergabung?</span></h2>
        <a className="button button--light" href="/contact/">Bergabung <ArrowUpRight /></a>
      </section>
    </>
  );
}
