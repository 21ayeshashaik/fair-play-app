"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Eye, EyeOff, ShieldAlert, AlertCircle } from "lucide-react";
import Link from "next/link";

const ADMIN_CREDENTIALS = {
  email: "admin@fairplay.com",
  password: "Admin@FairPlay2026",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      // In production: verify via Supabase auth / JWT
      localStorage.setItem("fp_admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Invalid credentials. Please check your email and password.");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>


        {/* Card */}
        <div className="card" style={{ padding: "2.5rem", boxShadow: "var(--shadow-lg)" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div className="icon-box icon-box-blue">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Admin Login</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem" }}>Restricted access — authorised staff only</p>
            </div>
          </div>

          <hr className="divider" />

          {/* Test creds hint */}
          <div className="alert alert-info" style={{ marginBottom: "1.5rem" }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p className="font-semibold" style={{ marginBottom: "0.2rem" }}>Test Credentials</p>
              <p className="text-sm" style={{ fontFamily: "monospace" }}>admin@fairplay.com</p>
              <p className="text-sm" style={{ fontFamily: "monospace" }}>Admin@FairPlay2026</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: "1.25rem" }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Email Address</label>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                placeholder="admin@fairplay.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", padding: "0.25rem" }}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              style={{ marginTop: "0.5rem", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="animate-spin" style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />
                  Authenticating…
                </span>
              ) : "Sign In to Admin Panel"}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Not an admin?{" "}
          <Link href="/" style={{ color: "var(--brand)", fontWeight: 600 }}>Back to site</Link>
        </p>
      </div>
    </div>
  );
}
