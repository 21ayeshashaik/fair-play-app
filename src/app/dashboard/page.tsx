"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  Heart, Trophy, CreditCard, Activity, ArrowRight,
  CheckCircle, Clock, TrendingUp, AlertCircle, Sparkles
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Score {
  id: string;
  date: string;
  score: number;
}

const MOCK_SCORES: Score[] = [
  { id: "1", date: "2026-04-12", score: 36 },
  { id: "2", date: "2026-04-05", score: 34 },
  { id: "3", date: "2026-03-28", score: 38 },
  { id: "4", date: "2026-03-15", score: 32 },
  { id: "5", date: "2026-03-02", score: 40 },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function avg(scores: Score[]) {
  if (!scores.length) return 0;
  return (scores.reduce((s, e) => s + e.score, 0) / scores.length).toFixed(1);
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const isSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    (async () => {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      const { data, error } = await supabase
        .from("golf_scores")
        .select("*")
        .order("date", { ascending: false })
        .limit(5);

      setScores(!error && data && data.length ? (data as Score[]) : MOCK_SCORES);
      setLoading(false);
    })();
  }, []);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      alert("Stripe Demo: You need to add your STRIPE_SECRET_KEY to .env.local to launch the real checkout window.\n\nError: " + err.message);
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back — here's your current activity snapshot.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={handleCheckout} 
            disabled={checkoutLoading}
            className="btn btn-primary" 
            style={{ background: "linear-gradient(135deg, var(--brand), #4338ca)", boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)" }}
          >
            {checkoutLoading ? "Preparing..." : <><Sparkles size={16} /> Go Pro</>}
          </button>
          <Link href="/dashboard/scores" className="btn btn-secondary">
            Log Score <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {isSuccess && (
        <div className="alert alert-success" style={{ marginBottom: "2rem", animation: "slideDown 0.5s ease-out" }}>
          <CheckCircle size={20} />
          <div>
            <p style={{ fontWeight: 700 }}>Payment Successful!</p>
            <p style={{ fontSize: "0.85rem" }}>Welcome to FairPlay Pro. Your subscription is now active.</p>
          </div>
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {/* Subscription */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div className="icon-box icon-box-blue"><CreditCard size={18} /></div>
            <span className="badge badge-green">Active</span>
          </div>
          <p className="stat-label">Subscription</p>
          <p className="stat-value" style={{ fontSize: "1.25rem", marginBottom: "0.35rem" }}>Monthly Plan</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Renews 15 May 2026</p>
          <button className="btn btn-secondary btn-sm mt-4">Manage</button>
        </div>

        {/* Charity */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div className="icon-box icon-box-green"><Heart size={18} /></div>
            <span className="badge badge-green">15% allocated</span>
          </div>
          <p className="stat-label">Your Charity</p>
          <p className="stat-value" style={{ fontSize: "1.1rem", lineHeight: 1.3, marginBottom: "0.35rem" }}>Global Clean Water Initiative</p>
          <Link href="/dashboard/charity" className="btn btn-secondary btn-sm mt-4" style={{ display: "inline-flex" }}>Change</Link>
        </div>

        {/* Avg score */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div className="icon-box icon-box-yellow"><TrendingUp size={18} /></div>
          </div>
          <p className="stat-label">Rolling Average</p>
          <p className="stat-value">{loading ? "—" : avg(scores)}</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.35rem" }}>Stableford pts (last 5 rounds)</p>
        </div>

        {/* Winnings */}
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div className="icon-box icon-box-yellow"><Trophy size={18} /></div>
            <span className="badge badge-blue">Entered</span>
          </div>
          <p className="stat-label">Total Winnings</p>
          <p className="stat-value">$0.00</p>
          <Link href="/dashboard/winnings" className="btn btn-secondary btn-sm mt-4" style={{ display: "inline-flex" }}>Draws History</Link>
        </div>
      </div>

      {/* Scores table */}
      <div className="card" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.2rem" }}>Rolling Scores</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Your last 5 scores form your entry sequence for the next monthly draw.
              Only one score per date is permitted.
            </p>
          </div>
          <Link href="/dashboard/scores" className="btn btn-secondary btn-sm">
            <Activity size={14} /> Manage Scores
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: "2.5rem", textAlign: "center" }}>
            <div className="animate-spin" style={{ width: 28, height: 28, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 0.75rem" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading scores…</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date Played</th>
                  <th>Stableford Score</th>
                  <th>Draw Status</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>{i + 1}</td>
                    <td>{fmtDate(s.date)}</td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--brand)" }}>{s.score}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}> pts</span>
                    </td>
                    <td>
                      <span className="badge badge-green">
                        <CheckCircle size={11} /> Entered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Next draw info */}
      <div className="card card-flat mt-4" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem" }}>
        <div className="icon-box icon-box-blue"><Clock size={18} /></div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Next Monthly Draw</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Scheduled for 1 May 2026 — 14 days remaining</p>
        </div>
        <Link href="/dashboard/winnings" className="btn btn-secondary btn-sm">View Details</Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: "2.5rem", textAlign: "center" }}>
        <div className="animate-spin" style={{ width: 28, height: 28, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 0.75rem" }} />
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Initializing dashboard...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
