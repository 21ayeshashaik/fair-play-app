import Link from "next/link";
import { Users, DollarSign, Heart, Hash, ArrowRight, TrendingUp, Clock } from "lucide-react";

const kpis = [
  {
    label: "Total Subscribers",
    value: "4,204",
    change: "+12% this month",
    up: true,
    icon: <Users size={18} />,
    style: "icon-box-blue",
  },
  {
    label: "Current Prize Pool",
    value: "$14,500",
    note: "incl. $6,200 jackpot rollover",
    icon: <DollarSign size={18} />,
    style: "icon-box-green",
  },
  {
    label: "Charity Raised (YTD)",
    value: "$125,430",
    note: "Across 12 active charities",
    icon: <Heart size={18} />,
    style: "icon-box-yellow",
  },
  {
    label: "Next Draw",
    value: "14 days",
    note: "Until next draw execution",
    icon: <Hash size={18} />,
    style: "icon-box-gray",
  },
];

const pendingWinners = [
  { user: "John Doe",   match: "4-Number Match", amount: "$1,250", status: "pending" },
  { user: "Jane Smith", match: "3-Number Match", amount: "$350",   status: "pending" },
];

const quickActions = [
  { href: "/admin/draws",     label: "Configure Next Draw",    primary: true  },
  { href: "/admin/charities", label: "Add New Charity",        primary: false },
  { href: "/admin/winners",   label: "Review Verifications",   primary: false },
];

export default function AdminOverview() {
  return (
    <div style={{ width: "100%" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Overview</h1>
          <p className="page-subtitle">Platform health, pending actions, and quick access.</p>
        </div>
        <button className="btn btn-secondary btn-sm">Export Report</button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {kpis.map(k => (
          <div key={k.label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div className={`icon-box ${k.style}`}>{k.icon}</div>
              {k.up !== undefined && (
                <span className={`stat-change ${k.up ? "up" : "down"}`} style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                  <TrendingUp size={12} /> {k.change}
                </span>
              )}
            </div>
            <p className="stat-label">{k.label}</p>
            <p className="stat-value">{k.value}</p>
            {k.note && <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.35rem" }}>{k.note}</p>}
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* Pending verifications */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Pending Verifications</h2>
            <span className="badge badge-yellow">{pendingWinners.length} require action</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Match Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingWinners.map(w => (
                  <tr key={w.user}>
                    <td style={{ fontWeight: 600 }}>{w.user}</td>
                    <td>{w.match}</td>
                    <td style={{ fontWeight: 700 }}>{w.amount}</td>
                    <td><span className="badge badge-yellow"><Clock size={10} /> Pending</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "1.25rem" }}>
            <Link href="/admin/winners" className="btn btn-secondary btn-sm">
              View All Verifications <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.25rem" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {quickActions.map(a => (
              <Link
                key={a.href}
                href={a.href}
                className={`btn ${a.primary ? "btn-primary" : "btn-secondary"} w-full`}
                style={{ justifyContent: "space-between" }}
              >
                {a.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
