"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import Script from "next/script"

export const LANGUAGES = [
  ["English", "English", "en"], ["Romanian", "Română", "ro"], ["Italian", "Italiano", "it"], ["Spanish", "Español", "es"], ["German", "Deutsch", "de"],
  ["French", "Français", "fr"], ["Portuguese", "Português", "pt"], ["Dutch", "Nederlands", "nl"], ["Polish", "Polski", "pl"], ["Czech", "Čeština", "cs"],
  ["Slovak", "Slovenčina", "sk"], ["Hungarian", "Magyar", "hu"], ["Greek", "Ελληνικά", "el"], ["Turkish", "Türkçe", "tr"], ["Arabic", "العربية", "ar"],
  ["Hebrew", "עברית", "he"], ["Hindi", "हिन्दी", "hi"], ["Bengali", "বাংলা", "bn"], ["Urdu", "اردو", "ur"], ["Persian", "فارسی", "fa"],
  ["Chinese Simplified", "简体中文", "zh-CN"], ["Chinese Traditional", "繁體中文", "zh-TW"], ["Japanese", "日本語", "ja"], ["Korean", "한국어", "ko"], ["Vietnamese", "Tiếng Việt", "vi"],
  ["Thai", "ไทย", "th"], ["Indonesian", "Bahasa Indonesia", "id"], ["Malay", "Bahasa Melayu", "ms"], ["Filipino", "Filipino", "tl"], ["Swedish", "Svenska", "sv"],
  ["Norwegian", "Norsk", "no"], ["Danish", "Dansk", "da"], ["Finnish", "Suomi", "fi"], ["Ukrainian", "Українська", "uk"], ["Bulgarian", "Български", "bg"],
  ["Croatian", "Hrvatski", "hr"], ["Serbian", "Српски", "sr"], ["Slovenian", "Slovenščina", "sl"],
] as const

type LanguageName = (typeof LANGUAGES)[number][0]

const LanguageContext = createContext<{
  language: LanguageName
  setLanguage: (v: LanguageName) => void
}>({ language: "English", setLanguage: () => {} })

function getCookie(name: string) {
  if (typeof document === "undefined") return ""
  const found = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
  return found ? decodeURIComponent(found.split("=").slice(1).join("=")) : ""
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=31536000;SameSite=Lax`
}

function clearGoogleTranslation() {
  document.cookie = "googtrans=;path=/;max-age=0"
  document.cookie = "googtrans=;path=/;domain=" + window.location.hostname + ";max-age=0"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageName>("English")

  useEffect(() => {
    const saved = localStorage.getItem("viralforge-language") as LanguageName | null
    const validSaved = saved && LANGUAGES.some(([name]) => name === saved)
    if (validSaved) setLanguageState(saved)

    const googleCookie = getCookie("googtrans")
    if (!saved && googleCookie) {
      const code = googleCookie.split("/").pop()
      const match = LANGUAGES.find(([, , langCode]) => langCode === code)
      if (match) setLanguageState(match[0])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("viralforge-language", language)
    const selected = LANGUAGES.find(([name]) => name === language)
    const code = selected?.[2] || "en"
    document.documentElement.lang = code
    document.documentElement.dir = ["ar", "he", "fa", "ur"].includes(code) ? "rtl" : "ltr"
  }, [language])

  const setLanguage = (next: LanguageName) => {
    const selected = LANGUAGES.find(([name]) => name === next)
    const code = selected?.[2] || "en"
    setLanguageState(next)
    localStorage.setItem("viralforge-language", next)

    if (code === "en") {
      clearGoogleTranslation()
    } else {
      setCookie("googtrans", `/en/${code}`)
      setCookie("googtrans", `/en/${code}`)
    }

    // Google Translate translates the complete rendered page, including dynamically
    // added dashboard content. Reloading guarantees a clean translation state.
    window.location.reload()
  }

  const value = useMemo(() => ({ language, setLanguage }), [language])

  return (
    <LanguageContext.Provider value={value}>
      <Script
        id="google-translate-loader"
        strategy="afterInteractive"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
      <div id="google_translate_element" className="hidden" aria-hidden="true" />
      <style>{`
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0 !important; }
        .goog-tooltip, .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background: transparent !important; box-shadow: none !important; }
        .skiptranslate > iframe { display: none !important; }
      `}</style>
      {children}
      <LanguageSwitcher />
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  return (
    <div className="fixed right-4 top-3 z-[100]" translate="no">
      <label className="sr-only" htmlFor="viralforge-global-language">Language</label>
      <select
        id="viralforge-global-language"
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageName)}
        className="h-9 max-w-[180px] rounded-lg border border-border bg-card/95 px-3 text-xs font-medium text-foreground shadow-lg backdrop-blur-md outline-none"
      >
        {LANGUAGES.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  )
}

// Google Translate calls this global callback after loading its script.
if (typeof window !== "undefined") {
  ;(window as any).googleTranslateElementInit = () => {
    const google = (window as any).google
    if (google?.translate?.TranslateElement) {
      new google.translate.TranslateElement({
        pageLanguage: "en",
        autoDisplay: false,
        includedLanguages: LANGUAGES.map(([, , code]) => code).join(","),
      }, "google_translate_element")
    }
  }
}
