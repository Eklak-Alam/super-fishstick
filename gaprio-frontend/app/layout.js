import Navbar from '@/components/global/Navbar';
import './globals.css';
import SmoothScroll from '@/components/global/SmoothScroll';
import QueryProvider from '@/providers/QueryProvider';
import Footer from '@/components/global/Footer';
import { Inter, Space_Grotesk } from 'next/font/google';

// Optimized fonts with performance settings
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
    default: 'Gaprio | The AI Workspace',
    template: '%s | Gaprio',
  },
  description: 'Connect everything. Automate anything. Boost productivity with AI-powered workspace.',
  keywords: ['AI workspace', 'productivity', 'automation', 'collaboration', 'workflow'],
  authors: [{ name: 'Gaprio Team' }],
  creator: 'Gaprio',
  publisher: 'Gaprio',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gaprio.in',
    title: 'Gaprio | The AI Workspace',
    description: 'Connect everything. Automate anything. Boost productivity with AI-powered workspace.',
    siteName: 'Gaprio',
    images: [
      {
        url: '/og-image.png', // Create this in /public folder
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
    images: ['/twitter-image.png'], // Create this in /public folder
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
  manifest: '/manifest.json', // Add PWA manifest
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
  verification: {
    google: 'your-google-verification-code', // Add when available
  },
};

// Structured data for rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Gaprio',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'AI-powered workspace to connect everything and automate anything',
  url: 'https://gaprio.in',
  publisher: {
    '@type': 'Organization',
    name: 'Gaprio',
    logo: '/logo.png',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1000',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/logo.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-[#020202] text-gray-900 dark:text-white transition-colors`}>
        <noscript>
          <div className="fixed inset-0 bg-black text-white z-50 flex items-center justify-center p-4">
            <div className="max-w-2xl text-center">
              <h1 className="text-2xl font-bold mb-4">JavaScript Required</h1>
              <p className="mb-4">This website requires JavaScript to function properly. Please enable JavaScript in your browser settings.</p>
            </div>
          </div>
        </noscript>
        
        <QueryProvider>
          <SmoothScroll>
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50"
            >
              Skip to main content
            </a>
            
            <Navbar />
            
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            
            <Footer />
            
            {/* Accessibility improvements */}
            <div 
              role="region" 
              aria-label="Live announcements" 
              className="sr-only"
              aria-live="polite"
              aria-atomic="true"
            />
          </SmoothScroll>
        </QueryProvider>
        
        {/* Performance optimizations */}
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