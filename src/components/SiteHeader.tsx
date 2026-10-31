import { useState } from "react";
import { useLocation } from "react-router-dom";
import { contactEmail } from "../data/community";
import { ArrowUpRight } from "./ArrowUpRight";

type Theme = "light" | "dark";

const navigation = [
  { name: "about", label: "Tentang Komunitas", href: "/about/" },
  { name: "gallery", label: "Galeri Kami", href: "/gallery/" },
  { name: "news", label: "Berita dan Update", href: "/news/" },
  { name: "contact", label: "Hubungi Kami", href: "/contact/" },
] as const;

interface SiteHeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function SiteHeader({ theme, onThemeChange }: SiteHeaderProps) {
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
        <button
          className="theme-toggle"
          type="button"
          aria-pressed={theme === "dark"}
          aria-label={`Switch to ${theme === "dark" ? "day" : "night"} mode`}
          onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
        >
          <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
          {theme === "dark" ? "Day mode" : "Night mode"}
        </button>
        <a className="nav-cta" href={`mailto:${contactEmail}`}>
          Gabung dengan komunitas <ArrowUpRight />
        </a>
      </nav>
    </header>
  );
}
