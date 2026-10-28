import { CommunityPillars } from "../components/CommunityPillars";
import { PageHero } from "../components/PageHero";
import { contactEmail } from "../data/community";
import { ArrowUpRight } from "../components/ArrowUpRight";

export function AboutPage() {
  return (
    <>
      <PageHero
        image="about"
        eyebrow="A place for everyone who looks up"
        title={<>Meet the<br /><span>community.</span></>}
        copy="Aviation brings us together. The people, curiosity, and island spirit are what make this community feel like home."
      />
      <section className="about-story section-wrap">
        <div className="section-index"><span>01</span> / OUR STORY</div>
        <div className="about-story-copy">
          <p className="eyebrow eyebrow--dark">Different paths, one shared sky</p>
          <h2>Grounded in Bali.<br /><span>Connected by flight.</span></h2>
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
        <p className="eyebrow eyebrow--dark">Your next chapter starts here</p>
        <h2>Whatever your path,<br /><span>you belong.</span></h2>
        <a className="button button--light" href="/contact/">Come say hello <ArrowUpRight /></a>
      </section>
    </>
  );
}
