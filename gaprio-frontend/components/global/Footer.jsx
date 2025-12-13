'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Github, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020202] border-t border-white/10 pt-24 pb-12 relative overflow-hidden">
      
      {/* Background Gradient Mesh (Orange) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-orange-900/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 mb-24">
          
          {/* --- Brand Column --- */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-start">
            
            <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="relative w-10 h-10 flex-shrink-0">
                    <Image 
                        src="/logo.png" 
                        alt="Gaprio Logo" 
                        fill
                        className="object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                        priority
                    />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">Gaprio</span>
            </Link>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-8">
              The AI Operating System for modern enterprises. We connect tools, teams, and workflows into a single intelligent brain.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              <SocialIcon Icon={Twitter} href="#" />
              <SocialIcon Icon={Linkedin} href="#" />
              <SocialIcon Icon={Github} href="#" />
            </div>
          </div>

          {/* --- Links --- */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <FooterLink>Intelligence</FooterLink>
            <FooterLink>Integrations</FooterLink>
            <FooterLink>Enterprise</FooterLink>
            <FooterLink>Changelog</FooterLink>
            <FooterLink>Docs</FooterLink>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <FooterLink>About</FooterLink>
            <FooterLink>Careers</FooterLink>
            <FooterLink>Blog</FooterLink>
            <FooterLink>Contact</FooterLink>
            <FooterLink>Customers</FooterLink>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <FooterLink>Privacy</FooterLink>
            <FooterLink>Terms</FooterLink>
            <FooterLink>Security</FooterLink>
            <FooterLink>GDPR</FooterLink>
          </div>

        </div>

        {/* --- Bottom Bar --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© {currentYear} Gaprio Inc.</p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 hover:text-orange-400 transition-colors cursor-pointer">
                <Globe size={14} />
                <span>English (US)</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

function FooterLink({ children }) {
  return (
    <Link href="#" className="group flex items-center gap-1 text-sm text-zinc-500 hover:text-orange-400 transition-colors mb-3.5">
      <span>{children}</span>
      <ArrowRightIcon />
    </Link>
  );
}

function ArrowRightIcon() {
    return (
        <svg 
            width="10" 
            height="10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-orange-500"
        >
            <path d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
    )
}

function SocialIcon({ Icon, href }) {
  return (
    <a href={href} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-orange-500 hover:text-white hover:border-orange-500/50 transition-all duration-300">
      <Icon size={18} />
    </a>
  );
}