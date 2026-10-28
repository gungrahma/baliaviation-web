import { galleryImages } from "../data/community";

export function GalleryGrid() {
  return (
    <div className="gallery-grid">
      {galleryImages.map((image, index) => (
        <figure className={`gallery-card ${image.className}`} key={image.src}>
          <img src={image.src} alt={image.alt} loading="lazy" />
          <figcaption><span>0{index + 1}</span>{image.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
