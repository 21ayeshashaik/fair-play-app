"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/charities", label: "Charities" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close when path changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [open]);

  return (
    <>
      <header className="navbar" style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <div className="nav-content" style={{ width: "100%", padding: "0 2rem" }}>
          {/* Brand */}
          <Link href="/" className="nav-brand">
            <Target size={22} color="var(--brand)" strokeWidth={2.5} />
            Fair<span style={{ color: "var(--brand)" }}>Play</span>
          </Link>

          {/* Desktop links */}
          <nav className="nav-links">
            {links.map(l => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-link${active ? " active" : ""}`}
                  style={active ? { color: "var(--brand)", background: "var(--brand-light)", fontWeight: 600 } : {}}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link href="/admin/login" className="nav-link" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Admin
            </Link>
            <div style={{ width: "1px", height: "18px", background: "var(--border)", margin: "0 0.5rem" }} />
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Subscribe
            </Link>
          </nav>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="mobile-menu-btn"
            style={{ 
              display: "none", 
              border: "none", 
              padding: "0.5rem", 
              borderRadius: "50%", 
              background: open ? "var(--brand-light)" : "var(--bg-subtle)", 
              color: open ? "var(--brand)" : "var(--text-primary)",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu (Drawer style) */}
        {open && (
          <div 
            style={{ 
              position: "fixed", top: "64px", left: 0, right: 0, bottom: 0, 
              background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
              zIndex: 99
            }}
            onClick={() => setOpen(false)}
          >
            <div 
              style={{ 
                background: "var(--bg-surface)", 
                padding: "1.5rem 1rem 2rem", 
                borderTop: "1px solid var(--border)",
                borderBottomLeftRadius: "1.5rem", 
                borderBottomRightRadius: "1.5rem", 
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                display: "flex", flexDirection: "column", gap: "0.5rem"
              }}
              onClick={e => e.stopPropagation()}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", padding: "0 0.75rem", marginBottom: "0.5rem" }}>
                Menu
              </p>
              {links.map(l => (
                <Link 
                  key={l.href} 
                  href={l.href} 
                  className={`nav-link${pathname === l.href ? " active" : ""}`}
                  style={{ fontSize: "1rem", padding: "0.85rem 1rem", borderRadius: "12px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    {l.label}
                    {pathname === l.href && <ArrowRight size={16} />}
                  </div>
                </Link>
              ))}
              <div style={{ height: "1px", background: "var(--border)", margin: "0.5rem 0" }} />
              <Link href="/admin/login" className="nav-link" style={{ padding: "0.85rem 1rem" }}>
                Admin Portal
              </Link>

              <div style={{ marginTop: "1rem", padding: "0 0.5rem" }}>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "1rem" }}>
                  Join FastPlay Now
                </Link>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            .nav-links { display: none !important; }
            .mobile-menu-btn { display: flex !important; }
          }
        `}</style>
      </header>
    </>
  );
}
