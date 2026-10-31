import { ArrowUpRight } from "../components/ArrowUpRight";
import { CommunityPillars } from "../components/CommunityPillars";
import { GalleryGrid } from "../components/GalleryGrid";

export function HomePage() {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow"> Rahajeng rawuh, semeton!</p>
          <h1>Komunitas aviasi<br /> berbasis di <span>Bali.</span></h1>
          <p className="hero-copy">
            Sebuah komunitas penggemar dunia penerbangan yang berbasis di Bali!
          </p>
          <div className="hero-actions">
            <a className="button button--light" href="/about/">Kenali kami <ArrowUpRight /></a>
            <a className="text-link" href="/gallery/">Eksplor komunitas <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-note">
          <span className="note-dot" />
          <span>DENPASAR, BALI</span>
        </div>
      </section>

      <section className="intro section-wrap" id="welcome">
        <div className="section-index"><span>01</span> / TENTANG KAMI</div>
        <div className="intro-copy">
          <p className="eyebrow eyebrow--dark">Hobi dan komunitas</p>
          <h2>Bali dan<br /><span>Komunitas Aviasi</span></h2>
          <p className="body-copy">
            Bali Aviation merupakan komunitas aviasi yang berbasis di Bali sejak tahun 2022. 
            Komunitas ini dibangun untuk memberikan ruang bagi siapa saja yang tertarik dengan dunia penerbangan serta
            kegiatan mengamati pesawat atau dikenal dengan planespotting.
          </p>            
        </div>
        <div className="intro-aside">
          <div className="aside-image" role="img" aria-label="A plane flying over the ocean" />
          <div className="aside-caption"><span>01 — KEGIATAN SPOTTING BERSAMA</span><span>✳</span></div>
        </div>
      </section>

      <CommunityPillars />

      <section className="gallery section-wrap gallery--preview">
        <div className="gallery-heading">
          <div>
            <div className="section-index"><span>02</span> / GALERI KAMI</div>
            <h2>Kumpulan cerita dari <span>kami.</span></h2>
          </div>
          <a className="inline-link" href="/gallery/">Lihat lebih banyak <ArrowUpRight /></a>
        </div>
        <GalleryGrid />
        <p className="gallery-note">DIAMBIL OLEH MEMBER BALIAVIATION <span></span></p>
      </section>

      <section className="home-contact">
        <div>
          <p className="eyebrow"> Kontak kami!</p>
          <h2>Ingin <br /><span>bergabung?</span></h2>
        </div>
        <div className="home-contact-action">
          <p>Jika ingin bergabung dengan komunitas kami, jangan ragu untuk menghubungi kami!</p>
          <a className="button button--amber" href="/contact/">Bergabung <ArrowUpRight /></a>
        </div>
      </section>
    </>
  );
}