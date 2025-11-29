/**
 * Disease Awareness Health Platform
 * 
 * A comprehensive multilingual health chatbot platform for India
 * Supporting: English, Hindi, Marathi, Punjabi
 * Roles: Citizens, ASHA Workers, Health Officers
 * 
 * ALL FREE SERVICES:
 * - ChromaDB: In-process vector database (no Docker)
 * - Web Speech API: Browser-based voice I/O
 * - OpenAI API: Your existing key for translations
 * 
 * Folder Structure:
 * lib/health-platform/
 * ├── index.ts          # Main exports (this file)
 * ├── types/            # Type definitions
 * │   ├── languages.ts  # Language types & constants
 * │   ├── roles.ts      # User role types
 * │   ├── categories.ts # Health categories & risk levels
 * │   ├── constants.ts  # Emergency keywords, phrases, vaccine schedules
 * │   └── index.ts      # Central type exports
 * ├── ai/               # AI-related modules
 * │   ├── prompts.ts    # System prompts for each role
 * │   ├── tools.ts      # Agentic AI tools
 * │   └── index.ts      # AI exports
 * ├── rag/              # Retrieval Augmented Generation
 * │   └── vector-store.ts  # ChromaDB integration
 * ├── translation/      # Language translation
 * │   └── translator.ts # GPT-based translation
 * ├── voice/            # Voice I/O
 * │   └── speech.ts     # Web Speech API integration
 * └── db/               # Database schema
 *     └── schema.ts     # Drizzle ORM schema
 */

// ===== TYPE EXPORTS =====
export * from "./types";

// ===== AI MODULE EXPORTS =====
export {
  getHealthAgentPrompt,
  getRAGContextPrompt,
  getEmergencyPrompt,
  getCategoryPrompt,
} from "./ai/prompts";

export {
  searchHealthKnowledge,
  detectEmergency,
  getVaccineSchedule,
  assessRiskLevel,
  getHealthSchemeInfo,
  getNearbyFacilities,
  healthTools,
} from "./ai/tools";

// ===== RAG MODULE EXPORTS =====
export {
  initializeVectorStore,
  generateEmbedding,
  generateEmbeddings,
  addDocument,
  addDocuments,
  searchDocuments,
  deleteDocument,
  getCollectionStats,
  clearCollection,
} from "./rag/vector-store";

// ===== TRANSLATION MODULE EXPORTS =====
export {
  detectLanguage,
  translateText,
  translateBatch,
  getLocalizedPhrase,
  createLocalizedResponse,
} from "./translation/translator";

// ===== VOICE MODULE EXPORTS =====
export {
  isSpeechRecognitionAvailable,
  isSpeechSynthesisAvailable,
  getVoicesForLanguage,
  getBestVoice,
  speak,
  stopSpeaking,
  isSpeaking,
  startListening,
  stopListening,
  isListening,
  preloadVoices,
  type TTSConfig,
  type STTConfig,
} from "./voice/speech";

// ===== DATABASE SCHEMA EXPORTS =====
export {
  userRoleEnum,
  languageEnum,
  healthCategoryEnum,
  riskLevelEnum,
  reminderTypeEnum,
  userProfile,
  healthDocument,
  documentChunk,
  reminder,
  riskAssessment,
  ashaVisit,
  conversationAnalytics,
  healthAlert,
  feedback,
  type UserProfile,
  type HealthDocument,
  type DocumentChunk,
  type Reminder,
  type RiskAssessment,
  type AshaVisit,
  type ConversationAnalytics,
  type HealthAlert,
  type Feedback,
} from "./db/schema";

// ===== ANALYTICS SERVICE EXPORTS (Phase 4) =====
export {
  // Types
  type AnalyticsOverview,
  type CategoryMetric,
  type LanguageMetric,
  type RoleMetric,
  type RiskMetric,
  type DailyMetric,
  type HourlyMetric,
  type EmergencyEvent,
  type AnalyticsData,
  type FeedbackSummary,
  type ReportData,
  // Functions
  aggregateCategoryDistribution,
  aggregateLanguageDistribution,
  aggregateRoleDistribution,
  aggregateRiskDistribution,
  calculateDailyMetrics,
  calculateHourlyMetrics,
  calculateFeedbackSummary,
  generateInsights,
  generateRecommendations,
} from "./analytics";
