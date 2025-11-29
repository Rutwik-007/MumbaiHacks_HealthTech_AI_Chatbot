// Health Analytics Service
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
} from './service';
