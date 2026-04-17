"use client";

import { useState, useEffect } from "react";
import { Activity, Plus, Trash2, Info, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Score {
  id: string;
  date: string;
  score: number;
  user_id?: string;
}

const MOCK_SCORES: Score[] = [
  { id: "1", date: "2026-04-12", score: 36 },
  { id: "2", date: "2026-04-05", score: 34 },
  { id: "3", date: "2026-03-28", score: 38 },
  { id: "4", date: "2026-03-15", score: 32 },
  { id: "5", date: "2026-03-02", score: 40 },
];

// In production, replace with the real authenticated user id from Supabase Auth
const DEMO_USER_ID = "demo-user-001";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function ScoresPage() {
  const [scores, setScores]   = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm]       = useState({ date: "", score: "" });

  /* ── load scores from DB ── */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("golf_scores")
        .select("*")
        .eq("user_id", DEMO_USER_ID)
        .order("date", { ascending: false })
        .limit(5);

      setScores(!error && data && data.length ? (data as Score[]) : MOCK_SCORES);
      setLoading(false);
    })();
  }, []);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* ── save / upsert ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const scoreNum = parseInt(form.score);
    if (!form.date || isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      showToast("Score must be between 1 and 45.", "error");
      return;
    }

    setSaving(true);

    // Check for duplicate date
    const duplicate = scores.find(s => s.date === form.date);

    if (duplicate) {
      // Update existing record (same date policy)
      const { error } = await supabase
        .from("golf_scores")
        .update({ score: scoreNum })
        .eq("id", duplicate.id);

      if (error) {
        showToast("Failed to update score. Please try again.", "error");
      } else {
        setScores(prev => prev.map(s => s.date === form.date ? { ...s, score: scoreNum } : s));
        showToast("Score updated for existing date.", "success");
      }
    } else {
      // Insert new score; enforce 5-score rolling window
      const newEntry: Score = {
        id: crypto.randomUUID(),
        date: form.date,
        score: scoreNum,
        user_id: DEMO_USER_ID,
      };

      const { error } = await supabase.from("golf_scores").insert([{
        id: newEntry.id,
        user_id: DEMO_USER_ID,
        date: form.date,
        score: scoreNum,
      }]);

      if (error) {
        showToast("Failed to save score. Please try again.", "error");
      } else {
        let updated = [newEntry, ...scores.filter(s => s.date !== form.date)]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Delete oldest if over 5
        if (updated.length > 5) {
          const dropped = updated.slice(5);
          updated = updated.slice(0, 5);
          await supabase.from("golf_scores").delete().in("id", dropped.map(d => d.id));
        }

        setScores(updated);
        showToast("Score saved successfully.", "success");
      }
    }

    setForm({ date: "", score: "" });
    setSaving(false);
  }

  /* ── delete ── */
  async function handleDelete(id: string) {
    const { error } = await supabase.from("golf_scores").delete().eq("id", id);
    if (error) {
      showToast("Failed to delete score.", "error");
    } else {
      setScores(prev => prev.filter(s => s.id !== id));
      showToast("Score removed.", "success");
    }
  }

  const avg = scores.length
    ? (scores.reduce((s, e) => s + e.score, 0) / scores.length).toFixed(1)
    : "—";

  return (
    <div style={{ width: "100%" }}>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Score Management</h1>
          <p className="page-subtitle">Manage your rolling Stableford scores. Only your latest 5 are kept.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Rolling avg</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>{avg}</p>
          </div>
          <div className="icon-box icon-box-blue"><Activity size={20} /></div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"}`} style={{ marginBottom: "1.5rem" }}>
          {toast.type === "success" ? <CheckCircle size={16} style={{ flexShrink: 0 }} /> : <AlertCircle size={16} style={{ flexShrink: 0 }} />}
          {toast.msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", alignItems: "start" }}>

        {/* Entry form */}
        <div className="card">
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="icon-box icon-box-blue" style={{ width: 32, height: 32 }}><Plus size={16} /></div>
            Log a Score
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="score-date">Date Played</label>
              <input
                id="score-date"
                type="date"
                className="form-input"
                required
                value={form.date}
                max={new Date().toISOString().split("T")[0]}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="score-val">Stableford Score</label>
              <input
                id="score-val"
                type="number"
                className="form-input"
                placeholder="1 – 45"
                min={1} max={45}
                required
                value={form.score}
                onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
              />
              <p className="form-hint">Range: 1 to 45 points</p>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: "center", marginTop: "0.5rem" }} disabled={saving}>
              {saving
                ? <><span className="animate-spin" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} /> Saving…</>
                : "Save Score"
              }
            </button>
          </form>

          <div className="alert alert-info" style={{ marginTop: "1.25rem" }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
            <p style={{ fontSize: "0.8rem" }}>One score per date. Entering a duplicate date updates the existing entry. A new score beyond 5 drops your oldest automatically.</p>
          </div>
        </div>

        {/* Score list */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Rolling Scores — Last 5</h2>
            <span className="badge badge-blue">{scores.length} / 5 slots used</span>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <div className="animate-spin" style={{ width: 28, height: 28, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 0.75rem" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading from database…</p>
            </div>
          ) : scores.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <Activity size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.4 }} />
              <p>No scores logged yet. Add your first score to enter the draw.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {scores.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0.9rem 1.1rem",
                    background: i === 0 ? "var(--brand-light)" : "var(--bg-subtle)",
                    borderRadius: "var(--radius-md)",
                    border: i === 0 ? "1px solid #bfdbfe" : "1px solid var(--border)",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{fmtDate(s.date)}</p>
                    {i === 0 && <span className="badge badge-blue" style={{ marginTop: "0.3rem" }}>Most Recent</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--brand)" }}>{s.score}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}> pts</span>
                    </div>
                    <button
                      onClick={() => handleDelete(s.id)}
                      style={{ padding: "0.4rem", borderRadius: "6px", color: "var(--danger)", background: "var(--danger-light)", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                      title="Delete score"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
