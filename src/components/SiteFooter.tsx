export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="brand brand--footer" href="/" aria-label="Bali Aviation Community home">
        <span className="brand-mark" aria-hidden="true">BA</span>
        <span className="brand-name">BALI AVIATION<span>COMMUNITY</span></span>
      </a>
      <span className="footer-note">MADE FOR THE LOVE OF FLIGHT <span>✳</span></span>
      <span className="copyright">© {new Date().getFullYear()} BALI AVIATION COMMUNITY</span>
    </footer>
  );
}
