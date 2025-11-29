/**
 * User Role Types & Constants
 * Roles: Citizen, ASHA Worker, Health Officer
 */

import type { SupportedLanguage } from "./languages";

// ===== USER ROLE TYPES =====
export type UserRole = "citizen" | "asha" | "officer";

export const ROLE_NAMES: Record<UserRole, Record<SupportedLanguage, string>> = {
  citizen: {
    en: "Citizen",
    hi: "नागरिक",
    mr: "नागरिक",
    pa: "ਨਾਗਰਿਕ",
  },
  asha: {
    en: "ASHA Worker",
    hi: "आशा कार्यकर्ता",
    mr: "आशा कार्यकर्ता",
    pa: "ਆਸ਼ਾ ਵਰਕਰ",
  },
  officer: {
    en: "Health Officer",
    hi: "स्वास्थ्य अधिकारी",
    mr: "आरोग्य अधिकारी",
    pa: "ਸਿਹਤ ਅਧਿਕਾਰੀ",
  },
};

// Role icons for UI
export const ROLE_ICONS: Record<UserRole, string> = {
  citizen: "👤",
  asha: "👩‍⚕️",
  officer: "🏥",
};

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  citizen: "General public seeking health information",
  asha: "Accredited Social Health Activist - Community health worker",
  officer: "Public Health Officer / Medical Officer",
};
