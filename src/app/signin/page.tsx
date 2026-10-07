/**
 * @file src/app/signin/page.tsx
 * @desc /signin?next=: sends the visitor straight to osu! by way of the hub's /api/signin/osu,
 *       and back to `next` on this site.
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Oct 7, 2026
 * @modified Wed Oct 7, 2026
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signInHref } from "@/lib/auth";

/** /signin's title; it's never indexed. */
export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

/**
 * @function SignInPage
 * @param props {PageProps<"/signin">} `next`
 * @returns {Promise<never>} a redirect to the hub's sign-in
 */
export default async function SignInPage({ searchParams }: PageProps<"/signin">): Promise<never> {
  const { next } = await searchParams;
  redirect(signInHref(typeof next === "string" ? next : "/dashboard"));
}
