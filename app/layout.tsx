import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Manrope, Syne } from 'next/font/google';
import { SITE_URL } from '@/lib/links';
import { siteName } from '@/lib/nav';
import './globals.css';

// Same fonts as doubtbot.eu.
const syne = Syne({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-syne' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

const description =
  'How to set up and use Doubt, the Discord bot for moderation, AutoMod, tickets, welcome messages, levelling and an economy.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: siteName, template: `%s · ${siteName}` },
  description,
  applicationName: siteName,
  authors: [{ name: 'Doubt Productions' }],
  icons: {
    icon: [
      { url: '/brand/doubt-app-icon.svg', type: 'image/svg+xml' },
      { url: '/brand/doubt-app-icon.png', type: 'image/png', sizes: '1024x1024' },
    ],
    apple: [{ url: '/brand/doubt-app-icon.png', sizes: '1024x1024' }],
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName,
    title: siteName,
    description,
    locale: 'en_GB',
    images: [{ url: '/brand/doubt-banner.png', width: 2400, height: 848, alt: 'Doubt' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f0a14' },
    { media: '(prefers-color-scheme: light)', color: '#faf7fc' },
  ],
};

// Runs before first paint: a saved choice wins, then the system preference, then dark.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${syne.variable} ${manrope.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static theme script, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
