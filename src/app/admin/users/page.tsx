"use client";

import { useState, useEffect } from "react";
import { Users, Search, Eye, Edit2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  plan: "monthly" | "yearly";
  status: "active" | "lapsed" | "cancelled";
  scores_count: number;
  joined_at: string;
}

const MOCK_USERS: User[] = [
  { id: "u1", first_name: "Alex",    last_name: "Morgan",  email: "alex@example.com",  plan: "monthly", status: "active",    scores_count: 5, joined_at: "2026-01-10" },
  { id: "u2", first_name: "Jamie",   last_name: "Chen",    email: "jamie@example.com", plan: "yearly",  status: "active",    scores_count: 4, joined_at: "2025-11-22" },
  { id: "u3", first_name: "Sam",     last_name: "Patel",   email: "sam@example.com",   plan: "monthly", status: "lapsed",    scores_count: 2, joined_at: "2025-09-05" },
  { id: "u4", first_name: "Jordan",  last_name: "Kim",     email: "jordan@example.com",plan: "monthly", status: "active",    scores_count: 5, joined_at: "2026-02-14" },
  { id: "u5", first_name: "Riley",   last_name: "Davis",   email: "riley@example.com", plan: "yearly",  status: "cancelled", scores_count: 0, joined_at: "2025-08-30" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "active")    return <span className="badge badge-green"><CheckCircle size={10} /> Active</span>;
  if (status === "lapsed")    return <span className="badge badge-yellow"><AlertCircle size={10} /> Lapsed</span>;
  if (status === "cancelled") return <span className="badge badge-red"><XCircle size={10} /> Cancelled</span>;
  return <span className="badge badge-gray">{status}</span>;
}

export default function AdminUsersPage() {
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, email, plan, status, scores_count, joined_at")
        .order("joined_at", { ascending: false });
      setUsers(!error && data && data.length ? (data as User[]) : MOCK_USERS);
      setLoading(false);
    })();
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = { all: users.length, active: users.filter(u => u.status === "active").length, lapsed: users.filter(u => u.status === "lapsed").length, cancelled: users.filter(u => u.status === "cancelled").length };

  return (
    <div style={{ maxWidth: "1100px" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">View, search, and manage all registered subscribers.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <div className="stat-card" style={{ padding: "0.75rem 1.25rem", textAlign: "center" }}>
            <p className="stat-label">Total</p>
            <p style={{ fontWeight: 800, fontSize: "1.25rem" }}>{counts.all}</p>
          </div>
          <div className="stat-card" style={{ padding: "0.75rem 1.25rem", textAlign: "center" }}>
            <p className="stat-label" style={{ color: "var(--accent)" }}>Active</p>
            <p style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--accent)" }}>{counts.active}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
          <Search size={15} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input type="text" className="form-input" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }} />
        </div>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {["all", "active", "lapsed", "cancelled"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-secondary"}`} style={{ textTransform: "capitalize" }}>
              {s} {counts[s as keyof typeof counts] !== undefined ? `(${counts[s as keyof typeof counts]})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div className="animate-spin" style={{ width: 28, height: 28, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 0.75rem" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Fetching users from database…</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: "none", borderRadius: "var(--radius-lg)" }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Scores</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>No users match your search.</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.first_name} {u.last_name}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                    <td><span className={`badge ${u.plan === "yearly" ? "badge-blue" : "badge-gray"}`}>{u.plan}</span></td>
                    <td>
                      <span style={{ fontWeight: 700, color: u.scores_count === 5 ? "var(--accent)" : "var(--text-primary)" }}>{u.scores_count}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}> / 5</span>
                    </td>
                    <td><StatusBadge status={u.status} /></td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{new Date(u.joined_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button className="btn btn-secondary btn-sm" title="View"><Eye size={14} /></button>
                        <button className="btn btn-secondary btn-sm" title="Edit"><Edit2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
