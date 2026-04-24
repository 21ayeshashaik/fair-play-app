"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create profile in our 'users' table
        // Note: In a real app, you'd use a Supabase trigger to do this automatically
        // But for this demo, we'll do it manually or assume the trigger exists.
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              first_name: firstName,
              last_name: lastName,
              email: email,
              plan: 'monthly',
              status: 'active',
            },
          ]);

        if (profileError) throw profileError;

        if (authData.session) {
           window.location.href = "/dashboard";
        } else {
           // Confirmation email sent
           setSuccess(true);
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Create your account</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Join thousands of golfers winning every month</p>
        </div>

        <div className="card" style={{ padding: "2.5rem", boxShadow: "var(--shadow-lg)" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
               <div className="icon-box icon-box-green" style={{ margin: "0 auto 1.5rem", width: "60px", height: "60px" }}>
                 <CheckCircle2 size={32} />
               </div>
               <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.75rem" }}>Check your email!</h2>
               <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                 We've sent a verification link to <strong>{email}</strong>. <br/>
                 Please click the link to activate your account and start playing.
               </p>
               <Link href="/login" className="btn btn-primary w-full" style={{ justifyContent: "center" }}>
                 Go to Login
               </Link>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div className="icon-box icon-box-green">
                  <UserPlus size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "1rem" }}>Member Registration</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Step 1: Account setup</p>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" style={{ marginBottom: "1.25rem" }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="first-name">First Name</label>
                    <input
                      id="first-name"
                      type="text"
                      className="form-input"
                      placeholder="John"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="last-name">Last Name</label>
                    <input
                      id="last-name"
                      type="text"
                      className="form-input"
                      placeholder="Doe"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

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
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="password"
                      type={showPass ? "text" : "password"}
                      className="form-input"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={8}
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

                <div style={{ background: "var(--bg-subtle)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <CheckCircle2 size={16} color="var(--brand)" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      By signing up, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>. You can cancel your subscription at any time.
                    </p>
                  </div>
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
                      Creating account…
                    </span>
                  ) : (
                    <>Create Account <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--brand)", fontWeight: 700 }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}
