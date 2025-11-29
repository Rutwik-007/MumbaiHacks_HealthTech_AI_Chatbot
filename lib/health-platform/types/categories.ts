/**
 * Health Category Types & Constants
 */

import type { SupportedLanguage } from "./languages";

// ===== HEALTH CATEGORY TYPES =====
export type HealthCategory =
  | "pregnancy"
  | "vaccines"
  | "dengue"
  | "malaria"
  | "nutrition"
  | "emergency"
  | "child_health"
  | "maternal_health"
  | "general";

export const HEALTH_CATEGORIES: Record<HealthCategory, Record<SupportedLanguage, string>> = {
  pregnancy: {
    en: "Pregnancy Care",
    hi: "गर्भावस्था देखभाल",
    mr: "गर्भधारणा काळजी",
    pa: "ਗਰਭ ਅਵਸਥਾ ਦੇਖਭਾਲ",
  },
  vaccines: {
    en: "Vaccines & Immunization",
    hi: "टीकाकरण",
    mr: "लसीकरण",
    pa: "ਟੀਕਾਕਰਨ",
  },
  dengue: {
    en: "Dengue",
    hi: "डेंगू",
    mr: "डेंग्यू",
    pa: "ਡੇਂਗੂ",
  },
  malaria: {
    en: "Malaria",
    hi: "मलेरिया",
    mr: "मलेरिया",
    pa: "ਮਲੇਰੀਆ",
  },
  nutrition: {
    en: "Nutrition",
    hi: "पोषण",
    mr: "पोषण",
    pa: "ਪੋਸ਼ਣ",
  },
  emergency: {
    en: "Emergency",
    hi: "आपातकाल",
    mr: "आणीबाणी",
    pa: "ਐਮਰਜੈਂਸੀ",
  },
  child_health: {
    en: "Child Health",
    hi: "बाल स्वास्थ्य",
    mr: "बाल आरोग्य",
    pa: "ਬਾਲ ਸਿਹਤ",
  },
  maternal_health: {
    en: "Maternal Health",
    hi: "मातृ स्वास्थ्य",
    mr: "मातृ आरोग्य",
    pa: "ਮਾਂ ਦੀ ਸਿਹਤ",
  },
  general: {
    en: "General Health",
    hi: "सामान्य स्वास्थ्य",
    mr: "सामान्य आरोग्य",
    pa: "ਆਮ ਸਿਹਤ",
  },
};

// Category icons for UI
export const CATEGORY_ICONS: Record<HealthCategory, string> = {
  pregnancy: "🤰",
  vaccines: "💉",
  dengue: "🦟",
  malaria: "🦟",
  nutrition: "🥗",
  emergency: "🚨",
  child_health: "👶",
  maternal_health: "👩‍👧",
  general: "🏥",
};

// ===== RISK LEVEL TYPES =====
export type RiskLevel = "low" | "medium" | "high" | "emergency";

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#22c55e", // green
  medium: "#f59e0b", // amber
  high: "#ef4444", // red
  emergency: "#dc2626", // dark red
};

// ===== REMINDER TYPES =====
export type ReminderType =
  | "vaccine"
  | "antenatal"
  | "followup"
  | "medication"
  | "seasonal_alert";

// ===== INTENT TYPES (for Agentic AI) =====
export type HealthIntent =
  | "symptom_check"
  | "vaccine_info"
  | "pregnancy_query"
  | "emergency"
  | "nutrition_advice"
  | "scheme_info"
  | "reminder_request"
  | "general_query";
