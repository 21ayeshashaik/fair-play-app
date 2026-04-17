"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart2, Users, Cpu, HeartHandshake,
  CheckSquare, LogOut, ShieldAlert
} from "lucide-react";

const navItems = [
  { href: "/admin",           label: "Analytics",    icon: BarChart2,       exact: true },
  { href: "/admin/users",     label: "Users",        icon: Users },
  { href: "/admin/draws",     label: "Draw Engine",  icon: Cpu },
  { href: "/admin/charities", label: "Charities",    icon: HeartHandshake },
  { href: "/admin/winners",   label: "Verifications",icon: CheckSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !pathname?.includes("/login")) {
      const auth = localStorage.getItem("fp_admin_auth");
      if (!auth) router.push("/admin/login");
    }
  }, [pathname, router]);

  if (pathname?.includes("/login")) return <>{children}</>;

  function handleLogout() {
    localStorage.removeItem("fp_admin_auth");
    router.push("/admin/login");
  }

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href;
    return pathname?.startsWith(item.href) ?? false;
  }

  return (
    <>
      <div className="app-shell">
        {/* Desktop sidebar */}
        <aside className="sidebar">
          <div style={{ padding: "0 0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.75rem", background: "var(--brand-light)", borderRadius: "var(--radius-sm)", border: "1px solid #bfdbfe" }}>
              <ShieldAlert size={15} color="var(--brand)" />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Admin Panel</span>
            </div>
          </div>

          <p className="sidebar-section-label" style={{ marginTop: 0 }}>Navigation</p>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link${isActive(item) ? " active" : ""}`}
                >
                  <Icon size={16} /> {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-divider" style={{ marginTop: "auto" }} />

          <button onClick={handleLogout} className="sidebar-link" style={{ color: "var(--danger)", width: "100%", textAlign: "left" }}>
            <LogOut size={16} /> Sign Out
          </button>
        </aside>

        {/* Page content */}
        <main className="content-area">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item${active ? " active" : ""}`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {item.label === "Verifications" ? "Verify" : item.label}
            </Link>
          );
        })}
        <button className="mobile-nav-item" onClick={handleLogout} style={{ color: "var(--danger)" }}>
          <LogOut size={18} />
          Sign Out
        </button>
      </nav>
    </>
  );
}
