import type { Metadata } from "next";
import { Fredoka, Nunito, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { FirebaseAnalytics } from "@/components/firebase-analytics";
import { FirebasePerformance } from "@/components/firebase-performance";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-nunito",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-patrick",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://instantpicgenerator.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "AI Polaroid Photo Generator - Free Instant Photos Online",
    template: "%s | AI Polaroid Maker"
  },
  description: "Turn photos into aesthetic 3D chibi Polaroid prints instantly. Free online tool with retro filters, white borders & custom text. No signup needed.",
  keywords: ["polaroid generator", "instant photo maker", "photo to polaroid", "retro photo frame", "white border app", "aesthetic photo editor", "polaroid template", "instant film effect", "3D chibi", "AI sticker maker"],
  authors: [{ name: "AI Polaroid Team" }],
  creator: "AI Polaroid",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://instantpicgenerator.com',
    siteName: 'AI Polaroid Photo Generator',
    title: 'AI Polaroid Photo Generator - Free Instant Photos Online',
    description: 'Turn photos into aesthetic 3D chibi Polaroid prints instantly. Free online tool with retro filters, white borders & custom text. No signup needed.',
    images: [
      {
        url: '/sample-polaroid.png',
        width: 1200,
        height: 630,
        alt: 'AI Polaroid Generator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Polaroid Photo Generator - Free Instant Photos Online',
    description: 'Turn photos into aesthetic 3D chibi Polaroid prints instantly. Free online tool with retro filters, white borders & custom text. No signup needed.',
    images: ['/sample-polaroid.png'],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${nunito.variable} ${patrickHand.variable} antialiased min-h-screen flex flex-col pb-24`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AI Polaroid",
              "url": "https://instantpicgenerator.com",
              "logo": "https://instantpicgenerator.com/sample-polaroid.png",
              "sameAs": []
            })
          }}
        />
        {children}
        <Footer />
        <FirebaseAnalytics />
        <FirebasePerformance />
      </body>
    </html>
  );
}
