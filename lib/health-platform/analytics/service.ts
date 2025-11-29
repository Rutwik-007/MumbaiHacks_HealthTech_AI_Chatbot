/**
 * Health Analytics Service
 * Aggregates and processes health platform analytics data
 */

import type { SupportedLanguage, UserRole, HealthCategory } from "../types";

// ===== TYPES =====
export interface AnalyticsOverview {
  totalConversations: number;
  totalConversationsChange: number;
  uniqueUsers: number;
  uniqueUsersChange: number;
  emergencies: number;
  emergenciesChange: number;
  avgResponseTime: number;
  avgResponseTimeChange: number;
  avgSatisfaction: number;
  avgSatisfactionChange: number;
}

export interface CategoryMetric {
  category: HealthCategory;
  count: number;
  percentage: number;
}

export interface LanguageMetric {
  language: SupportedLanguage;
  count: number;
  percentage: number;
}

export interface RoleMetric {
  role: UserRole;
  count: number;
  percentage: number;
}

export interface RiskMetric {
  level: 'low' | 'medium' | 'high' | 'emergency';
  count: number;
  percentage: number;
}

export interface DailyMetric {
  date: string;
  day: string;
  count: number;
}

export interface HourlyMetric {
  hour: string;
  count: number;
}

export interface EmergencyEvent {
  id: string;
  type: string;
  language: SupportedLanguage;
  timestamp: Date;
  resolved: boolean;
  responseTime?: number;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  categoryDistribution: CategoryMetric[];
  languageDistribution: LanguageMetric[];
  roleDistribution: RoleMetric[];
  riskDistribution: RiskMetric[];
  dailyMetrics: DailyMetric[];
  hourlyMetrics: HourlyMetric[];
  recentEmergencies: EmergencyEvent[];
  generatedAt: Date;
}

export interface FeedbackSummary {
  total: number;
  avgRating: number;
  helpfulRate: number;
  ratingDistribution: { rating: number; count: number }[];
  categoryBreakdown: Record<string, number>;
  languageBreakdown: Record<SupportedLanguage, number>;
  recentTrend: 'up' | 'down' | 'stable';
}

export interface ReportData {
  period: 'weekly' | 'monthly' | 'quarterly';
  dateRange: { start: Date; end: Date };
  overview: AnalyticsOverview;
  categories: { name: string; count: number; percentage: number }[];
  languages: { name: string; code: SupportedLanguage; count: number; percentage: number }[];
  risks: { level: string; count: number; percentage: number }[];
  trends: string[];
  recommendations: string[];
  generatedAt: Date;
}

// ===== ANALYTICS AGGREGATION =====

/**
 * Calculate percentage change between two values
 */
function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return +((current - previous) / previous * 100).toFixed(1);
}

/**
 * Aggregate category distribution from conversations
 */
export function aggregateCategoryDistribution(
  conversations: Array<{ category?: HealthCategory }>
): CategoryMetric[] {
  const counts: Record<HealthCategory, number> = {
    pregnancy: 0,
    vaccines: 0,
    dengue: 0,
    malaria: 0,
    nutrition: 0,
    emergency: 0,
    child_health: 0,
    maternal_health: 0,
    general: 0,
  };

  for (const conv of conversations) {
    if (conv.category) {
      counts[conv.category]++;
    } else {
      counts.general++;
    }
  }

  const total = conversations.length || 1;
  return Object.entries(counts)
    .map(([category, count]) => ({
      category: category as HealthCategory,
      count,
      percentage: +(count / total * 100).toFixed(1),
    }))
    .filter(m => m.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Aggregate language distribution from conversations
 */
export function aggregateLanguageDistribution(
  conversations: Array<{ language?: SupportedLanguage }>
): LanguageMetric[] {
  const counts: Record<SupportedLanguage, number> = {
    en: 0,
    hi: 0,
    mr: 0,
    pa: 0,
  };

  for (const conv of conversations) {
    const lang = conv.language || 'en';
    counts[lang]++;
  }

  const total = conversations.length || 1;
  return Object.entries(counts)
    .map(([language, count]) => ({
      language: language as SupportedLanguage,
      count,
      percentage: +(count / total * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Aggregate role distribution from users
 */
export function aggregateRoleDistribution(
  users: Array<{ role?: UserRole }>
): RoleMetric[] {
  const counts: Record<UserRole, number> = {
    citizen: 0,
    asha: 0,
    officer: 0,
  };

  for (const user of users) {
    const role = user.role || 'citizen';
    counts[role]++;
  }

  const total = users.length || 1;
  return Object.entries(counts)
    .map(([role, count]) => ({
      role: role as UserRole,
      count,
      percentage: +(count / total * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Aggregate risk level distribution
 */
export function aggregateRiskDistribution(
  assessments: Array<{ riskLevel?: 'low' | 'medium' | 'high' | 'emergency' }>
): RiskMetric[] {
  const counts: Record<'low' | 'medium' | 'high' | 'emergency', number> = {
    low: 0,
    medium: 0,
    high: 0,
    emergency: 0,
  };

  for (const assessment of assessments) {
    const level = assessment.riskLevel || 'low';
    counts[level]++;
  }

  const total = assessments.length || 1;
  return Object.entries(counts)
    .map(([level, count]) => ({
      level: level as 'low' | 'medium' | 'high' | 'emergency',
      count,
      percentage: +(count / total * 100).toFixed(1),
    }));
}

/**
 * Calculate daily conversation metrics
 */
export function calculateDailyMetrics(
  conversations: Array<{ createdAt: Date }>,
  days: number = 7
): DailyMetric[] {
  const metrics: DailyMetric[] = [];
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = conversations.filter(c => {
      const convDate = new Date(c.createdAt);
      return convDate >= date && convDate < nextDate;
    }).length;

    metrics.push({
      date: date.toISOString().split('T')[0],
      day: dayNames[date.getDay()],
      count,
    });
  }

  return metrics;
}

/**
 * Calculate hourly activity metrics
 */
export function calculateHourlyMetrics(
  conversations: Array<{ createdAt: Date }>
): HourlyMetric[] {
  const hourCounts: Record<number, number> = {};
  
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }

  for (const conv of conversations) {
    const hour = new Date(conv.createdAt).getHours();
    hourCounts[hour]++;
  }

  const displayHours = [6, 8, 10, 12, 14, 16, 18, 20, 22];
  return displayHours.map(hour => ({
    hour: hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`,
    count: hourCounts[hour] + hourCounts[hour + 1],
  }));
}

/**
 * Calculate feedback summary
 */
export function calculateFeedbackSummary(
  feedback: Array<{
    rating: number;
    isHelpful?: boolean | null;
    category?: string | null;
    language?: SupportedLanguage;
    createdAt: Date;
  }>
): FeedbackSummary {
  const total = feedback.length;
  
  if (total === 0) {
    return {
      total: 0,
      avgRating: 0,
      helpfulRate: 0,
      ratingDistribution: [1, 2, 3, 4, 5].map(r => ({ rating: r, count: 0 })),
      categoryBreakdown: {},
      languageBreakdown: { en: 0, hi: 0, mr: 0, pa: 0 },
      recentTrend: 'stable',
    };
  }

  // Average rating
  const avgRating = feedback.reduce((sum, f) => sum + f.rating, 0) / total;

  // Helpful rate
  const helpfulResponses = feedback.filter(f => f.isHelpful !== null);
  const helpfulRate = helpfulResponses.length > 0
    ? helpfulResponses.filter(f => f.isHelpful === true).length / helpfulResponses.length * 100
    : 0;

  // Rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: feedback.filter(f => f.rating === rating).length,
  }));

  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  for (const f of feedback) {
    if (f.category) {
      categoryBreakdown[f.category] = (categoryBreakdown[f.category] || 0) + 1;
    }
  }

  // Language breakdown
  const languageBreakdown: Record<SupportedLanguage, number> = { en: 0, hi: 0, mr: 0, pa: 0 };
  for (const f of feedback) {
    const lang = f.language || 'en';
    languageBreakdown[lang]++;
  }

  // Recent trend (compare last week to previous week)
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const lastWeek = feedback.filter(f => new Date(f.createdAt) >= oneWeekAgo);
  const prevWeek = feedback.filter(f => {
    const d = new Date(f.createdAt);
    return d >= twoWeeksAgo && d < oneWeekAgo;
  });

  const lastWeekAvg = lastWeek.length > 0 
    ? lastWeek.reduce((sum, f) => sum + f.rating, 0) / lastWeek.length 
    : 0;
  const prevWeekAvg = prevWeek.length > 0 
    ? prevWeek.reduce((sum, f) => sum + f.rating, 0) / prevWeek.length 
    : 0;

  const recentTrend = lastWeekAvg > prevWeekAvg + 0.2 
    ? 'up' 
    : lastWeekAvg < prevWeekAvg - 0.2 
      ? 'down' 
      : 'stable';

  return {
    total,
    avgRating: +avgRating.toFixed(2),
    helpfulRate: +helpfulRate.toFixed(1),
    ratingDistribution,
    categoryBreakdown,
    languageBreakdown,
    recentTrend,
  };
}

/**
 * Generate insights based on analytics data
 */
export function generateInsights(data: AnalyticsData): string[] {
  const insights: string[] = [];

  // Category insights
  const topCategory = data.categoryDistribution[0];
  if (topCategory && topCategory.percentage > 20) {
    insights.push(
      `${topCategory.category.charAt(0).toUpperCase() + topCategory.category.slice(1)} is the most discussed topic with ${topCategory.percentage}% of conversations.`
    );
  }

  // Language insights
  const topLanguage = data.languageDistribution[0];
  if (topLanguage) {
    const langNames: Record<SupportedLanguage, string> = {
      en: 'English',
      hi: 'Hindi',
      mr: 'Marathi',
      pa: 'Punjabi',
    };
    insights.push(
      `${langNames[topLanguage.language]} is the primary language with ${topLanguage.percentage}% usage.`
    );
  }

  // Emergency insights
  const emergencyRate = data.riskDistribution.find(r => r.level === 'emergency');
  if (emergencyRate && emergencyRate.percentage > 1) {
    insights.push(
      `Emergency cases represent ${emergencyRate.percentage}% of all interactions - monitoring recommended.`
    );
  }

  // Response time insights
  if (data.overview.avgResponseTime < 3) {
    insights.push(
      `Average response time of ${data.overview.avgResponseTime}s is within optimal range.`
    );
  }

  // Growth insights
  if (data.overview.totalConversationsChange > 10) {
    insights.push(
      `Conversation volume increased by ${data.overview.totalConversationsChange}% - indicating growing adoption.`
    );
  }

  return insights;
}

/**
 * Generate recommendations based on analytics data
 */
export function generateRecommendations(data: AnalyticsData): string[] {
  const recommendations: string[] = [];

  // Category-based recommendations
  const categories = data.categoryDistribution;
  if (categories.find(c => c.category === 'dengue' && c.percentage > 10)) {
    recommendations.push(
      'Increase dengue prevention awareness content for the current season.'
    );
  }
  if (categories.find(c => c.category === 'vaccines' && c.percentage > 15)) {
    recommendations.push(
      'Implement proactive vaccination reminders based on user profiles.'
    );
  }

  // Language-based recommendations
  const underservedLangs = data.languageDistribution.filter(l => l.percentage > 5 && l.percentage < 20);
  if (underservedLangs.length > 0) {
    const langNames: Record<SupportedLanguage, string> = {
      en: 'English',
      hi: 'Hindi',
      mr: 'Marathi',
      pa: 'Punjabi',
    };
    recommendations.push(
      `Expand content library in ${underservedLangs.map(l => langNames[l.language]).join(' and ')} to serve growing demand.`
    );
  }

  // Risk-based recommendations
  const highRisk = data.riskDistribution.find(r => r.level === 'high');
  if (highRisk && highRisk.percentage > 5) {
    recommendations.push(
      'Review high-risk cases for potential follow-up and intervention opportunities.'
    );
  }

  // Performance recommendations
  if (data.overview.avgResponseTime > 3) {
    recommendations.push(
      'Optimize response time by pre-loading common knowledge base queries.'
    );
  }

  // User engagement recommendations
  if (data.overview.uniqueUsersChange < 5) {
    recommendations.push(
      'Launch community outreach programs to increase platform awareness.'
    );
  }

  return recommendations;
}
