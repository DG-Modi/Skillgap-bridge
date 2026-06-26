import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSync AI - Bridge Your Skill Gap with AI",
  description: "Upload your resume, compare it with any job role, discover missing skills, prepare for interviews, and accelerate your career growth using advanced AI insights.",
  keywords: ["skills gap", "career transition", "AI resume analysis", "interview preparation", "mock interview", "learning roadmap"],
  authors: [{ name: "SkillSync AI Team" }],
  openGraph: {
    title: "SkillSync AI - Bridge Your Skill Gap with AI",
    description: "Upload your resume, compare it with any job role, discover missing skills, prepare for interviews, and accelerate your career growth using advanced AI insights.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col bg-background-app text-text-app selection:bg-primary/20">
        <Navbar />
        <main className="flex-grow flex flex-col w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

