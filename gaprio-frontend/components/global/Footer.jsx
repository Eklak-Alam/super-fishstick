"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Instagram,
  ArrowUpRight,
  ArrowUp, // Added ArrowUp for the scroll button
} from "lucide-react";

export default function StandardFooter() {
  const currentYear = new Date().getFullYear();

  // Function to handle smooth scrolling to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-[#020202] overflow-hidden border-t border-white/10 pt-20 pb-10">
      {/* --- CINEMATIC BACKGROUND --- */}

      {/* 1. Primary Glow (Bottom Right - Intense Orange) */}
      <div className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-radial-gradient from-orange-600/20 via-orange-900/5 to-transparent blur-[120px] pointer-events-none opacity-60" />

      {/* 2. Secondary Glow (Bottom Center - Amber Wash) */}
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-amber-600/10 blur-[100px] rounded-full pointer-events-none opacity-40" />

      {/* 3. Subtle Rose Accent (Far Corner - Depth) */}
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-rose-600/10 blur-[80px] rounded-full pointer-events-none opacity-30" />

      {/* 4. Texture Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* --- TOP SECTION: CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          {/* 1. BRAND COLUMN (Left) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            {/* Adjusted Logo Section */}
            <div className="mb-8 relative">
              <Image
                src="/logo2.png"
                alt="Gaprio Logo"
                width={600}
                height={180}
                priority
                className="object-contain h-10 sm:h-8 md:h-8 lg:h-10 xl:h-12 w-auto"
              />
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm mb-8 font-light">
              The central nervous system for your enterprise. We connect your
              fragmented tools into one intelligent workflow.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <SocialLink Icon={Twitter} href="https://x.com/Gaprio_Labs" />
              <SocialLink
                Icon={Instagram}
                href="https://www.instagram.com/gaprio_labs?igsh=eDdmMGMzYzZoamtj"
              />
            </div>
          </div>

          {/* 2. LINKS COLUMNS (Right) */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 mt-4 lg:mt-0">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold tracking-wide text-sm uppercase opacity-80">
                Platform
              </h4>
              <ul className="space-y-3">
                <FooterLink>Intelligence</FooterLink>
                <FooterLink>Workflows</FooterLink>
                <FooterLink>Integrations</FooterLink>
                <FooterLink>Pricing</FooterLink>
              </ul>
            </div>

            {/* Column 2 - Placeholder / Hidden if empty */}
            {/* <div className="flex flex-col gap-4"> ... </div> */}

            {/* Column 3 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold tracking-wide text-sm uppercase opacity-80">
                Legal
              </h4>
              <ul className="space-y-3">
                <FooterLink>Privacy Policy</FooterLink>
                <FooterLink>Terms of Service</FooterLink>
                <FooterLink>Security</FooterLink>
                <FooterLink>Cookie Settings</FooterLink>
              </ul>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR (With Scroll To Top) --- */}
        <div className="border-t border-white/5 pt-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-600 text-xs uppercase tracking-widest font-medium text-center md:text-left">
            © {currentYear} Gaprio Inc. All rights reserved.
          </p>

          {/* SCROLL TO TOP BUTTON */}
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors duration-300 cursor-pointer"
          >
            <span className="text-xs font-bold uppercase tracking-wider">Back to Top</span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-orange-500 group-hover:bg-orange-500/10 transition-all">
                <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}

// --- SUB-COMPONENTS ---

function FooterLink({ children }) {
  return (
    <li>
      <Link
        href="#"
        className="group flex items-center gap-1 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
      >
        <span>{children}</span>
        <ArrowUpRight
          size={12}
          className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-orange-500"
        />
      </Link>
    </li>
  );
}

function SocialLink({ Icon, href }) {
  return (
    <a
      href={href}
      target="_blank" // Open in new tab
      rel="noopener noreferrer" // Security best practice
      className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 
      hover:text-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 hover:border-orange-500 
      hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-110 active:scale-95 transition-all duration-300"
    >
      <Icon size={18} />
    </a>
  );
}