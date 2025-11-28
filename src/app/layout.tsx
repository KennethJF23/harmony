import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harmony - AI-Powered Brainwave Focus & Wellness Platform",
  description: "Transform your productivity with science-backed binaural beats. AI-powered recommendations, smart analytics, and personalized focus sessions for students and professionals.",
  keywords: [
    "binaural beats", 
    "focus music", 
    "productivity app", 
    "meditation", 
    "study music", 
    "concentration", 
    "brainwave entrainment",
    "AI wellness",
    "focus timer",
    "pomodoro technique",
    "mental wellness",
    "stress relief"
  ],
  authors: [{ name: "Harmony Team" }],
  creator: "Harmony",
  applicationName: "Harmony",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://harmony.app",
    title: "Harmony - AI Brainwave Focus Platform",
    description: "Unlock peak performance with AI-powered binaural beats. Smart session tracking, personalized recommendations, and science-backed audio for focus and wellness.",
    siteName: "Harmony",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harmony - AI Brainwave Focus Platform",
    description: "AI-powered binaural beats for focus, productivity, and mental wellness.",
    creator: "@harmonyapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Productivity",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7aa2f7" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f35 50%, #0f1729 100%)',
          minHeight: '100vh'
        }}
      >
        {children}
      </body>
    </html>
  );
}
