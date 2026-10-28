import { ArrowUpRight } from "../components/ArrowUpRight";
import { CommunityPillars } from "../components/CommunityPillars";
import { GalleryGrid } from "../components/GalleryGrid";
import { contactEmail } from "../data/community";

export function HomePage() {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow"><span className="eyebrow-line" /> A community above the ordinary</p>
          <h1>Find your<br />people in the <span>sky.</span></h1>
          <p className="hero-copy">
            For everyone who feels a little closer to home when they look up. Welcome to aviation, Bali-style.
          </p>
          <div className="hero-actions">
            <a className="button button--light" href="/about/">Get to know us <ArrowUpRight /></a>
            <a className="text-link" href="/gallery/">Explore the community <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-note">
          <span className="note-dot" />
          <span>DENPASAR, BALI</span>
          <span className="note-divider" />
          <span>08° 44&apos; S · 115° 10&apos; E</span>
        </div>
        <a className="scroll-cue" href="#welcome" aria-label="Scroll to learn about our community">
          <span>SCROLL TO EXPLORE</span><span className="scroll-line" />
        </a>
      </section>

      <section className="intro section-wrap" id="welcome">
        <div className="section-index"><span>01</span> / ABOUT US</div>
        <div className="intro-copy">
          <p className="eyebrow eyebrow--dark">More than a shared hobby</p>
          <h2>Big skies.<br /><span>Good people.</span></h2>
          <p className="body-copy">
            We&apos;re a growing crew of pilots, plane spotters, aviation professionals, and curious minds who call Bali home. Different paths, one thing in common: we never stopped looking up.
          </p>
          <p className="body-copy">
            No matter where you are in your journey, there&apos;s a place for you here. Come for the aircraft. Stay for the people.
          </p>
          <a className="inline-link" href="/about/">There&apos;s a seat for you <ArrowUpRight /></a>
        </div>
        <div className="intro-aside">
          <div className="aside-image" role="img" aria-label="A plane flying over the ocean" />
          <div className="aside-caption"><span>01 — ISLAND LIFE, ALTITUDE INCLUDED</span><span>✳</span></div>
        </div>
      </section>

      <CommunityPillars />

      <section className="gallery section-wrap gallery--preview">
        <div className="gallery-heading">
          <div>
            <div className="section-index"><span>02</span> / THE GALLERY</div>
            <h2>Eyes on the <span>sky.</span></h2>
          </div>
          <a className="inline-link" href="/gallery/">View the gallery <ArrowUpRight /></a>
        </div>
        <GalleryGrid />
        <p className="gallery-note">A LITTLE LOVE FOR THE VIEW FROM UP HERE <span>✳</span></p>
      </section>

      <section className="home-contact">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> Your people are up here</p>
          <h2>Curious about<br />what&apos;s <span>next?</span></h2>
        </div>
        <div className="home-contact-action">
          <p>Drop us a line. Tell us what gets you excited about aviation. We&apos;ll take it from there.</p>
          <a className="button button--amber" href="/contact/">Say hello <ArrowUpRight /></a>
        </div>
        <a className="home-contact-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </section>
    </>
  );
}
