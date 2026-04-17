"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Clock, AlertCircle, Trophy, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Winner {
  id: string;
  user_name: string;
  user_email: string;
  draw_month: string;
  match_type: "match5" | "match4" | "match3";
  prize_amount: number;
  verification_status: "unverified" | "pending" | "approved" | "rejected";
  payment_status: "pending" | "paid";
  submitted_at?: string;
}

const MOCK_WINNERS: Winner[] = [
  { id: "w1", user_name: "John Doe",    user_email: "john@example.com",  draw_month: "April 2026", match_type: "match4", prize_amount: 1250, verification_status: "pending",    payment_status: "pending", submitted_at: "2026-04-14" },
  { id: "w2", user_name: "Jane Smith",  user_email: "jane@example.com",  draw_month: "April 2026", match_type: "match3", prize_amount: 350,  verification_status: "pending",    payment_status: "pending", submitted_at: "2026-04-15" },
  { id: "w3", user_name: "Alex Morgan", user_email: "alex@example.com",  draw_month: "March 2026", match_type: "match3", prize_amount: 280,  verification_status: "approved",   payment_status: "paid",    submitted_at: "2026-03-20" },
  { id: "w4", user_name: "Sam Patel",   user_email: "sam@example.com",   draw_month: "March 2026", match_type: "match4", prize_amount: 920,  verification_status: "rejected",   payment_status: "pending", submitted_at: "2026-03-19" },
  { id: "w5", user_name: "Jamie Chen",  user_email: "jamie@example.com", draw_month: "Feb 2026",   match_type: "match5", prize_amount: 4480, verification_status: "approved",   payment_status: "paid",    submitted_at: "2026-02-18" },
];

const matchLabel: Record<string, string> = { match5: "5 Match", match4: "4 Match", match3: "3 Match" };

const matchColor: Record<string, string> = { match5: "badge-blue", match4: "badge-green", match3: "badge-gray" };

export default function AdminWinnersPage() {
  const [winners, setWinners]   = useState<Winner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [acting, setActing]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("winners")
        .select("*, users(first_name, last_name, email), draws(draw_month)")
        .order("submitted_at", { ascending: false });
      setWinners(!error && data && data.length ? (data as Winner[]) : MOCK_WINNERS);
      setLoading(false);
    })();
  }, []);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleVerify(id: string, action: "approved" | "rejected") {
    setActing(id);
    const { error } = await supabase
      .from("winners")
      .update({ verification_status: action })
      .eq("id", id);
    setWinners(prev => prev.map(w => w.id === id ? { ...w, verification_status: action } : w));
    showToast(action === "approved" ? "Winner approved — payment can now be processed." : "Submission rejected.", action === "approved" ? "success" : "error");
    setActing(null);
  }

  async function handleMarkPaid(id: string) {
    setActing(id);
    const { error } = await supabase
      .from("winners")
      .update({ payment_status: "paid" })
      .eq("id", id);
    setWinners(prev => prev.map(w => w.id === id ? { ...w, payment_status: "paid" } : w));
    showToast("Payment marked as completed.", "success");
    setActing(null);
  }

  const filtered = winners.filter(w => filter === "all" || w.verification_status === filter || (filter === "paid" && w.payment_status === "paid"));

  const counts = {
    all:        winners.length,
    pending:    winners.filter(w => w.verification_status === "pending").length,
    approved:   winners.filter(w => w.verification_status === "approved").length,
    rejected:   winners.filter(w => w.verification_status === "rejected").length,
    unverified: winners.filter(w => w.verification_status === "unverified").length,
  };

  const totalPending = winners.filter(w => w.verification_status === "pending").reduce((s, w) => s + w.prize_amount, 0);
  const totalPaid    = winners.filter(w => w.payment_status === "paid").reduce((s, w) => s + w.prize_amount, 0);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Winner Verifications</h1>
          <p className="page-subtitle">Review submitted proofs, approve winners, and track payouts.</p>
        </div>
      </div>

      {toast && (
        <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"}`} style={{ marginBottom: "1.5rem" }}>
          {toast.type === "success" ? <CheckCircle size={16} style={{ flexShrink: 0 }} /> : <AlertCircle size={16} style={{ flexShrink: 0 }} />}
          {toast.msg}
        </div>
      )}

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Awaiting Review", value: counts.pending.toString(), color: "var(--warn)" },
          { label: "Approved", value: counts.approved.toString(), color: "var(--accent)" },
          { label: "Rejected", value: counts.rejected.toString(), color: "var(--danger)" },
          { label: "Total Paid Out", value: `$${totalPaid.toLocaleString()}`, color: "var(--brand)" },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <p className="stat-label">{k.label}</p>
            <p className="stat-value" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Pending action banner */}
      {counts.pending > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: "1.5rem" }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span><strong>{counts.pending} winner{counts.pending > 1 ? "s" : ""}</strong> have submitted proof and are awaiting your review. Total value: <strong>${totalPending.toLocaleString()}</strong></span>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          ["all",        `All (${counts.all})`],
          ["pending",    `Pending Review (${counts.pending})`],
          ["approved",   `Approved (${counts.approved})`],
          ["rejected",   `Rejected (${counts.rejected})`],
          ["unverified", `Awaiting Proof (${counts.unverified})`],
        ].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} className={`btn btn-sm ${filter === val ? "btn-primary" : "btn-secondary"}`}>{label}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div className="animate-spin" style={{ width: 28, height: 28, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 0.75rem" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading winner records…</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: "none", borderRadius: "var(--radius-lg)" }}>
            <table>
              <thead>
                <tr>
                  <th>Winner</th>
                  <th className="hide-mobile-md">Draw</th>
                  <th className="hide-mobile-sm">Match</th>
                  <th>Prize</th>
                  <th className="hide-mobile-md">Submitted</th>
                  <th>Verification</th>
                  <th className="hide-mobile-sm">Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>No records in this category.</td></tr>
                ) : filtered.map(w => (
                  <tr key={w.id}>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{w.user_name}</p>
                      <p className="hide-mobile-md" style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{w.user_email}</p>
                    </td>
                    <td className="hide-mobile-md" style={{ fontSize: "0.875rem" }}>{w.draw_month}</td>
                    <td className="hide-mobile-sm"><span className={`badge ${matchColor[w.match_type]}`}><Trophy size={10} /> {matchLabel[w.match_type]}</span></td>
                    <td style={{ fontWeight: 700, color: "var(--accent)" }}>${w.prize_amount.toLocaleString()}</td>
                    <td className="hide-mobile-md" style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {w.submitted_at ? new Date(w.submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td>
                      {w.verification_status === "unverified" && <span className="badge badge-gray"><Clock size={10} /> Awaiting proof</span>}
                      {w.verification_status === "pending"    && <span className="badge badge-yellow"><Clock size={10} /> Under review</span>}
                      {w.verification_status === "approved"   && <span className="badge badge-green"><CheckCircle size={10} /> Approved</span>}
                      {w.verification_status === "rejected"   && <span className="badge badge-red"><XCircle size={10} /> Rejected</span>}
                    </td>
                    <td className="hide-mobile-sm">
                      {w.payment_status === "paid"
                        ? <span className="badge badge-green"><CheckCircle size={10} /> Paid</span>
                        : <span className="badge badge-yellow"><Clock size={10} /> Pending</span>}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                        {w.verification_status === "pending" && (
                          <>
                            <button
                              className="btn btn-sm btn-accent"
                              onClick={() => handleVerify(w.id, "approved")}
                              disabled={acting === w.id}
                              style={{ gap: "0.3rem" }}
                            >
                              <CheckCircle size={13} /> Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleVerify(w.id, "rejected")}
                              disabled={acting === w.id}
                              style={{ gap: "0.3rem" }}
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </>
                        )}
                        {w.verification_status === "approved" && w.payment_status !== "paid" && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleMarkPaid(w.id)}
                            disabled={acting === w.id}
                          >
                            Mark Paid
                          </button>
                        )}
                        <button className="btn btn-secondary btn-sm" title="View details"><Eye size={13} /></button>
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
