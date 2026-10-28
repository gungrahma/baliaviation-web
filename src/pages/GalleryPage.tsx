import { ArrowUpRight } from "../components/ArrowUpRight";
import { GalleryGrid } from "../components/GalleryGrid";
import { PageHero } from "../components/PageHero";

export function GalleryPage() {
  return (
    <>
      <PageHero
        image="gallery"
        eyebrow="A little love for the view from up here"
        title={<>Eyes on the<br /><span>sky.</span></>}
        copy="Aircraft, island light, and the little moments that remind us why we fell in love with aviation."
      />
      <section className="gallery gallery--page section-wrap">
        <div className="gallery-heading">
          <div>
            <div className="section-index"><span>01</span> / THE GALLERY</div>
            <h2>Views worth <span>sharing.</span></h2>
          </div>
          <p>From the runway to above the clouds,<br />there&apos;s always something to look up to.</p>
        </div>
        <GalleryGrid />
        <p className="gallery-note">A LITTLE LOVE FOR THE VIEW FROM UP HERE <span>✳</span></p>
      </section>
      <section className="gallery-invite">
        <div>
          <p className="eyebrow eyebrow--dark">Have a story to share?</p>
          <h2>Let&apos;s add your<br /><span>perspective.</span></h2>
        </div>
        <a className="inline-link" href="/contact/">Get in touch <ArrowUpRight /></a>
      </section>
    </>
  );
}
