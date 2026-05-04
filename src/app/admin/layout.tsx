"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart2, Users, Cpu, HeartHandshake,
  CheckSquare, LogOut, ShieldAlert, ArrowRight
} from "lucide-react";


const navItems = [
  { href: "/admin",           label: "Analytics",    icon: BarChart2,       exact: true },
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
      <div className="app-shell" style={{ background: "var(--bg-base)" }}>
        {/* Desktop sidebar */}
        <aside className="sidebar" style={{ 
          background: "var(--bg-surface)", 
          borderRight: "1px solid var(--border)",
          boxShadow: "1px 0 10px rgba(0,0,0,0.02)"
        }}>
          <div style={{ padding: "0.5rem 0.75rem", marginBottom: "2rem" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.65rem", 
              padding: "0.75rem 1rem", 
              background: "linear-gradient(135deg, var(--brand-light) 0%, #e0eaff 100%)", 
              borderRadius: "14px", 
              border: "1px solid rgba(59, 130, 246, 0.2)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}>
              <div style={{ 
                width: "28px", 
                height: "28px", 
                borderRadius: "8px", 
                background: "var(--brand)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(26, 86, 219, 0.3)"
              }}>
                <ShieldAlert size={16} color="white" />
              </div>
              <div>
                <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--brand)", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.2 }}>Admin</p>
                <p style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)", lineHeight: 1.2 }}>Console</p>
              </div>
            </div>
          </div>

          <p className="sidebar-section-label">Main Menu</p>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link${active ? " active" : ""}`}
                  style={active ? { 
                    background: "var(--brand-light)", 
                    color: "var(--brand)", 
                    fontWeight: 600,
                    boxShadow: "inset 0 0 0 1px rgba(26, 86, 219, 0.1)"
                  } : {}}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    width: "32px", 
                    height: "32px", 
                    borderRadius: "8px",
                    background: active ? "rgba(26, 86, 219, 0.1)" : "transparent",
                    transition: "all 0.2s"
                  }}>
                    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  {item.label}
                </Link>
              );
            })}

            <div className="sidebar-divider" style={{ margin: "0.75rem 0" }} />
            <Link href="/" className="sidebar-link">
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                width: "32px", 
                height: "32px", 
                borderRadius: "8px",
                background: "var(--bg-subtle)"
              }}>
                <ArrowRight size={16} />
              </div>
              Go to Site
            </Link>
          </nav>

          <div style={{ marginTop: "auto", padding: "1rem 0.75rem" }}>
            <div className="sidebar-divider" style={{ margin: "0 0 1rem 0" }} />
            <button 
              onClick={handleLogout} 
              className="sidebar-link" 
              style={{ 
                color: "var(--danger)", 
                width: "100%", 
                textAlign: "left",
                background: "var(--danger-light)",
                border: "1px solid rgba(220, 38, 38, 0.1)"
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                width: "32px", 
                height: "32px", 
                borderRadius: "8px",
                background: "rgba(220, 38, 38, 0.1)"
              }}>
                <LogOut size={16} />
              </div>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Page content */}
        <main className="content-area" style={{ background: "var(--bg-base)", minHeight: "100vh", display: "flex", flexDirection: "column", padding: 0 }}>
          {/* Admin Top Navbar */}
          <header style={{ 
            height: "72px", 
            background: "var(--bg-surface)", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "0 2rem",
            position: "sticky",
            top: 0,
            zIndex: 5
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ position: "relative", width: "400px" }}>
                <div style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                  <Users size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search analytics, users, or charities..." 
                  style={{ 
                    width: "100%", 
                    padding: "0.6rem 1rem 0.6rem 2.5rem", 
                    borderRadius: "10px", 
                    border: "1px solid var(--border)", 
                    background: "var(--bg-subtle)",
                    fontSize: "0.875rem"
                  }} 
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>Ayesha Shaik</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.2 }}>Super Admin</p>
                </div>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "12px", 
                  background: "linear-gradient(135deg, var(--brand) 0%, #1e40af 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow: "0 4px 6px -1px rgba(26, 86, 219, 0.2)"
                }}>
                  AS
                </div>
              </div>
            </div>
          </header>

          <div style={{ padding: "2rem", flex: 1 }}>
            {children}
          </div>
        </main>
      </div>


      {/* Mobile bottom navigation — App Style */}
      <nav className="mobile-bottom-nav" style={{ 
        height: "70px", 
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)"
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item${active ? " active" : ""}`}
              style={{ position: "relative" }}
            >
              {active && (
                <div style={{ 
                  position: "absolute", 
                  top: "0", 
                  width: "24px", 
                  height: "3px", 
                  background: "var(--brand)", 
                  borderRadius: "0 0 4px 4px",
                  boxShadow: "0 2px 4px rgba(26, 86, 219, 0.4)"
                }} />
              )}
              <div style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "12px",
                background: active ? "var(--brand-light)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2px",
                transition: "all 0.2s"
              }}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} color={active ? "var(--brand)" : "var(--text-muted)"} />
              </div>
              <span style={{ fontSize: "0.65rem", fontWeight: active ? 700 : 500 }}>{item.label === "Analytics" ? "Admin" : item.label === "Verifications" ? "Verify" : item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
