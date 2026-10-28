import { useState } from "react";
import { communityPillars, contactEmail, galleryImages } from "./data/community";

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Bali Aviation Community home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">BA</span>
          <span className="brand-name">BALI AVIATION<span>COMMUNITY</span></span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav id="primary-navigation" className={menuOpen ? "navigation navigation--open" : "navigation"}>
          <a href="#about-us" onClick={closeMenu}>Our community</a>
          <a href="#gallery" onClick={closeMenu}>In the skies</a>
          <a href="#contact-us" onClick={closeMenu}>Say hello</a>
          <a className="nav-cta" href={`mailto:${contactEmail}`}>
            Join the community <ArrowUpRight />
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow"><span className="eyebrow-line" /> A community above the ordinary</p>
            <h1>Find your<br />people in the <span>sky.</span></h1>
            <p className="hero-copy">
              For everyone who feels a little closer to home when they look up. Welcome to aviation, Bali-style.
            </p>
            <div className="hero-actions">
              <a className="button button--light" href="#about-us">Get to know us <ArrowUpRight /></a>
              <a className="text-link" href="#gallery">Explore the community <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="hero-note">
            <span className="note-dot" />
            <span>DENPASAR, BALI</span>
            <span className="note-divider" />
            <span>08° 44&apos; S · 115° 10&apos; E</span>
          </div>
          <a className="scroll-cue" href="#about-us" aria-label="Scroll to about our community">
            <span>SCROLL TO EXPLORE</span><span className="scroll-line" />
          </a>
        </section>

        <section className="intro section-wrap" id="about-us">
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
            <a className="inline-link" href={`mailto:${contactEmail}`}>There&apos;s a seat for you <ArrowUpRight /></a>
          </div>
          <div className="intro-aside">
            <div className="aside-image" role="img" aria-label="A plane flying over the ocean" />
            <div className="aside-caption"><span>01 — ISLAND LIFE, ALTITUDE INCLUDED</span><span>✳</span></div>
          </div>
        </section>

        <section className="pillars">
          <div className="pillars-heading">
            <p className="eyebrow"><span className="eyebrow-line" /> The way we fly</p>
            <h2>Built on shared<br />passion.</h2>
          </div>
          <div className="pillar-list">
            {communityPillars.map((pillar) => (
              <article className="pillar" key={pillar.number}>
                <span className="pillar-number">{pillar.number}</span>
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </div>
                <span className="pillar-plus" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery section-wrap" id="gallery">
          <div className="gallery-heading">
            <div>
              <div className="section-index"><span>02</span> / THE GALLERY</div>
              <h2>Eyes on the <span>sky.</span></h2>
            </div>
            <p>A few little reminders of why we do this.<br />The view never gets old.</p>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <figure className={`gallery-card ${image.className}`} key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption><span>0{index + 1}</span>{image.label}</figcaption>
              </figure>
            ))}
          </div>
          <p className="gallery-note">A LITTLE LOVE FOR THE VIEW FROM UP HERE <span>✳</span></p>
        </section>

        <section className="contact" id="contact-us">
          <div className="contact-glow" aria-hidden="true" />
          <div className="contact-content">
            <p className="eyebrow"><span className="eyebrow-line" /> Your people are up here</p>
            <h2>Curious about<br />what&apos;s <span>next?</span></h2>
            <p>Drop us a line. Tell us what gets you excited about aviation. We&apos;ll take it from there.</p>
            <a className="button button--amber" href={`mailto:${contactEmail}`}>
              Let&apos;s talk <ArrowUpRight />
            </a>
          </div>
          <div className="contact-aside">
            <span className="contact-label">YOUR FIRST POINT OF CONTACT</span>
            <a href={`mailto:${contactEmail}`}>{contactEmail}<ArrowUpRight /></a>
            <span className="contact-location">DENPASAR, BALI<br />INDONESIA · UTC+8</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand brand--footer" href="#home" aria-label="Back to top">
          <span className="brand-mark" aria-hidden="true">BA</span>
          <span className="brand-name">BALI AVIATION<span>COMMUNITY</span></span>
        </a>
        <span className="footer-note">MADE FOR THE LOVE OF FLIGHT <span>✳</span></span>
        <span className="copyright">© {new Date().getFullYear()} BALI AVIATION COMMUNITY</span>
      </footer>
    </>
  );
}

export default App;
