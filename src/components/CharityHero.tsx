"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const images = [
  { url: "/charity_environment_1776949965136.png", title: "Protecting Our Planet", desc: "Funding reforestation and clean water projects globally." },
  { url: "/charity_education_1776949991246.png", title: "Empowering Next Gen", desc: "Breaking barriers to education for children in need." },
  { url: "/charity_health_1776950019911.png", title: "Global Health Care", desc: "Providing compassionate care and mental health support." },
  { url: "/charity_humanitarian_1776950041219.png", title: "Humanitarian Aid", desc: "Responding to crises with immediate food and support." },
];

export default function CharityHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="charity-hero">
      {/* Background Slider */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${images[index].url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="container" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div className="charity-hero-content">
          <motion.div
            key={`content-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span style={{ color: "var(--brand-light)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.85rem", marginBottom: "1rem", display: "block" }}>
              Make a difference
            </span>
            <h1 style={{ color: "#fff", fontSize: "clamp(2rem, 8vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "1rem", lineHeight: 1.1 }}>
              {images[index].title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "clamp(1rem, 4vw, 1.25rem)", marginBottom: "2rem", lineHeight: 1.6 }}>
              {images[index].desc}
            </p>
            <div className="charity-hero-btns">
              <Link href="/signup" className="btn btn-primary btn-xl" style={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)" }}>
                Get Started <ArrowRight size={20} />
              </Link>
              <button 
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="btn btn-secondary btn-xl" 
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              >
                Browse Causes
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem", zIndex: 2 }}>
        {images.map((_, i) => (
          <div 
            key={i}
            onClick={() => setIndex(i)}
            style={{ 
              width: i === index ? "32px" : "8px", 
              height: "8px", 
              borderRadius: "4px", 
              background: i === index ? "var(--brand)" : "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          />
        ))}
      </div>
    </section>
  );
}
