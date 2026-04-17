"use client";

import { useState, useEffect } from "react";
import { Heart, Search, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  supporters?: number;
}

const MOCK_CHARITIES: Charity[] = [
  { id: "c1", name: "Global Clean Water Initiative", description: "Providing clean, safe drinking water to communities across Sub-Saharan Africa and South Asia.", category: "Environment", supporters: 1240 },
  { id: "c2", name: "Children's Education Fund", description: "Funding access to quality education for underprivileged children in over 30 countries.", category: "Education", supporters: 892 },
  { id: "c3", name: "Mental Health Alliance", description: "Raising awareness, reducing stigma, and funding research for mental health conditions worldwide.", category: "Health", supporters: 764 },
  { id: "c4", name: "Ocean Plastic Recovery", description: "Coordinating global efforts to remove plastic waste from the world's oceans.", category: "Environment", supporters: 631 },
  { id: "c5", name: "Hunger Relief Network", description: "Delivering nutritious meals and sustainable food programs to families in crisis.", category: "Humanitarian", supporters: 1105 },
  { id: "c6", name: "Reforestation Trust", description: "Planting native trees and restoring natural habitats across deforested regions.", category: "Environment", supporters: 488 },
];

const DEMO_USER_ID = "demo-user-001";
const DEMO_SELECTED_CHARITY_ID = "c1";

const categories = ["All", "Environment", "Education", "Health", "Humanitarian"];

export default function CharityPage() {
  const [charities, setCharities]         = useState<Charity[]>([]);
  const [loading, setLoading]             = useState(true);
  const [selectedId, setSelectedId]       = useState<string>(DEMO_SELECTED_CHARITY_ID);
  const [contribution, setContribution]   = useState(15); // percentage
  const [saving, setSaving]               = useState(false);
  const [toast, setToast]                 = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [search, setSearch]               = useState("");
  const [category, setCategory]           = useState("All");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("charities")
        .select("*")
        .order("name");

      setCharities(!error && data && data.length ? (data as Charity[]) : MOCK_CHARITIES);
      setLoading(false);
    })();
  }, []);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    if (contribution < 10) {
      showToast("Minimum contribution is 10% of your subscription.", "error");
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from("charity_selections")
      .upsert([{ user_id: DEMO_USER_ID, charity_id: selectedId, contribution_pct: contribution }], { onConflict: "user_id" });

    if (error) {
      showToast("Failed to save your selection. Please try again.", "error");
    } else {
      showToast("Charity selection saved successfully.", "success");
    }
    setSaving(false);
  }

  const filtered = charities.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "All" || c.category === category;
    return matchSearch && matchCat;
  });

  const selected = charities.find(c => c.id === selectedId);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Charity & Impact</h1>
          <p className="page-subtitle">Select the cause you want to support with every subscription.</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"}`} style={{ marginBottom: "1.5rem" }}>
          {toast.type === "success" ? <CheckCircle size={16} style={{ flexShrink: 0 }} /> : <AlertCircle size={16} style={{ flexShrink: 0 }} />}
          {toast.msg}
        </div>
      )}

      {/* Current selection summary */}
      {selected && (
        <div className="card card-flat" style={{ background: "var(--brand-light)", border: "1px solid #bfdbfe", marginBottom: "2rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div className="icon-box icon-box-blue"><Heart size={20} /></div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--brand)", marginBottom: "0.2rem" }}>Currently Supporting</p>
            <p style={{ fontWeight: 700, fontSize: "1.05rem" }}>{selected.name}</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{contribution}% of your subscription • auto-allocated each cycle</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.3rem" }}>
                Contribution (min 10%)
              </label>
              <input
                type="number" min={10} max={100}
                value={contribution}
                onChange={e => setContribution(Number(e.target.value))}
                className="form-input"
                style={{ width: "100px", textAlign: "center" }}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ alignSelf: "flex-end" }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search charities…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn btn-sm ${category === cat ? "btn-primary" : "btn-secondary"}`}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Charity grid */}
      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <div className="animate-spin" style={{ width: 28, height: 28, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 0.75rem" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading charities from database…</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {filtered.map(c => (
            <div
              key={c.id}
              className="card"
              onClick={() => setSelectedId(c.id)}
              style={{
                cursor: "pointer",
                border: selectedId === c.id ? "2px solid var(--brand)" : "1px solid var(--border)",
                background: selectedId === c.id ? "var(--brand-light)" : "var(--bg-surface)",
                position: "relative",
                transition: "all 0.2s ease",
              }}
            >
              {selectedId === c.id && (
                <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                  <CheckCircle size={20} color="var(--brand)" />
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div className="icon-box icon-box-green"><Heart size={16} /></div>
                <span className="badge badge-gray">{c.category}</span>
              </div>
              <h3 style={{ fontSize: "0.975rem", fontWeight: 700, marginBottom: "0.5rem" }}>{c.name}</h3>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "0.75rem" }}>{c.description}</p>
              {c.supporters && (
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {c.supporters.toLocaleString()} FairPlay supporters
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
