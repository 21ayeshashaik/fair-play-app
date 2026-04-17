"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, Heart, Trophy, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard",          label: "Overview",   icon: LayoutDashboard, exact: true },
  { href: "/dashboard/scores",   label: "Scores",     icon: Activity },
  { href: "/dashboard/charity",  label: "Charity",    icon: Heart },
  { href: "/dashboard/winnings", label: "Winnings",   icon: Trophy },
  { href: "/dashboard/settings", label: "Settings",   icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href;
    return pathname?.startsWith(item.href) ?? false;
  }

  return (
    <>
      <div className="app-shell">
        {/* Desktop sidebar */}
        <aside className="sidebar">
          <p className="sidebar-section-label" style={{ marginTop: 0 }}>My Account</p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            {navItems.slice(0, 4).map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link${isActive(item) ? " active" : ""}`}
                >
                  <Icon size={16} /> {item.label === "Overview" ? "Overview" : item.label}
                </Link>
              );
            })}
          </nav>
          <div className="sidebar-divider" />
          <p className="sidebar-section-label">Preferences</p>
          <Link
            href="/dashboard/settings"
            className={`sidebar-link${pathname?.includes("/settings") ? " active" : ""}`}
          >
            <Settings size={16} /> Settings
          </Link>
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
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
