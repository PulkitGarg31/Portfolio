import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Pulkit Garg — ML Engineer",
  description:
    "GenAI, agentic systems & ML — built end-to-end and shipped, not just notebooked.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anton.variable} ${inter.variable} font-body bg-bg text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
