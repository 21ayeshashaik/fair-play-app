import Link from "next/link";
import { Target, Heart, Activity, Trophy, ArrowRight, CheckCircle, ShieldCheck, Users } from "lucide-react";

const steps = [
  {
    icon: <ShieldCheck size={22} />,
    iconStyle: "icon-box-blue",
    title: "Subscribe",
    desc: "Choose a monthly or discounted yearly plan. A minimum of 10% of your subscription is instantly allocated to your chosen charity.",
  },
  {
    icon: <Activity size={22} />,
    iconStyle: "icon-box-green",
    title: "Enter Scores",
    desc: "Log your last 5 Stableford scores. The platform retains your rolling 5-score window which forms your unique monthly draw entry.",
  },
  {
    icon: <Trophy size={22} />,
    iconStyle: "icon-box-yellow",
    title: "Win Monthly",
    desc: "Match 3, 4, or 5 draw numbers each month to win a share of the prize pool. Unclaimed jackpots roll over to the next month.",
  },
];

const prizeRows = [
  { label: "5 Number Match — Jackpot", share: "40% of pool", rollover: true, style: "badge-blue" },
  { label: "4 Number Match", share: "35% of pool", rollover: false, style: "badge-green" },
  { label: "3 Number Match", share: "25% of pool", rollover: false, style: "badge-gray" },
];

const charities = [
  { name: "Global Clean Water Initiative", supporters: "1,240" },
  { name: "Children's Education Fund", supporters: "892" },
  { name: "Mental Health Alliance", supporters: "764" },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow animate-fade-in-up">
            <Target size={14} strokeWidth={2.5} /> Golf · Charity · Monthly Draws
          </div>

          <h1 className="animate-fade-in-up delay-100">
            Play golf. Support causes.<br />Win every month.
          </h1>

          <p className="animate-fade-in-up delay-200">
            FairPlay turns your Stableford scores into monthly prize draw entries — while automatically
            contributing to the charity you care about most.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }} className="animate-fade-in-up delay-300">
            <Link href="/dashboard" className="btn btn-primary btn-xl">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link href="/charities" className="btn btn-secondary btn-xl">
              Browse Charities
            </Link>
          </div>

          {/* Social proof strip */}
          <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginTop: "3.5rem", flexWrap: "wrap" }} className="animate-fade-in-up delay-300">
            {[
              { value: "$125k+", label: "Donated to charities" },
              { value: "$84k",   label: "Paid out to winners" },
              { value: "4,200+", label: "Active subscribers" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.3rem", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: "3rem" }}>
            <span className="section-label">How it works</span>
            <h2 className="section-title">Three steps to impact</h2>
            <p className="section-desc">
              A simple, transparent system designed to maximise your charitable impact and your chances of winning.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {steps.map((s, i) => (
              <div key={s.title} className="card card-hover">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div className={`icon-box ${s.iconStyle}`}>{s.icon}</div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Step {i + 1}</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIZE BREAKDOWN ── */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <span className="section-label">Prize structure</span>
              <h2 className="section-title">Transparent prize pools</h2>
              <p className="section-desc">
                A substantial portion of every subscription is automatically pooled. Distributions are enforced algorithmically — there is no manual intervention.
              </p>
              <Link href="/dashboard" className="btn btn-primary mt-8" style={{ display: "inline-flex" }}>
                View Current Pool <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {prizeRows.map(r => (
                <div key={r.label} className="card card-flat" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{r.label}</p>
                    {r.rollover && <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Jackpot rolls over if unclaimed</p>}
                  </div>
                  <span className={`badge ${r.style}`}>{r.share}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CHARITY SPOTLIGHT ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="section-label">Charity directory</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured causes</h2>
            </div>
            <Link href="/charities" className="btn btn-secondary btn-sm">View all charities →</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {charities.map(c => (
              <div key={c.name} className="card card-hover" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div className="icon-box icon-box-green" style={{ marginTop: "2px" }}>
                  <Heart size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.35rem" }}>{c.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Users size={13} /> {c.supporters} supporters
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: "var(--brand)", padding: "5rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Ready to make every round count?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", marginBottom: "2rem" }}>
            Join thousands of golfers who are winning prizes and funding causes they believe in.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{ background: "#fff", color: "var(--brand)", padding: "0.85rem 2rem", fontWeight: 700, borderRadius: "var(--radius-md)", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "var(--shadow-md)" }}>
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link href="/charities" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "0.85rem 2rem", fontWeight: 600, borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.3)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Explore Charities
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
