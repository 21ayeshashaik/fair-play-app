import Link from "next/link";
import { Heart, Search, Users, ArrowRight, Globe } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import CharityHero from "@/components/CharityHero";

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  supporters?: number;
  website?: string;
  image_url?: string;
}

const MOCK_CHARITIES: Charity[] = [
  { id: "c1", name: "Global Clean Water Initiative", description: "Providing clean, safe drinking water to communities across Sub-Saharan Africa and South Asia.", category: "Environment", supporters: 1240, website: "#", image_url: "/charity_environment_1776949965136.png" },
  { id: "c2", name: "Children's Education Fund",      description: "Funding access to quality education for underprivileged children in over 30 countries.", category: "Education", supporters: 892, image_url: "/charity_education_1776949991246.png" },
  { id: "c3", name: "Mental Health Alliance",         description: "Raising awareness, reducing stigma, and funding research for mental health conditions worldwide.", category: "Health", supporters: 764, image_url: "/charity_health_1776950019911.png" },
  { id: "c4", name: "Ocean Plastic Recovery",         description: "Coordinating global efforts to remove plastic waste from the world's oceans and coastlines.", category: "Environment", supporters: 631, image_url: "/charity_environment_1776949965136.png" },
  { id: "c5", name: "Hunger Relief Network",          description: "Delivering nutritious meals and sustainable food programs to families in acute crisis.", category: "Humanitarian", supporters: 1105, image_url: "/charity_humanitarian_1776950041219.png" },
  { id: "c6", name: "Reforestation Trust",            description: "Planting native trees and restoring natural habitats across heavily deforested regions.", category: "Environment", supporters: 488, image_url: "/charity_environment_1776949965136.png" },
  { id: "c7", name: "Women in STEM Foundation",       description: "Scholarships, mentorship, and advocacy for women and girls entering STEM disciplines.", category: "Education", supporters: 377, image_url: "/charity_education_1776949991246.png" },
  { id: "c8", name: "Veterans Support Alliance",      description: "Providing mental health, housing, and career support to military veterans.", category: "Health", supporters: 541, image_url: "/charity_health_1776950019911.png" },
];

const categoryColors: Record<string, string> = {
  Environment:  "badge-green",
  Education:    "badge-blue",
  Health:       "badge-yellow",
  Humanitarian: "badge-gray",
};

const defaultCategoryImages: Record<string, string> = {
  Environment:  "/charity_environment_1776949965136.png",
  Education:    "/charity_education_1776949991246.png",
  Health:       "/charity_health_1776950019911.png",
  Humanitarian: "/charity_humanitarian_1776950041219.png",
};

async function getCharities() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("charities")
      .select("*")
      .order("name");

    return !error && data && data.length ? data : MOCK_CHARITIES;
  } catch {
    return MOCK_CHARITIES;
  }
}

export default async function CharitiesPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const charities = await getCharities();

  const categories = Array.from(new Set(charities.map(c => c.category)));
  const grouped = categories.reduce<Record<string, Charity[]>>((acc, cat) => {
    acc[cat] = charities.filter(c => c.category === cat);
    return acc;
  }, {});

  const totalSupporters = charities.reduce((s, c) => s + (c.supporters ?? 0), 0);

  return (
    <>
      <CharityHero />

      {/* Stats Summary Inline */}
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "2rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "center", gap: "4vw", flexWrap: "wrap", opacity: 0.8 }}>
            {[
              { value: charities.length.toString(), label: "Verified Charities" },
              { value: totalSupporters.toLocaleString() + "+", label: "Players Joined" },
              { value: "$125k+", label: "Impact Created" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--brand)" }}>{s.value}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {items.map(c => (
                  <div key={c.id} className="card card-hover" style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border)", borderRadius: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                      <div className={`icon-box icon-box-${cat === 'Environment' ? 'green' : cat === 'Education' ? 'blue' : 'yellow'}`} style={{ width: "48px", height: "48px" }}>
                        <Heart size={20} />
                      </div>
                      {c.website && (
                        <Link href={c.website} className="icon-box icon-box-gray" style={{ width: "32px", height: "32px", opacity: 0.6 }}>
                          <Globe size={14} />
                        </Link>
                      )}
                    </div>

                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{c.name}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem", flex: 1 }}>{c.description}</p>
                    
                    <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <div style={{ display: "flex", marginLeft: "0.25rem" }}>
                           {[1,2,3].map(i => (
                             <div key={i} style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--bg-subtle)", border: "2px solid #fff", marginLeft: "-8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                               <Users size={10} color="var(--text-muted)" />
                             </div>
                           ))}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{c.supporters?.toLocaleString()} joined</span>
                      </div>
                      <Link href={session ? "/dashboard/charity" : "/signup"} className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
                        Choose
                      </Link>
                    </div>
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
