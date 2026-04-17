"use client";

import { useState, useEffect } from "react";
import { Heart, Plus, Edit2, Trash2, Search, X, CheckCircle, AlertCircle, Globe, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  supporters?: number;
  website?: string;
  active: boolean;
}

const MOCK_CHARITIES: Charity[] = [
  { id: "c1", name: "Global Clean Water Initiative", description: "Providing clean, safe drinking water to communities.", category: "Environment", supporters: 1240, website: "https://example.com", active: true },
  { id: "c2", name: "Children's Education Fund",      description: "Funding access to quality education for underprivileged children.", category: "Education", supporters: 892, active: true },
  { id: "c3", name: "Mental Health Alliance",         description: "Raising awareness and funding research for mental health.", category: "Health", supporters: 764, active: true },
  { id: "c4", name: "Ocean Plastic Recovery",         description: "Coordinating global efforts to remove plastic from oceans.", category: "Environment", supporters: 631, active: true },
  { id: "c5", name: "Hunger Relief Network",          description: "Delivering nutritious meals to families in crisis.", category: "Humanitarian", supporters: 1105, active: false },
];

const CATEGORIES = ["Environment", "Education", "Health", "Humanitarian"];

const EMPTY: Omit<Charity, "id"> = { name: "", description: "", category: CATEGORIES[0], website: "", supporters: 0, active: true };

type ModalMode = "add" | "edit" | null;

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState<ModalMode>(null);
  const [editing, setEditing]     = useState<Charity | null>(null);
  const [form, setForm]           = useState<Omit<Charity, "id">>(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("charities").select("*").order("name");
      setCharities(!error && data && data.length ? (data as Charity[]) : MOCK_CHARITIES);
      setLoading(false);
    })();
  }, []);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() {
    setForm(EMPTY);
    setEditing(null);
    setModal("add");
  }

  function openEdit(c: Charity) {
    setForm({ name: c.name, description: c.description, category: c.category, website: c.website ?? "", supporters: c.supporters ?? 0, active: c.active });
    setEditing(c);
    setModal("edit");
  }

  async function handleSave() {
    if (!form.name.trim() || !form.description.trim()) {
      showToast("Name and description are required.", "error");
      return;
    }
    setSaving(true);

    if (modal === "add") {
      const { data, error } = await supabase.from("charities").insert([form]).select().single();
      if (error || !data) {
        // Optimistic local add for demo
        const newC = { ...form, id: crypto.randomUUID() } as Charity;
        setCharities(prev => [newC, ...prev]);
        showToast("Charity added (demo mode).", "success");
      } else {
        setCharities(prev => [data as Charity, ...prev]);
        showToast("Charity added successfully.", "success");
      }
    } else if (modal === "edit" && editing) {
      const { error } = await supabase.from("charities").update(form).eq("id", editing.id);
      setCharities(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
      showToast(error ? "Saved locally (DB update optional)." : "Charity updated.", "success");
    }
    setSaving(false);
    setModal(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this charity from the directory?")) return;
    await supabase.from("charities").delete().eq("id", id);
    setCharities(prev => prev.filter(c => c.id !== id));
    showToast("Charity removed.", "success");
  }

  async function toggleActive(c: Charity) {
    await supabase.from("charities").update({ active: !c.active }).eq("id", c.id);
    setCharities(prev => prev.map(x => x.id === c.id ? { ...x, active: !x.active } : x));
  }

  const filtered = charities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ width: "100%" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Charity Management</h1>
          <p className="page-subtitle">Add, edit, and manage the charity directory listing.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Charity
        </button>
      </div>

      {toast && (
        <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"}`} style={{ marginBottom: "1.5rem" }}>
          {toast.type === "success" ? <CheckCircle size={16} style={{ flexShrink: 0 }} /> : <AlertCircle size={16} style={{ flexShrink: 0 }} />}
          {toast.msg}
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", maxWidth: "380px", marginBottom: "1.5rem" }}>
        <Search size={15} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input className="form-input" placeholder="Search charities…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }} />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center" }}>
          <div className="animate-spin" style={{ width: 28, height: 28, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 0.75rem" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading charities…</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {filtered.map(c => (
            <div key={c.id} className="card" style={{ opacity: c.active ? 1 : 0.55, position: "relative" }}>
              {!c.active && (
                <div style={{ position: "absolute", top: "0.85rem", right: "0.85rem" }}>
                  <span className="badge badge-gray">Inactive</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div className="icon-box icon-box-green"><Heart size={16} /></div>
                <span className="badge badge-gray">{c.category}</span>
              </div>
              <h3 style={{ fontSize: "0.975rem", fontWeight: 700, marginBottom: "0.5rem" }}>{c.name}</h3>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "0.85rem" }}>{c.description}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Users size={12} /> {(c.supporters ?? 0).toLocaleString()} supporters
                </p>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <button onClick={() => toggleActive(c)} className="btn btn-secondary btn-sm" title={c.active ? "Deactivate" : "Activate"}>
                    {c.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => openEdit(c)} className="btn btn-secondary btn-sm"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div className="card" style={{ width: "100%", maxWidth: "520px", boxShadow: "var(--shadow-xl)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{modal === "add" ? "Add New Charity" : "Edit Charity"}</h2>
              <button onClick={() => setModal(null)} className="btn btn-ghost btn-sm"><X size={18} /></button>
            </div>

            <div className="form-group">
              <label className="form-label">Charity Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Global Clean Water Initiative" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of the charity's mission." style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Active</label>
                <select className="form-select form-input" value={form.active ? "yes" : "no"} onChange={e => setForm(f => ({ ...f, active: e.target.value === "yes" }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Website URL (optional)</label>
              <input className="form-input" type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : modal === "add" ? "Add Charity" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
