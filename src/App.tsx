import { Route, Routes } from "react-router-dom";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <>
      <SiteHeader />
      <main className="page-transition">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="*"
            element={
              <section className="not-found">
                <p className="eyebrow eyebrow--dark">Off course</p>
                <h1>We can&apos;t find that page.</h1>
                <a className="inline-link" href="/">Back to the home page</a>
              </section>
            }
          />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
