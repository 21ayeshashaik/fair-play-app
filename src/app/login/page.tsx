"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
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

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Email not confirmed")) {
          throw new Error("Please check your email and confirm your account before logging in.");
        }
        throw authError;
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Welcome back</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Log in to manage your scores and charities</p>
        </div>

        <div className="card" style={{ padding: "2.5rem", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div className="icon-box icon-box-blue">
              <LogIn size={20} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem" }}>Member Login</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Access your player dashboard</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: "1.25rem" }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                <Link href="#" style={{ fontSize: "0.75rem", color: "var(--brand)", fontWeight: 600 }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
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
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input type="checkbox" id="remember" style={{ width: "16px", height: "16px", accentColor: "var(--brand)" }} />
              <label htmlFor="remember" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              style={{ justifyContent: "center", padding: "1rem" }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="animate-spin" style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />
                  Signing in…
                </span>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Lock size={16} color="var(--text-muted)" />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Secure SSL encrypted connection.
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          New to FairPlay?{" "}
          <Link href="/signup" style={{ color: "var(--brand)", fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
