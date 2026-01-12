import Navbar from '@/components/global/Navbar';
import './globals.css';
import SmoothScroll from '@/components/global/SmoothScroll';
import QueryProvider from '@/providers/QueryProvider';
import { Inter, Space_Grotesk } from 'next/font/google';
import AwardWinningFooter from '@/components/global/Footer';

// Optimized fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata = {
  title: {
    default: 'Gaprio',
    template: '%s | Gaprio',
  },
  description: 'Connect everything. Automate anything. Boost productivity with AI-powered workspace.',
  keywords: ['AI workspace', 'productivity', 'automation', 'collaboration', 'workflow'],
  authors: [{ name: 'Gaprio Team' }],
  creator: 'Gaprio',
  publisher: 'Gaprio',
  metadataBase: new URL('https://gaprio.in'), // FIX: Added metadataBase for cleaner URL resolution
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gaprio.in',
    title: 'Gaprio',
    description: 'Connect everything. Automate anything. Boost productivity with AI-powered workspace.',
    siteName: 'Gaprio',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Gaprio - AI Workspace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaprio | The AI Workspace',
    description: 'Connect everything. Automate anything. Boost productivity with AI-powered workspace.',
    images: ['/logo.png'],
    creator: '@gaprio',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020202' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      {/* FIX 1: Removed 'overflow-x-hidden' from body.
         Why? It is now handled in globals.css. Having it here breaks Lenis scrolling.
      */}
      <body className={`${inter.className} antialiased bg-[#020202] text-white`}>
        
        <QueryProvider>
          <SmoothScroll>
            <Navbar /> 

            {/* FIX 2: Main Content Wrapper
                - z-10: Stays above footer
                - bg-[#020202]: Solid background
            */}
            <main className="relative z-10 bg-[#020202] w-full">
              {children}
            </main>
            
            {/* FIX 3: Footer Wrapper
                - z-0: Sits behind/below main content
            */}
            <div className="relative z-0 w-full overflow-hidden">
               <AwardWinningFooter />
            </div>

          </SmoothScroll>
        </QueryProvider>
        
        {/* Analytics Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              if(localStorage.getItem('consent') === 'granted') {
                // Load analytics script if consented
              }
            `,
          }}
        />
      </body>
    </html>
  );
}