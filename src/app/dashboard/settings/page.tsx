"use client";

import { useState } from "react";
import { User, Bell, Lock, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

interface Tab { id: string; label: string; icon: React.ReactNode }
const TABS: Tab[] = [
  { id: "profile",       label: "Profile",       icon: <User size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "password",      label: "Password",      icon: <Lock size={16} /> },
  { id: "billing",       label: "Billing",       icon: <CreditCard size={16} /> },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [profile, setProfile] = useState({ first: "Alex", last: "Morgan", email: "alex.morgan@example.com", phone: "+44 7700 900123" });
  const [notifs, setNotifs]   = useState({ drawResults: true, winnerAlerts: true, charityUpdates: false, marketing: false });
  const [pwForm, setPwForm]   = useState({ current: "", newPw: "", confirm: "" });

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    // In production: supabase.from('users').update(profile).eq('id', userId)
    showToast("Profile updated successfully.", "success");
  }

  function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      showToast("New passwords do not match.", "error");
      return;
    }
    if (pwForm.newPw.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }
    // In production: supabase.auth.updateUser({ password: pwForm.newPw })
    showToast("Password updated successfully.", "success");
    setPwForm({ current: "", newPw: "", confirm: "" });
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Account Settings</h1>
          <p className="page-subtitle">Manage your profile, notifications, password, and billing.</p>
        </div>
      </div>

      {toast && (
        <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"}`} style={{ marginBottom: "1.5rem" }}>
          {toast.type === "success" ? <CheckCircle size={16} style={{ flexShrink: 0 }} /> : <AlertCircle size={16} style={{ flexShrink: 0 }} />}
          {toast.msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
        {/* Tab nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`sidebar-link${tab === t.id ? " active" : ""}`}
              style={{ textAlign: "left", width: "100%" }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="card">
          {tab === "profile" && (
            <form onSubmit={handleProfileSave}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.5rem" }}>Profile Information</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" value={profile.first} onChange={e => setProfile(p => ({ ...p, first: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" value={profile.last} onChange={e => setProfile(p => ({ ...p, last: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary">Save Profile</button>
            </form>
          )}

          {tab === "notifications" && (
            <div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.5rem" }}>Notification Preferences</h2>
              {[
                { key: "drawResults",    label: "Monthly Draw Results",       desc: "Get notified when draw results are published." },
                { key: "winnerAlerts",   label: "Winner Alerts",              desc: "Receive emails when you win a prize." },
                { key: "charityUpdates", label: "Charity Impact Updates",     desc: "News and updates from your chosen charity." },
                { key: "marketing",      label: "Platform News & Promotions", desc: "FairPlay product updates and offers." },
              ].map(n => (
                <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1.1rem 0", borderBottom: "1px solid var(--border)", gap: "1rem" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{n.label}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{n.desc}</p>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={notifs[n.key as keyof typeof notifs]}
                      onChange={e => setNotifs(p => ({ ...p, [n.key]: e.target.checked }))}
                      style={{ width: 18, height: 18, accentColor: "var(--brand)" }}
                    />
                  </label>
                </div>
              ))}
              <button className="btn btn-primary mt-6" onClick={() => showToast("Notification preferences saved.", "success")}>Save Preferences</button>
            </div>
          )}

          {tab === "password" && (
            <form onSubmit={handlePasswordSave}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.5rem" }}>Change Password</h2>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" value={pwForm.newPw} onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))} required />
                <p className="form-hint">Minimum 8 characters.</p>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          )}

          {tab === "billing" && (
            <div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.5rem" }}>Billing & Subscription</h2>
              <div className="card card-flat" style={{ background: "var(--bg-subtle)", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Current Plan</p>
                <p style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: "0.25rem" }}>Monthly — £9.99/mo</p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Next billing date: 15 May 2026</p>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                  <button className="btn btn-secondary btn-sm">Switch to Yearly (Save 20%)</button>
                  <button className="btn btn-danger btn-sm">Cancel Subscription</button>
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.75rem" }}>Payment Method</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--bg-surface)" }}>
                  <CreditCard size={20} color="var(--text-secondary)" />
                  <span style={{ fontSize: "0.9rem" }}>Visa ending •••• 4242</span>
                  <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}>Update</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
