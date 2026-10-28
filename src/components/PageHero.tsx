import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  image: "about" | "gallery" | "contact";
};

export function PageHero({ eyebrow, title, copy, image }: PageHeroProps) {
  return (
    <section className={`page-hero page-hero--${image}`}>
      <div className="page-hero-image" aria-hidden="true" />
      <div className="page-hero-content">
        <p className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-copy">{copy}</p>
      </div>
      <div className="hero-note">
        <span className="note-dot" />
        <span>DENPASAR, BALI</span>
        <span className="note-divider" />
        <span>08° 44&apos; S · 115° 10&apos; E</span>
      </div>
    </section>
  );
}
