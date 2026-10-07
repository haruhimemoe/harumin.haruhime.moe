/**
 * @file src/app/layout.tsx
 * @desc Root layout: Nunito (body), Bricolage Grotesque (display) and JetBrains Mono (commands)
 *       as font variables, site metadata, and the header and footer around every page.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { Footer, Header } from "@/components/SiteChrome";
import { SITE } from "@/constants/site";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "harumin · the osu! Discord bot", template: "%s · harumin" },
  description: SITE.description,
  openGraph: { siteName: "harumin", type: "website", url: SITE.url },
  twitter: { card: "summary_large_image" },
};

/**
 * @function RootLayout
 * @param props {{ children: ReactNode }} the page
 * @returns {JSX.Element} the html frame
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${bricolage.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-dvh flex-col bg-b5 font-sans text-c2 antialiased">
        <a
          href="#main"
          className="sr-only rounded-full bg-h2 px-4 py-2 font-bold text-c1 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
