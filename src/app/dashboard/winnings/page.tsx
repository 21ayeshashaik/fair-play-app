"use client";

import { useState, useEffect } from "react";
import { Trophy, Clock, Upload, CheckCircle, AlertCircle, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DrawResult {
  id: string;
  draw_month: string;
  numbers: number[];
  jackpot_amount: number;
  pool_total: number;
  status: "published" | "pending";
}

interface WinnerRecord {
  id: string;
  draw_id: string;
  match_type: "match5" | "match4" | "match3";
  prize_amount: number;
  payment_status: "pending" | "paid";
  verification_status: "unverified" | "pending" | "approved" | "rejected";
  draw_month?: string;
}

const MOCK_DRAWS: DrawResult[] = [
  { id: "d1", draw_month: "April 2026",   numbers: [12, 27, 34, 38, 40], jackpot_amount: 5800,  pool_total: 14500, status: "pending" },
  { id: "d2", draw_month: "March 2026",   numbers: [5, 18, 22, 36, 41],  jackpot_amount: 0,     pool_total: 12800, status: "published" },
  { id: "d3", draw_month: "February 2026",numbers: [9, 15, 28, 33, 45],  jackpot_amount: 0,     pool_total: 11200, status: "published" },
];

const MOCK_WINS: WinnerRecord[] = [
  { id: "w1", draw_id: "d2", match_type: "match3", prize_amount: 350, payment_status: "paid", verification_status: "approved", draw_month: "March 2026" },
];

const matchLabel: Record<string, string> = {
  match5: "5 Number Match — Jackpot",
  match4: "4 Number Match",
  match3: "3 Number Match",
};

const statusBadge = (v: string) => {
  if (v === "paid" || v === "approved") return <span className="badge badge-green"><CheckCircle size={10} /> {v}</span>;
  if (v === "pending") return <span className="badge badge-yellow"><Clock size={10} /> {v}</span>;
  if (v === "rejected") return <span className="badge badge-red"><AlertCircle size={10} /> {v}</span>;
  return <span className="badge badge-gray">{v}</span>;
};

const DEMO_USER_ID = "demo-user-001";

export default function WinningsPage() {
  const [draws,   setDraws]   = useState<DrawResult[]>([]);
  const [wins,    setWins]    = useState<WinnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: drawData, error: drawErr }, { data: winData, error: winErr }] = await Promise.all([
        supabase.from("draws").select("*").order("draw_month", { ascending: false }).limit(6),
        supabase.from("winners").select("*, draws(draw_month)").eq("user_id", DEMO_USER_ID),
      ]);

      setDraws(!drawErr && drawData && drawData.length ? (drawData as DrawResult[]) : MOCK_DRAWS);
      setWins(!winErr && winData && winData.length ? (winData as WinnerRecord[]) : MOCK_WINS);
      setLoading(false);
    })();
  }, []);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleProofUpload(winnerId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(winnerId);

    // In production: upload file to Supabase Storage, then update winner_verifications
    const { error } = await supabase
      .from("winner_verifications")
      .upsert([{ winner_id: winnerId, status: "pending", submitted_at: new Date().toISOString() }], { onConflict: "winner_id" });

    if (error) {
      showToast("Upload failed. Please try again.", "error");
    } else {
      showToast("Proof submitted — admin will review within 24 hours.", "success");
      setWins(prev => prev.map(w => w.id === winnerId ? { ...w, verification_status: "pending" } : w));
    }
    setUploading(null);
  }

  const totalWon = wins.filter(w => w.payment_status === "paid").reduce((s, w) => s + w.prize_amount, 0);
  const pendingPayout = wins.filter(w => w.payment_status !== "paid").reduce((s, w) => s + w.prize_amount, 0);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Winnings & Draws</h1>
          <p className="page-subtitle">Track your draw history, prizes, and verification status.</p>
        </div>
      </div>

      {toast && (
        <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"}`} style={{ marginBottom: "1.5rem" }}>
          {toast.type === "success" ? <CheckCircle size={16} style={{ flexShrink: 0 }} /> : <AlertCircle size={16} style={{ flexShrink: 0 }} />}
          {toast.msg}
        </div>
      )}

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
        <div className="stat-card">
          <p className="stat-label">Total Won</p>
          <p className="stat-value" style={{ color: "var(--accent)" }}>${totalWon.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending Payout</p>
          <p className="stat-value" style={{ color: "var(--warn)" }}>${pendingPayout.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Draws Entered</p>
          <p className="stat-value">{draws.length}</p>
        </div>
      </div>

      {/* Wins requiring action */}
      {wins.filter(w => w.verification_status === "unverified").length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: "1.5rem" }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>You have unclaimed prizes — please upload proof of your scores to receive your payout.</span>
        </div>
      )}

      {/* Wins table */}
      {wins.length > 0 && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="icon-box icon-box-yellow" style={{ width: 32, height: 32 }}><Trophy size={16} /></div>
            My Prizes
          </h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Draw Month</th>
                  <th>Match Type</th>
                  <th>Prize</th>
                  <th>Verification</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {wins.map(w => (
                  <tr key={w.id}>
                    <td>{w.draw_month ?? "—"}</td>
                    <td style={{ fontWeight: 600 }}>{matchLabel[w.match_type]}</td>
                    <td style={{ fontWeight: 700, color: "var(--accent)" }}>${w.prize_amount.toLocaleString()}</td>
                    <td>{statusBadge(w.verification_status)}</td>
                    <td>{statusBadge(w.payment_status)}</td>
                    <td>
                      {w.verification_status === "unverified" ? (
                        <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", display: "inline-flex", gap: "0.35rem" }}>
                          {uploading === w.id ? <><span className="animate-spin" style={{ width: 13, height: 13, border: "2px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", display: "inline-block" }} /> Uploading…</> : <><Upload size={13} /> Upload Proof</>}
                          <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => handleProofUpload(w.id, e)} />
                        </label>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>No action needed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Draw history */}
      <div className="card">
        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div className="icon-box icon-box-blue" style={{ width: 32, height: 32 }}><Clock size={16} /></div>
          Draw History
        </h2>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div className="animate-spin" style={{ width: 24, height: 24, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 0.75rem" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading draws…</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Drawn Numbers</th>
                  <th>Pool Total</th>
                  <th>Jackpot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {draws.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.draw_month}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                        {d.status === "published" ? d.numbers.map(n => (
                          <span key={n} style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>{n}</span>
                        )) : (
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>Not yet drawn</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>${d.pool_total.toLocaleString()}</td>
                    <td>{d.jackpot_amount > 0 ? <span style={{ color: "var(--warn)", fontWeight: 700 }}>${d.jackpot_amount.toLocaleString()} rolled</span> : <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                    <td>{d.status === "published" ? <span className="badge badge-green">Published</span> : <span className="badge badge-yellow">Upcoming</span>}</td>
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
