import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/features/auth/AuthProvider';
import '@/styles/globals.css';

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
});

const outfit = Outfit({
  subsets:  ['latin'],
  variable: '--font-outfit',
  display:  'swap',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default:  'CarbonMirror — See the World You Create',
    template: '%s | CarbonMirror',
  },
  description:
    'CarbonMirror helps you understand and reduce your environmental impact through emotional engagement, behavioural science, AI coaching, and community action.',
  keywords: [
    'carbon footprint',
    'climate action',
    'sustainability',
    'carbon tracking',
    'environmental impact',
    'green living',
  ],
  authors:  [{ name: 'CarbonMirror Team' }],
  creator:  'CarbonMirror',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://carbonfootprint.app'
  ),
  openGraph: {
    title:       'CarbonMirror',
    description: 'See the world you create through your everyday choices.',
    type:        'website',
    locale:      'en_US',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'CarbonMirror',
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor:     [
    { media: '(prefers-color-scheme: light)', color: '#14b47c' },
    { media: '(prefers-color-scheme: dark)',  color: '#032b20' },
  ],
  width:          'device-width',
  initialScale:   1,
  maximumScale:   5,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-surface-primary text-text-primary antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a2e25',
                color:      '#e2f5ed',
                border:     '1px solid rgba(20,180,124,0.3)',
                borderRadius: '12px',
                fontSize:     '14px',
              },
              success: { iconTheme: { primary: '#14b47c', secondary: '#032b20' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#1f2937' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
