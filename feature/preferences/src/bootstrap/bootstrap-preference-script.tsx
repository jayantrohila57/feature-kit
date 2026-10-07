"use client"

import type { PrefsLocale } from "../cookie/cookie-prefs-constants"
import type { ThemePreference } from "../schema/schema-app-preferences"

import { useSyncExternalStore } from "react"

import {
  LEGACY_LOCALE_COOKIE_NAME,
  LEGACY_THEME_COOKIE_NAME,
  PREFS_COOKIE_NAME,
  PREFS_LOCALES,
  PREFS_RTL_LOCALES,
  THEME_STORAGE_KEY,
} from "../cookie/cookie-prefs-constants"

type PreferenceBootstrapScriptProps = {
  /** Server-resolved theme for this HTML response — applied before cookie reads. */
  theme?: ThemePreference
  /** Active `[lang]` locale for this HTML response. */
  locale?: PrefsLocale | string
  /**
   * Parent domain the prefs cookie is written to (NEXT_PUBLIC_COOKIE_DOMAIN),
   * so hosts outside this origin — the IdP login page — can read the theme.
   * Unset keeps the cookie host-only.
   */
  cookieDomain?: string | undefined
}

const emptySubscribe = () => () => {}

/**
 * Blocking anti-FOUC bootstrap for theme + locale.
 *
 * React 19 warns when a `<script>` is created during a client render (scripts in
 * components never execute on the client). Emit the inline script only on the
 * server render and the matching hydration pass; return `null` afterward.
 * By then the IIFE has already run from the SSR HTML, so theme/locale stay applied.
 */
export function PreferenceBootstrapScript({ theme, locale, cookieDomain }: PreferenceBootstrapScriptProps = {}) {
  const shouldRenderScript = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true,
  )

  if (!shouldRenderScript) return null

  return (
    <script
      id="feature-kit-preference-bootstrap"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static anti-FOUC bootstrap from known constants only.
      dangerouslySetInnerHTML={{ __html: buildBootstrapScript(theme, locale, cookieDomain) }}
    />
  )
}

function buildBootstrapScript(serverTheme?: ThemePreference, serverLocale?: string, cookieDomain?: string): string {
  const serverThemeJson = JSON.stringify(serverTheme ?? null)
  const serverLocaleJson = JSON.stringify(serverLocale ?? null)
  const cookieDomainJson = JSON.stringify(cookieDomain ?? null)

  return `(function(){try{var prefsName=${JSON.stringify(PREFS_COOKIE_NAME)},themeName=${JSON.stringify(LEGACY_THEME_COOKIE_NAME)},localeName=${JSON.stringify(LEGACY_LOCALE_COOKIE_NAME)},themeKey=${JSON.stringify(THEME_STORAGE_KEY)},locales=${JSON.stringify([...PREFS_LOCALES])},rtl=${JSON.stringify([...PREFS_RTL_LOCALES])},serverTheme=${serverThemeJson},serverLocale=${serverLocaleJson},cookieDomain=${cookieDomainJson};if(cookieDomain)window.__AIQ_PREFS_COOKIE_DOMAIN__=cookieDomain;function readCookie(n){var m=document.cookie.match(new RegExp("(?:^|;\\s*)"+n+"=([^;]+)"));return m?decodeURIComponent(m[1]):null}function applyTheme(theme){if(!theme)return;try{localStorage.setItem(themeKey,theme)}catch(e){}var dark=theme==="dark"||(theme==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);document.documentElement.classList.toggle("theme-brand",theme==="brand");document.documentElement.style.colorScheme=dark?"dark":"light"}function applyLocale(locale){if(!locale||locales.indexOf(locale)<0)return;document.documentElement.lang=locale;document.documentElement.dir=rtl.indexOf(locale)>=0?"rtl":"ltr"}var prefs={};var raw=readCookie(prefsName);if(raw){try{prefs=JSON.parse(raw)||{}}catch(e){prefs={}}}var theme=serverTheme;if(theme!=="brand"&&theme!=="light"&&theme!=="dark"&&theme!=="system"){theme=prefs.theme;if(theme!=="brand"&&theme!=="light"&&theme!=="dark"&&theme!=="system"){theme=readCookie(themeName);if(theme!=="brand"&&theme!=="light"&&theme!=="dark"&&theme!=="system")theme=null}}var locale=serverLocale;if(!locale||locales.indexOf(locale)<0){locale=prefs.locale;if(!locale||locales.indexOf(locale)<0){locale=readCookie(localeName);if(!locale||locales.indexOf(locale)<0)locale=null}}applyTheme(theme);applyLocale(locale);if(cookieDomain){var sec=location.protocol==="https:";var rescope=function(n,v){if(!v)return;document.cookie=n+"=; path=/; max-age=0";document.cookie=n+"="+encodeURIComponent(v)+"; path=/; max-age=31536000; samesite=lax; domain="+cookieDomain+(sec?"; secure":"")};rescope(themeName,theme);rescope(prefsName,raw);rescope(localeName,locale)}}catch(e){}})();`
}
