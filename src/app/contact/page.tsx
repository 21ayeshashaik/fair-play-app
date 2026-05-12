"use client";

import { useState } from "react";
import { Heart, Send, ArrowLeft, CheckCircle2, Globe, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card text-center animate-fade-in-up" style={{ maxWidth: "500px", padding: "3rem" }}>
          <div className="icon-box icon-box-green" style={{ width: "64px", height: "64px", margin: "0 auto 1.5rem" }}>
            <CheckCircle2 size={32} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem" }}>Nomination Received!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.6 }}>
            Thank you for suggesting a cause. Our team will review the charity and reach out if we need more information or once they've been added to our platform.
          </p>
          <Link href="/charities" className="btn btn-primary w-full">
            Back to Charities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", padding: "4rem 0" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <Link href="/charities" className="btn btn-ghost btn-sm mb-6" style={{ marginLeft: "-0.5rem" }}>
          <ArrowLeft size={16} /> Back to Charities
        </Link>

        <div className="grid-2" style={{ alignItems: "start" }}>
          <div>
            <div className="icon-box icon-box-blue mb-4">
              <Heart size={24} />
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
              Nominate a Charity
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
              Is there a cause close to your heart that isn't on FairPlay yet? We're always looking to expand our impact. 
              Fill out the form to suggest a verified non-profit organization.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div className="icon-box icon-box-gray" style={{ width: "40px", height: "40px" }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>Verification Process</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>We ensure all charities are registered and verified.</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div className="icon-box icon-box-gray" style={{ width: "40px", height: "40px" }}>
                  <Globe size={18} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>Global Impact</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Supporting local and international organizations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-lg" style={{ padding: "2.5rem" }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Charity Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Red Cross, Local Food Bank" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Website URL</label>
                <div style={{ position: "relative" }}>
                  <Globe size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input 
                    type="url" 
                    className="form-input" 
                    style={{ paddingLeft: "2.5rem" }}
                    placeholder="https://www.charity.org" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" required>
                  <option value="">Select a category</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Humanitarian">Humanitarian</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Email</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input 
                    type="email" 
                    className="form-input" 
                    style={{ paddingLeft: "2.5rem" }}
                    placeholder="your@email.com" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Why should we add them?</label>
                <textarea 
                  className="form-textarea" 
                  rows={4} 
                  placeholder="Tell us a bit about their mission..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full btn-lg mt-4"
                disabled={loading}
              >
                {loading ? "Sending..." : (
                  <>
                    Submit Nomination <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
