import Link from "next/link";
import { Target } from "lucide-react";

const cols = [
  {
    heading: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/charities", label: "Charities" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "#", label: "Help Centre" },
      { href: "#", label: "Contact Us" },
      { href: "#", label: "FAQs" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "#", label: "Terms of Service" },
      { href: "#", label: "Privacy Policy" },
      { href: "#", label: "Cookie Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", padding: "4rem 0 2rem" }}>
      <div className="container">
        <div className="footer-grid" style={{ marginBottom: "3rem" }}>
          {/* Brand col */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1rem" }}>
              <Target size={20} color="var(--brand)" strokeWidth={2.5} />
              Fair<span style={{ color: "var(--brand)" }}>Play</span>
            </Link>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "260px" }}>
              A subscription platform combining golf performance tracking, charitable impact, and monthly prize draws.
            </p>
          </div>

          {/* Link cols */}
          {cols.map(col => (
            <div key={col.heading}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1rem" }}>
                {col.heading}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {col.links.map(l => (
                  <Link key={l.label} href={l.href} style={{ fontSize: "0.875rem", color: "var(--text-secondary)", transition: "color 0.15s" }}
                    onMouseOver={undefined} onMouseOut={undefined}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} FairPlay. All rights reserved.
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Powered by Supabase · Built for good.
          </p>
        </div>
      </div>
    </footer>
  );
}
