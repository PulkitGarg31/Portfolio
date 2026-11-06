import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { IntroAnimation } from "@/components/intro-animation";
import { site } from "@/config/site";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const TITLE = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: TITLE,
  description:
    "CS student at Thapar building backends that run AI agents, plus data pipelines and ML models, shipped end to end.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: TITLE,
    description:
      "Backends, agentic AI and ML, built end to end and shipped. Projects, research and resume.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}, ${site.role}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Backends, agentic AI and ML, built end to end and shipped.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${anton.variable} ${inter.variable} font-body bg-bg text-ink antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              "try{if(!sessionStorage.getItem('introPlayed')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('intro-play')}}catch(e){}",
          }}
        />
        <IntroAnimation />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
