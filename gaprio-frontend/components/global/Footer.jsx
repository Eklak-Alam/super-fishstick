import Link from 'next/link';
import { Twitter, Linkedin, Github, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-20">
          
          <div className="col-span-2">
            <h3 className="text-2xl font-bold text-white mb-6">Gaprio.</h3>
            <p className="text-gray-400 text-sm leading-7 max-w-xs mb-8">
              The AI Operating System for modern enterprises. Connecting tools, teams, and workflows into a single intelligent brain.
            </p>
            <div className="flex gap-4">
              <SocialIcon Icon={Twitter} />
              <SocialIcon Icon={Linkedin} />
              <SocialIcon Icon={Github} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <FooterLink>Intelligence</FooterLink>
            <FooterLink>Integrations</FooterLink>
            <FooterLink>Security</FooterLink>
            <FooterLink>Roadmap</FooterLink>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <FooterLink>About Us</FooterLink>
            <FooterLink>Careers</FooterLink>
            <FooterLink>Blog</FooterLink>
            <FooterLink>Contact</FooterLink>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Legal</h4>
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink>Terms of Service</FooterLink>
            <FooterLink>Cookie Policy</FooterLink>
            <FooterLink>GDPR</FooterLink>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-white mb-6">Status</h4>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All Systems Operational
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>© 2025 Gaprio Inc. San Francisco, CA.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Globe size={12} />
            <span>English (US)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

function FooterLink({ children }) {
  return (
    <Link href="#" className="block text-sm text-gray-500 hover:text-white transition-colors mb-3">
      {children}
    </Link>
  );
}

function SocialIcon({ Icon }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all">
      <Icon size={18} />
    </a>
  );
}