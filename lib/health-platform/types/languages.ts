/**
 * Language Types & Constants
 * Supported languages: English, Hindi, Marathi, Punjabi
 */

// ===== LANGUAGE TYPES =====
export type SupportedLanguage = "en" | "hi" | "mr" | "pa";

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "हिंदी (Hindi)",
  mr: "मराठी (Marathi)",
  pa: "ਪੰਜਾਬੀ (Punjabi)",
};

export const LANGUAGE_CODES: Record<string, SupportedLanguage> = {
  english: "en",
  hindi: "hi",
  marathi: "mr",
  punjabi: "pa",
};

// Language flags for UI
export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: "🇬🇧",
  hi: "🇮🇳",
  mr: "🇮🇳",
  pa: "🇮🇳",
};
