import Link from "next/link";
import { Heart, Search, Users, ArrowRight, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  supporters?: number;
  website?: string;
}

const MOCK_CHARITIES: Charity[] = [
  { id: "c1", name: "Global Clean Water Initiative", description: "Providing clean, safe drinking water to communities across Sub-Saharan Africa and South Asia.", category: "Environment", supporters: 1240, website: "#" },
  { id: "c2", name: "Children's Education Fund",      description: "Funding access to quality education for underprivileged children in over 30 countries.", category: "Education", supporters: 892 },
  { id: "c3", name: "Mental Health Alliance",         description: "Raising awareness, reducing stigma, and funding research for mental health conditions worldwide.", category: "Health", supporters: 764 },
  { id: "c4", name: "Ocean Plastic Recovery",         description: "Coordinating global efforts to remove plastic waste from the world's oceans and coastlines.", category: "Environment", supporters: 631 },
  { id: "c5", name: "Hunger Relief Network",          description: "Delivering nutritious meals and sustainable food programs to families in acute crisis.", category: "Humanitarian", supporters: 1105 },
  { id: "c6", name: "Reforestation Trust",            description: "Planting native trees and restoring natural habitats across heavily deforested regions.", category: "Environment", supporters: 488 },
  { id: "c7", name: "Women in STEM Foundation",       description: "Scholarships, mentorship, and advocacy for women and girls entering STEM disciplines.", category: "Education", supporters: 377 },
  { id: "c8", name: "Veterans Support Alliance",      description: "Providing mental health, housing, and career support to military veterans.", category: "Health", supporters: 541 },
];

const categoryColors: Record<string, string> = {
  Environment:  "badge-green",
  Education:    "badge-blue",
  Health:       "badge-yellow",
  Humanitarian: "badge-gray",
};

async function getCharities(): Promise<Charity[]> {
  try {
    const { data, error } = await supabase
      .from("charities")
      .select("*")
      .order("name");

    return !error && data && data.length ? (data as Charity[]) : MOCK_CHARITIES;
  } catch {
    return MOCK_CHARITIES;
  }
}

export default async function CharitiesPage() {
  const charities = await getCharities();

  const categories = Array.from(new Set(charities.map(c => c.category)));
  const grouped = categories.reduce<Record<string, Charity[]>>((acc, cat) => {
    acc[cat] = charities.filter(c => c.category === cat);
    return acc;
  }, {});

  const totalSupporters = charities.reduce((s, c) => s + (c.supporters ?? 0), 0);

  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-label">Charitable Causes</span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            The causes you power
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "560px", margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
            Every FairPlay subscription allocates a portion to a charity you choose. Browse our verified directory and make your selection.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
            {[
              { value: charities.length.toString(), label: "Active Charities" },
              { value: totalSupporters.toLocaleString() + "+", label: "FairPlay Supporters" },
              { value: "$125k+", label: "Total Raised" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.3rem", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charity grid */}
      <section className="section">
        <div className="container">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: "3.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className={`badge ${categoryColors[cat] ?? "badge-gray"}`}>{cat}</span>
                </h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{items.length} charities</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
                {items.map(c => (
                  <div key={c.id} className="card card-hover">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <div className="icon-box icon-box-green"><Heart size={18} /></div>
                      {c.website && (
                        <Link href={c.website} style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.78rem" }}>
                          <Globe size={13} /> Website
                        </Link>
                      )}
                    </div>
                    <h3 style={{ fontSize: "0.975rem", fontWeight: 700, marginBottom: "0.5rem" }}>{c.name}</h3>
                    <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "1rem" }}>{c.description}</p>
                    {c.supporters && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Users size={12} /> {c.supporters.toLocaleString()} supporters
                        </p>
                        <Link href="/dashboard/charity" className="btn btn-secondary btn-sm">
                          Select <ArrowRight size={12} />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)", padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>Not seeing your charity?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            We're always expanding our directory. Contact us to nominate a cause.
          </p>
          <Link href="/contact" className="btn btn-primary">Nominate a Charity <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
