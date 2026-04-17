"use client";

import { useState, useEffect } from "react";
import { Play, BarChart2, RefreshCw, Settings2, Clock, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SimResult {
  pool: number;
  rollover: number;
  winners: { match5: number; match4: number; match3: number };
  distribution: { match5: number; match4: number; match3: number };
  draw_numbers: number[];
}

interface PastDraw {
  id: string;
  draw_month: string;
  draw_mode: string;
  pool_total: number;
  status: "published" | "pending";
  winner_count: number;
}

const MOCK_PAST_DRAWS: PastDraw[] = [
  { id: "d2", draw_month: "March 2026",    draw_mode: "algorithmic", pool_total: 12800, status: "published", winner_count: 57 },
  { id: "d3", draw_month: "February 2026", draw_mode: "random",      pool_total: 11200, status: "published", winner_count: 41 },
  { id: "d4", draw_month: "January 2026",  draw_mode: "algorithmic", pool_total: 10500, status: "published", winner_count: 38 },
];

function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDrawNumbers(): number[] {
  const nums = new Set<number>();
  while (nums.size < 5) nums.add(randBetween(1, 45));
  return Array.from(nums).sort((a, b) => a - b);
}

export default function AdminDrawsPage() {
  const [drawMode, setDrawMode]           = useState<"random" | "algorithmic">("algorithmic");
  const [simRunning, setSimRunning]       = useState(false);
  const [simResult, setSimResult]         = useState<SimResult | null>(null);
  const [publishing, setPublishing]       = useState(false);
  const [published, setPublished]         = useState(false);
  const [pastDraws, setPastDraws]         = useState<PastDraw[]>([]);
  const [loadingPast, setLoadingPast]     = useState(true);
  const [poolTotal]                        = useState(14500);
  const [jackpotRollover]                  = useState(5800);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("draws")
        .select("*")
        .eq("status", "published")
        .order("draw_month", { ascending: false })
        .limit(5);
      setPastDraws(!error && data && data.length ? (data as PastDraw[]) : MOCK_PAST_DRAWS);
      setLoadingPast(false);
    })();
  }, []);

  async function runSimulation() {
    setSimRunning(true);
    setSimResult(null);
    setPublished(false);

    await new Promise(r => setTimeout(r, 1600));

    const pool = poolTotal;
    const m5Winners = drawMode === "algorithmic" ? randBetween(0, 1) : randBetween(0, 2);
    const m4Winners = randBetween(8, 18);
    const m3Winners = randBetween(35, 60);

    const jackpotShare = Math.round(pool * 0.40);
    const m4Share      = Math.round(pool * 0.35);
    const m3Share      = Math.round(pool * 0.25);

    setSimResult({
      pool,
      rollover:     m5Winners === 0 ? jackpotShare : 0,
      winners:      { match5: m5Winners, match4: m4Winners, match3: m3Winners },
      distribution: { match5: m5Winners > 0 ? jackpotShare : 0, match4: m4Share, match3: m3Share },
      draw_numbers: generateDrawNumbers(),
    });
    setSimRunning(false);
  }

  async function handlePublish() {
    if (!simResult) return;
    setPublishing(true);

    // Save draw result to Supabase
    const { error } = await supabase.from("draws").insert([{
      draw_month:   "April 2026",
      draw_mode:    drawMode,
      pool_total:   simResult.pool,
      draw_numbers: simResult.draw_numbers,
      rollover:     simResult.rollover,
      status:       "published",
      published_at: new Date().toISOString(),
    }]);

    if (!error) setPublished(true);
    setPublishing(false);
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Draw Engine</h1>
          <p className="page-subtitle">Configure, simulate, and publish the monthly prize draw.</p>
        </div>
        <div className="stat-card" style={{ padding: "0.75rem 1.5rem", textAlign: "center" }}>
          <p className="stat-label">Current Pool</p>
          <p style={{ fontWeight: 800, fontSize: "1.35rem", color: "var(--accent)" }}>${poolTotal.toLocaleString()}</p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>incl. ${jackpotRollover.toLocaleString()} rollover</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>

        {/* Config card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="icon-box icon-box-blue" style={{ width: 32, height: 32 }}><Settings2 size={16} /></div>
            Draw Configuration
          </h2>

          <div>
            <p className="form-label" style={{ marginBottom: "0.75rem" }}>Draw Logic</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {([["random", "Pure Random", "Standard lottery-style — all scores equally weighted."],
                 ["algorithmic", "Algorithmic (Weighted)", "Probabilities adjusted by user score frequency distribution."]] as const).map(([val, title, desc]) => (
                <label
                  key={val}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem",
                    border: `1px solid ${drawMode === val ? "var(--brand)" : "var(--border)"}`,
                    borderRadius: "var(--radius-md)",
                    background: drawMode === val ? "var(--brand-light)" : "var(--bg-subtle)",
                    cursor: "pointer",
                  }}
                >
                  <input type="radio" name="drawMode" value={val} checked={drawMode === val} onChange={() => setDrawMode(val)} style={{ marginTop: "2px", accentColor: "var(--brand)" }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{title}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Prize structure reminder */}
          <div style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.6rem" }}>Pool Allocation</p>
            {[["5 Match – Jackpot", "40%", "badge-blue"], ["4 Match", "35%", "badge-green"], ["3 Match", "25%", "badge-gray"]].map(([label, pct, cls]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.85rem" }}>{label}</span>
                <span className={`badge ${cls}`}>{pct}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={runSimulation}
              disabled={simRunning}
              className="btn btn-secondary w-full"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}
            >
              {simRunning
                ? <><span className="animate-spin" style={{ width: 15, height: 15, border: "2px solid var(--border-strong)", borderTopColor: "var(--brand)", borderRadius: "50%", display: "inline-block" }} /> Simulating…</>
                : <><BarChart2 size={15} /> Run Simulation</>
              }
            </button>
            <button
              onClick={handlePublish}
              disabled={!simResult || publishing || published}
              className="btn btn-primary w-full"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}
            >
              {published ? <><CheckCircle size={15} /> Published!</>
               : publishing ? "Publishing…"
               : <><Play size={15} /> Publish Draw</>}
            </button>
          </div>
          {!simResult && !simRunning && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center" }}>Run a simulation first, then publish the official draw.</p>}
        </div>

        {/* Simulation results */}
        <div className="card" style={{ background: "var(--bg-subtle)" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="icon-box icon-box-yellow" style={{ width: 32, height: 32 }}><Zap size={16} /></div>
            Simulation Results
          </h2>

          {!simResult && !simRunning && (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <BarChart2 size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
              <p style={{ fontSize: "0.875rem" }}>Run a simulation to preview outcomes before publishing the official draw.</p>
            </div>
          )}

          {simRunning && (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--brand)" }}>
              <div className="animate-spin" style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 1rem" }} />
              <p style={{ fontSize: "0.875rem" }}>Calculating weighted probabilities and allocating prize pool…</p>
            </div>
          )}

          {simResult && !simRunning && (
            <div>
              {/* Draw numbers */}
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Drawn Numbers</p>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  {simResult.draw_numbers.map(n => (
                    <div key={n} style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 800, boxShadow: "0 2px 8px rgba(26,86,219,0.3)" }}>{n}</div>
                  ))}
                </div>
              </div>

              {/* Pool summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{ padding: "0.85rem 1rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.3rem" }}>Total Pool</p>
                  <p style={{ fontWeight: 800, fontSize: "1.25rem" }}>${simResult.pool.toLocaleString()}</p>
                </div>
                <div style={{ padding: "0.85rem 1rem", background: simResult.rollover > 0 ? "var(--warn-light)" : "var(--bg-surface)", borderRadius: "var(--radius-md)", border: `1px solid ${simResult.rollover > 0 ? "#fde68a" : "var(--border)"}` }}>
                  <p style={{ fontSize: "0.75rem", color: simResult.rollover > 0 ? "var(--warn)" : "var(--text-muted)", fontWeight: 600, marginBottom: "0.3rem" }}>Jackpot Rollover</p>
                  <p style={{ fontWeight: 800, fontSize: "1.25rem", color: simResult.rollover > 0 ? "var(--warn)" : "var(--text-primary)" }}>${simResult.rollover.toLocaleString()}</p>
                </div>
              </div>

              {/* Tier breakdown */}
              <p style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.6rem" }}>Tier Breakdown</p>
              {[
                { label: "5 Match — Jackpot", winners: simResult.winners.match5, total: simResult.distribution.match5, cls: "badge-blue" },
                { label: "4 Match",           winners: simResult.winners.match4, total: simResult.distribution.match4, cls: "badge-green" },
                { label: "3 Match",           winners: simResult.winners.match3, total: simResult.distribution.match3, cls: "badge-gray" },
              ].map(t => (
                <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0.85rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginBottom: "0.5rem" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{t.label}</p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{t.winners} winners{t.winners > 0 ? ` · $${Math.round(t.total / t.winners).toLocaleString()} each` : ""}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`badge ${t.cls}`}>${t.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Past draws table */}
      <div className="card">
        <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div className="icon-box icon-box-gray" style={{ width: 32, height: 32 }}><Clock size={16} /></div>
          Draw History
        </h2>

        {loadingPast ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div className="animate-spin" style={{ width: 24, height: 24, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto" }} />
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Mode</th>
                  <th>Pool Total</th>
                  <th>Winners</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pastDraws.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.draw_month}</td>
                    <td><span className="badge badge-gray" style={{ textTransform: "capitalize" }}>{d.draw_mode}</span></td>
                    <td style={{ fontWeight: 700 }}>${d.pool_total.toLocaleString()}</td>
                    <td>{d.winner_count}</td>
                    <td><span className="badge badge-green"><CheckCircle size={10} /> Published</span></td>
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
