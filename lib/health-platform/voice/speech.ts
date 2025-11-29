/**
 * Voice I/O using Web Speech API - 100% FREE
 * Works in all modern browsers without any API keys!
 * 
 * This is a client-side module - must be used in React components
 */

import type { SupportedLanguage } from "../types";

// Web Speech API types (not in default TypeScript lib)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Language codes for Web Speech API
const SPEECH_LANG_CODES: Record<SupportedLanguage, string> = {
  en: "en-IN", // English (India)
  hi: "hi-IN", // Hindi
  mr: "mr-IN", // Marathi
  pa: "pa-IN", // Punjabi
};

// Voice preferences for each language
const VOICE_PREFERENCES: Record<SupportedLanguage, string[]> = {
  en: ["Google हिन्दी", "Microsoft Neerja", "Google UK English Female"],
  hi: ["Google हिन्दी", "Microsoft Kalpana", "hi-IN"],
  mr: ["Google मराठी", "mr-IN"],
  pa: ["Google ਪੰਜਾਬੀ", "pa-IN"],
};

/**
 * Check if Speech Recognition is available
 */
export function isSpeechRecognitionAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

/**
 * Check if Speech Synthesis is available
 */
export function isSpeechSynthesisAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window;
}

/**
 * Get available voices for a language
 */
export function getVoicesForLanguage(language: SupportedLanguage): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisAvailable()) return [];
  
  const voices = window.speechSynthesis.getVoices();
  const langCode = SPEECH_LANG_CODES[language];
  
  return voices.filter(
    (voice) =>
      voice.lang.startsWith(langCode.split("-")[0]) ||
      voice.lang === langCode
  );
}

/**
 * Get best voice for a language
 */
export function getBestVoice(language: SupportedLanguage): SpeechSynthesisVoice | null {
  const voices = getVoicesForLanguage(language);
  if (voices.length === 0) return null;

  const preferences = VOICE_PREFERENCES[language];
  
  // Try to find preferred voice
  for (const pref of preferences) {
    const voice = voices.find(
      (v) => v.name.includes(pref) || v.lang === pref
    );
    if (voice) return voice;
  }

  // Return first available
  return voices[0];
}

/**
 * Text-to-Speech configuration
 */
export interface TTSConfig {
  language: SupportedLanguage;
  rate?: number; // 0.1 to 10, default 1
  pitch?: number; // 0 to 2, default 1
  volume?: number; // 0 to 1, default 1
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * Speak text using Web Speech API (FREE!)
 */
export function speak(text: string, config: TTSConfig): void {
  if (!isSpeechSynthesisAvailable()) {
    config.onError?.("Speech synthesis not available");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language
  utterance.lang = SPEECH_LANG_CODES[config.language];
  
  // Set voice
  const voice = getBestVoice(config.language);
  if (voice) {
    utterance.voice = voice;
  }
  
  // Set parameters
  utterance.rate = config.rate ?? 1;
  utterance.pitch = config.pitch ?? 1;
  utterance.volume = config.volume ?? 1;
  
  // Set callbacks
  utterance.onstart = () => config.onStart?.();
  utterance.onend = () => config.onEnd?.();
  utterance.onerror = (event) => config.onError?.(event.error);
  
  // Speak!
  window.speechSynthesis.speak(utterance);
}

/**
 * Stop speaking
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisAvailable()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Check if currently speaking
 */
export function isSpeaking(): boolean {
  if (!isSpeechSynthesisAvailable()) return false;
  return window.speechSynthesis.speaking;
}

/**
 * Speech-to-Text configuration
 */
export interface STTConfig {
  language: SupportedLanguage;
  continuous?: boolean; // Keep listening after pause
  interimResults?: boolean; // Return partial results
  onResult?: (transcript: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * Speech Recognition instance type
 */
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

let currentRecognition: SpeechRecognitionInstance | null = null;

/**
 * Start speech recognition (FREE!)
 */
export function startListening(config: STTConfig): void {
  if (!isSpeechRecognitionAvailable()) {
    config.onError?.("Speech recognition not available");
    return;
  }

  // Stop any existing recognition
  stopListening();

  // Create recognition instance
  const SpeechRecognition =
    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
  
  const recognition = new (SpeechRecognition as new () => SpeechRecognitionInstance)();
  
  // Configure
  recognition.continuous = config.continuous ?? false;
  recognition.interimResults = config.interimResults ?? true;
  recognition.lang = SPEECH_LANG_CODES[config.language];
  
  // Handle results
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;
    const isFinal = result.isFinal;
    config.onResult?.(transcript, isFinal);
  };
  
  // Handle events
  recognition.onstart = () => config.onStart?.();
  recognition.onend = () => {
    currentRecognition = null;
    config.onEnd?.();
  };
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    config.onError?.(event.error);
  };
  
  // Start listening
  currentRecognition = recognition;
  recognition.start();
}

/**
 * Stop speech recognition
 */
export function stopListening(): void {
  if (currentRecognition) {
    currentRecognition.stop();
    currentRecognition = null;
  }
}

/**
 * Check if currently listening
 */
export function isListening(): boolean {
  return currentRecognition !== null;
}

/**
 * Preload voices (call on app init)
 * Some browsers need this to load voices
 */
export function preloadVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisAvailable()) {
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
      return;
    }

    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      resolve();
    };

    // Timeout fallback
    setTimeout(resolve, 1000);
  });
}
