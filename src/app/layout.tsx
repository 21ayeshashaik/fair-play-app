"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // Hide global Footer on dashboard and admin internal pages to avoid clutter
  // But keep the NavBar everywhere as requested for mobile navigation
  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <head>
        <title>FairPlay — Golf. Charity. Wins.</title>
        <meta name="description" content="A subscription platform combining golf performance tracking, charity fundraising, and a monthly prize draw engine." />
      </head>
      <body className={isDashboardOrAdmin ? "has-mobile-bottom-nav" : ""}>
        {!isDashboardOrAdmin && <NavBar />}
        <main>{children}</main>
        {!isDashboardOrAdmin && <Footer />}
      </body>
    </html>
  );
}
