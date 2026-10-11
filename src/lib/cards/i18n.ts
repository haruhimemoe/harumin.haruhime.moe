/**
 * @file src/lib/cards/i18n.ts
 * @desc The card images' words in the asker's language. harumin sends its catalog locale as
 *       Accept-Language; renderCard draws the card inside withCardLocale, and each card file's
 *       scope("cards.profile") t() reads that translator when satori calls the component. Outside a
 *       render, English.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 11, 2026
 * @modified Sun Oct 11, 2026
 */

import { AsyncLocalStorage } from "node:async_hooks";
import { LOCALES, loadMessages } from "@haruhimemoe/messages";
import { negotiateLocale } from "@haruhimemoe/next-kit/i18n";
import { createTranslator } from "use-intl/core";

/** ICU values. */
type Values = Record<string, string | number | Date>;
/** A card file's translator: a key under its scope and the values. */
export type CardT = (key: string, values?: Values) => string;
type Translator = (key: string, values?: Values) => string;

const NAMESPACE = "harumin-site";
// The site's locales, without importing the request config (it loads next-intl's middleware).
const LOCALE_CONFIG = { locales: LOCALES, defaultLocale: "en" };

const translatorFor = async (locale: string): Promise<Translator> =>
  createTranslator({
    locale,
    messages: await loadMessages(locale, NAMESPACE),
    namespace: NAMESPACE,
  }) as unknown as Translator;

const english = await translatorFor("en");
const current = new AsyncLocalStorage<Translator>();

/**
 * @function withCardLocale
 * @param acceptLanguage {string | null} the request's Accept-Language (harumin's locale)
 * @param run {() => R} the drawing
 * @returns {Promise<R>} what run returns, drawn in that language
 */
export const withCardLocale = async <R>(
  acceptLanguage: string | null,
  run: () => R,
): Promise<R> => {
  const locale = negotiateLocale(LOCALE_CONFIG, acceptLanguage);
  const t = locale === "en" ? english : await translatorFor(locale);
  return current.run(t, run);
};

/**
 * @function scope
 * @param prefix {string} a card file's part of "harumin-site", like "cards.profile"
 * @returns {CardT} t(key, values), read when it's called
 */
export const scope =
  (prefix: string): CardT =>
  (key, values) =>
    (current.getStore() ?? english)(`${prefix}.${key}`, values);
