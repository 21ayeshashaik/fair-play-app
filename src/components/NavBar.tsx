"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/charities", label: "Charities" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container nav-content">
        {/* Brand */}
        <Link href="/" className="nav-brand">
          <Target size={22} color="var(--brand)" strokeWidth={2.5} />
          Fair<span style={{ color: "var(--brand)" }}>Play</span>
        </Link>

        {/* Desktop links */}
        <nav className="nav-links" style={{ gap: "0.25rem" }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link${pathname === l.href ? " active" : ""}`}
              style={pathname === l.href ? { color: "var(--brand)", background: "var(--brand-light)", fontWeight: 600 } : {}}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="nav-link"
            style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}
          >
            Admin
          </Link>
          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 0.5rem" }} />
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Subscribe
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{ display: "none", padding: "0.4rem", borderRadius: "6px", background: "var(--bg-subtle)", cursor: "pointer" }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} className="nav-link" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/admin/login" className="nav-link" onClick={() => setOpen(false)} style={{ color: "var(--text-muted)" }}>Admin</Link>
          <Link href="/dashboard" className="btn btn-primary btn-sm mt-4" onClick={() => setOpen(false)} style={{ justifyContent: "center" }}>Subscribe</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
