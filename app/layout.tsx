import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import AnimatedCursor from "@/components/AnimatedCursor";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Arpit Bhardwaj - Full Stack Developer | Portfolio",
    template: "%s | Arpit Bhardwaj Portfolio",
  },
  description: "Full Stack Developer specializing in React, Next.js, TypeScript, and modern web technologies. View my portfolio of projects, skills, and experience.",
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Web Developer",
    "Frontend Developer",
    "Portfolio",
    "Software Engineer",
    "Arpit Bhardwaj",
  ],
  authors: [{ name: "Arpit Bhardwaj" }],
  creator: "Arpit Bhardwaj",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arpit-bhardwaj.vercel.app",
    siteName: "Arpit Bhardwaj - Full Stack Developer",
    title: "Arpit Bhardwaj - Full Stack Developer",
    description: "Full Stack Developer specializing in React, Next.js, TypeScript, and modern web technologies. Explore my projects and experience.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Arpit Bhardwaj Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arpit Bhardwaj - Full Stack Developer",
    description: "Full Stack Developer specializing in React, Next.js, TypeScript, and modern web technologies.",
    creator: "@arpit_bhardwaj",
    images: ["/og-image.jpg"],
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Add your verification codes if needed
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="canonical" href="https://arpit-bhardwaj.vercel.app" />
      </head>
      <body className={inter.className}>
        <SmoothScroll>
          <AnimatedCursor />
          <ClientLayout>
            <Navbar />
            <main role="main" id="main-content">{children}</main>
            <Footer />
          </ClientLayout>
        </SmoothScroll>
      </body>
    </html>
  );
}

