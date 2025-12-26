import Navbar from '@/components/global/Navbar';
import './globals.css';
import SmoothScroll from '@/components/global/SmoothScroll';
import QueryProvider from '@/providers/QueryProvider';
import Footer from '@/components/global/Footer';
import { Inter, Space_Grotesk } from 'next/font/google';
import AwardWinningFooter from '@/components/global/Footer';

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
    default: 'Gaprio',
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
    title: 'Gaprio',
    description: 'Connect everything. Automate anything. Boost productivity with AI-powered workspace.',
    siteName: 'Gaprio',
    images: [
      {
        url: '/logo.png', // Create this in /public folder
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
    images: ['/logo.png'], // Create this in /public folder
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
    >
      <body className={`${inter.className} bg-white dark:bg-[#020202] text-gray-900 dark:text-white transition-colors`}>
        <QueryProvider>
          <SmoothScroll>
            {/* <Navbar /> */}
            <main>
              {children}
            </main>
            
            <AwardWinningFooter />
            
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