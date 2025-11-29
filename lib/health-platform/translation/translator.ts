/**
 * Translation Module - Using OpenAI (FREE with your existing API key)
 * No additional paid services required!
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { SupportedLanguage } from "../types";
import { LANGUAGE_NAMES, HEALTH_PHRASES } from "../types";

/**
 * Detect the language of input text using GPT
 * Uses your existing OpenAI API key - no extra cost for small texts
 */
export async function detectLanguage(text: string): Promise<SupportedLanguage> {
  // Quick check for common language patterns first (FREE - no API call)
  const hindiPattern = /[\u0900-\u097F]/;
  const punjabiPattern = /[\u0A00-\u0A7F]/;

  // Check for Punjabi first (unique script)
  if (punjabiPattern.test(text)) {
    return "pa";
  }

  // Check for Devanagari (Hindi/Marathi)
  if (hindiPattern.test(text)) {
    // Use some common Marathi-specific words to differentiate
    const marathiWords = ["आहे", "नाही", "काय", "कसे", "तुम्ही", "मला", "आरोग्य"];
    const hasMarathiWords = marathiWords.some((word) => text.includes(word));
    
    if (hasMarathiWords) {
      return "mr";
    }
    return "hi";
  }

  // If mostly ASCII, assume English
  const asciiRatio = (text.match(/[\x00-\x7F]/g)?.length || 0) / text.length;
  if (asciiRatio > 0.8) {
    return "en";
  }

  // Fallback: Use GPT for complex cases
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o-mini"), // Cheapest model
      system: `Detect the language. Return ONLY one of: en, hi, mr, pa
      - en = English
      - hi = Hindi  
      - mr = Marathi
      - pa = Punjabi
      If unsure, return "en".`,
      prompt: text.slice(0, 200), // Limit to 200 chars to save tokens
    });

    const detected = result.trim().toLowerCase() as SupportedLanguage;
    return ["en", "hi", "mr", "pa"].includes(detected) ? detected : "en";
  } catch (error) {
    console.error("Language detection error:", error);
    return "en"; // Default to English
  }
}

/**
 * Translate text using GPT (uses your existing OpenAI key)
 */
export async function translateText(
  text: string,
  targetLanguage: SupportedLanguage,
  sourceLanguage?: SupportedLanguage
): Promise<string> {
  // Skip translation if same language
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  // Skip if target is English and text appears to be English
  if (targetLanguage === "en" && /^[\x00-\x7F\s]+$/.test(text)) {
    return text;
  }

  try {
    const { text: translated } = await generateText({
      model: openai("gpt-4o-mini"), // Cheapest model
      system: `You are a medical translator for rural India. 
Translate to ${LANGUAGE_NAMES[targetLanguage]}.

Rules:
- Use simple, easy-to-understand language
- Keep medical terms accurate but explain them simply
- Maintain cultural sensitivity for Indian audiences
- Keep the same tone (urgent if urgent, calm if calm)
- Do NOT add or remove information
- Return ONLY the translated text`,
      prompt: text,
    });

    return translated.trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original if translation fails
  }
}

/**
 * Get a localized phrase (FREE - no API call)
 */
export function getLocalizedPhrase(
  key: string,
  language: SupportedLanguage
): string {
  const phrases = HEALTH_PHRASES[language];
  return phrases?.[key] || HEALTH_PHRASES["en"]?.[key] || key;
}

/**
 * Translate multiple texts in batch (more efficient)
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: SupportedLanguage
): Promise<string[]> {
  if (texts.length === 0) return [];
  
  // For small batches, translate individually
  if (texts.length <= 3) {
    return Promise.all(texts.map((t) => translateText(t, targetLanguage)));
  }

  // For larger batches, combine into one request
  try {
    const combined = texts.map((t, i) => `[${i}] ${t}`).join("\n---\n");
    
    const { text: result } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `Translate each numbered item to ${LANGUAGE_NAMES[targetLanguage]}.
Keep the [number] prefix. Separate items with ---
Return ONLY translations, nothing else.`,
      prompt: combined,
    });

    // Parse the results
    const translatedItems = result.split("---").map((item) => {
      return item.replace(/^\[\d+\]\s*/, "").trim();
    });

    return translatedItems;
  } catch (error) {
    console.error("Batch translation error:", error);
    return texts; // Return originals if failed
  }
}

/**
 * Create a response in the user's language
 */
export async function createLocalizedResponse(
  englishResponse: string,
  userLanguage: SupportedLanguage
): Promise<string> {
  if (userLanguage === "en") {
    return englishResponse;
  }

  const translated = await translateText(englishResponse, userLanguage, "en");
  const disclaimer = getLocalizedPhrase("disclaimer", userLanguage);
  
  return `${translated}\n\n${disclaimer}`;
}
