/**
 * @file src/app/layout.tsx
 * @desc Root layout: Nunito font variable, site metadata, the light page, the library PageShell
 *       frame around the harumin header and footer, and the command palette (mounted once so its
 *       Ctrl K / Cmd K hotkey works from any page).
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Wed Oct 7, 2026
 */

import { siteMetadata } from "@haruhimemoe/next-kit/seo";
import { PageShell } from "@haruhimemoe/ui";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { AppPalette } from "@/components/layout/AppPalette";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SEO_SITE } from "@/constants/seo";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

/** The site's default title and "%s · harumin.haruhime.moe" template, description and preview. */
export const metadata = siteMetadata(SEO_SITE);

/**
 * @function RootLayout
 * @param props {{ children: ReactNode }} the page
 * @returns {JSX.Element} the html frame: header, the page and the footer
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="bg-b5 font-sans text-c2 antialiased">
        <AppPalette />
        <PageShell header={<Header />} footer={<Footer />}>
          {children}
        </PageShell>
      </body>
    </html>
  );
}
