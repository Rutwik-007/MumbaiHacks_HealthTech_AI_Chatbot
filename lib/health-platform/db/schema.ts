/**
 * Database Schema Extensions for Disease Awareness Platform
 * Extends the existing schema with health-specific tables
 */

import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user, chat } from "@/lib/db/schema";

// ===== ENUMS =====
export const userRoleEnum = pgEnum("user_role", ["citizen", "asha", "officer"]);
export const languageEnum = pgEnum("language", ["en", "hi", "mr", "pa"]);
export const healthCategoryEnum = pgEnum("health_category", [
  "pregnancy",
  "vaccines",
  "dengue",
  "malaria",
  "nutrition",
  "emergency",
  "child_health",
  "maternal_health",
  "general",
]);
export const riskLevelEnum = pgEnum("risk_level", ["low", "medium", "high", "emergency"]);
export const reminderTypeEnum = pgEnum("reminder_type", [
  "vaccine",
  "antenatal",
  "followup",
  "medication",
  "seasonal_alert",
]);

// ===== USER ROLE & PREFERENCES =====
export const userProfile = pgTable("UserProfile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").notNull().default("citizen"),
  preferredLanguage: languageEnum("preferredLanguage").notNull().default("en"),
  region: varchar("region", { length: 100 }),
  district: varchar("district", { length: 100 }),
  village: varchar("village", { length: 100 }),
  phoneNumber: varchar("phoneNumber", { length: 15 }),
  isPregnant: boolean("isPregnant").default(false),
  pregnancyWeeks: integer("pregnancyWeeks"),
  hasChildren: boolean("hasChildren").default(false),
  childrenAges: json("childrenAges").$type<number[]>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type UserProfile = InferSelectModel<typeof userProfile>;

// ===== HEALTH KNOWLEDGE BASE =====
export const healthDocument = pgTable("HealthDocument", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  category: healthCategoryEnum("category").notNull().default("general"),
  language: languageEnum("language").notNull().default("en"),
  source: varchar("source", { length: 255 }), // WHO, State Health Dept, etc.
  sourceUrl: text("sourceUrl"),
  version: integer("version").notNull().default(1),
  isActive: boolean("isActive").notNull().default(true),
  tags: json("tags").$type<string[]>(),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type HealthDocument = InferSelectModel<typeof healthDocument>;

// ===== DOCUMENT CHUNKS (for RAG) =====
export const documentChunk = pgTable("DocumentChunk", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("documentId")
    .notNull()
    .references(() => healthDocument.id, { onDelete: "cascade" }),
  chunkIndex: integer("chunkIndex").notNull(),
  content: text("content").notNull(),
  tokenCount: integer("tokenCount"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type DocumentChunk = InferSelectModel<typeof documentChunk>;

// ===== REMINDERS =====
export const reminder = pgTable("Reminder", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: reminderTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduledAt").notNull(),
  isCompleted: boolean("isCompleted").notNull().default(false),
  isSent: boolean("isSent").notNull().default(false),
  sentAt: timestamp("sentAt"),
  language: languageEnum("language").notNull().default("en"),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type Reminder = InferSelectModel<typeof reminder>;

// ===== RISK ASSESSMENTS =====
export const riskAssessment = pgTable("RiskAssessment", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  symptoms: json("symptoms").$type<string[]>().notNull(),
  severityScore: integer("severityScore").notNull(), // 1-10
  riskLevel: riskLevelEnum("riskLevel").notNull(),
  isEmergency: boolean("isEmergency").notNull().default(false),
  recommendations: json("recommendations").$type<string[]>(),
  aiAnalysis: text("aiAnalysis"),
  userAge: integer("userAge"),
  isPregnant: boolean("isPregnant"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type RiskAssessment = InferSelectModel<typeof riskAssessment>;

// ===== ASHA WORKER VISITS =====
export const ashaVisit = pgTable("AshaVisit", {
  id: uuid("id").primaryKey().defaultRandom(),
  ashaUserId: uuid("ashaUserId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  householdId: varchar("householdId", { length: 100 }).notNull(),
  householdName: varchar("householdName", { length: 255 }),
  visitDate: timestamp("visitDate").notNull(),
  visitType: varchar("visitType", { length: 50 }),
  summary: text("summary"),
  riskChecklist: json("riskChecklist").$type<{
    item: string;
    checked: boolean;
    notes?: string;
  }[]>(),
  referrals: json("referrals").$type<{
    type: string;
    facility: string;
    reason: string;
    urgent: boolean;
  }[]>(),
  followUpTasks: json("followUpTasks").$type<{
    task: string;
    dueDate: string;
    completed: boolean;
  }[]>(),
  membersChecked: integer("membersChecked"),
  pregnantWomen: integer("pregnantWomen"),
  childrenUnder5: integer("childrenUnder5"),
  language: languageEnum("language").default("en"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type AshaVisit = InferSelectModel<typeof ashaVisit>;

// ===== CONVERSATION ANALYTICS =====
export const conversationAnalytics = pgTable("ConversationAnalytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  detectedLanguage: languageEnum("detectedLanguage"),
  userRole: userRoleEnum("userRole"),
  intentCategory: varchar("intentCategory", { length: 100 }),
  topics: json("topics").$type<string[]>(),
  healthCategories: json("healthCategories").$type<string[]>(),
  hasEmergency: boolean("hasEmergency").default(false),
  riskLevel: riskLevelEnum("riskLevel"),
  region: varchar("region", { length: 100 }),
  messageCount: integer("messageCount").default(0),
  tokensUsed: integer("tokensUsed"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type ConversationAnalytics = InferSelectModel<typeof conversationAnalytics>;

// ===== HEALTH ALERTS (Seasonal/Regional) =====
export const healthAlert = pgTable("HealthAlert", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: healthCategoryEnum("category").notNull(),
  severity: riskLevelEnum("severity").notNull(),
  region: varchar("region", { length: 100 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  isActive: boolean("isActive").notNull().default(true),
  affectedDistricts: json("affectedDistricts").$type<string[]>(),
  preventionTips: json("preventionTips").$type<string[]>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type HealthAlert = InferSelectModel<typeof healthAlert>;

// ===== FEEDBACK =====
export const feedback = pgTable("Feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  chatId: uuid("chatId").references(() => chat.id, { onDelete: "set null" }),
  rating: integer("rating"), // 1-5
  comment: text("comment"),
  category: varchar("category", { length: 50 }),
  isResolved: boolean("isResolved").default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type Feedback = InferSelectModel<typeof feedback>;
