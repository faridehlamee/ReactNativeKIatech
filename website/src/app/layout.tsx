import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kiatech Software - Mobile App Development & Software Solutions",
  description: "Professional mobile app development, software solutions, and digital transformation services. Get notifications and stay updated with our mobile app.",
  keywords: "mobile app development, software solutions, React Native, iOS, Android, web development, digital transformation",
  authors: [{ name: "Kiatech Software" }],
  creator: "Kiatech Software",
  publisher: "Kiatech Software",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kiatechsoftware.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Kiatech Software - Mobile App Development & Software Solutions",
    description: "Professional mobile app development, software solutions, and digital transformation services.",
    url: 'https://kiatechsoftware.com',
    siteName: 'Kiatech Software',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kiatech Software',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kiatech Software - Mobile App Development & Software Solutions",
    description: "Professional mobile app development, software solutions, and digital transformation services.",
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
