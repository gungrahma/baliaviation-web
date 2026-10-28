import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";

const pages = {
  "/": { name: "home", component: HomePage },
  "/about": { name: "about", component: AboutPage },
  "/gallery": { name: "gallery", component: GalleryPage },
  "/contact": { name: "contact", component: ContactPage },
} as const;

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const page = pages[path as keyof typeof pages];
  const Page = page?.component ?? HomePage;

  return (
    <>
      <SiteHeader activePage={page?.name} />
      <main className="page-transition">
        {page ? (
          <Page />
        ) : (
          <section className="not-found">
            <p className="eyebrow eyebrow--dark">Off course</p>
            <h1>We can&apos;t find that page.</h1>
            <a className="inline-link" href="/">Back to the home page</a>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
