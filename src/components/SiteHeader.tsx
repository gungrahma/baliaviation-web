import { useState } from "react";
import { useLocation } from "react-router-dom";
import { contactEmail } from "../data/community";
import { ArrowUpRight } from "./ArrowUpRight";

const navigation = [
  { name: "about", label: "Our community", href: "/about/" },
  { name: "gallery", label: "In the skies", href: "/gallery/" },
  { name: "contact", label: "Say hello", href: "/contact/" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Bali Aviation Community home">
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
        {navigation.map((item) => (
          <a
            href={item.href}
            key={item.name}
            aria-current={pathname.replace(/\/+$/, "") === `/${item.name}` ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
        <a className="nav-cta" href={`mailto:${contactEmail}`}>
          Join the community <ArrowUpRight />
        </a>
      </nav>
    </header>
  );
}
