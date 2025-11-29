// Health Platform UI Components
export { LanguageSelector } from './language-selector';
export { RoleSelector } from './role-selector';
export { VoiceInputButton } from './voice-input-button';
export { VoiceOutputToggle } from './voice-output-toggle';
export { HealthChatHeader } from './health-chat-header';
export { EmergencyAlertBanner } from './emergency-alert-banner';
export { HealthChatWrapper } from './health-chat-wrapper';

// Context Provider
export { HealthPlatformProvider, useHealthPlatform } from './health-platform-provider';

// Dashboards (Phase 3)
export { AshaDashboard, OfficerDashboard } from './dashboards';

// Analytics & Reports (Phase 4)
export { AnalyticsDashboard } from './analytics';
export { FeedbackForm, InlineFeedback, type FeedbackData } from './feedback';
export { ReportGenerator } from './reports';

// User Profile & Personalization (Phase 5)
export { 
  UserProfileForm, 
  PregnancyTracker, 
  ChildHealthTracker,
  type UserProfileData 
} from './profile';

// Agentic AI Tool Results (Phase 6)
export {
  FacilityCard,
  FacilityList,
  AppointmentResult,
  WeatherAlertCard,
  SchemeEligibilityCard,
  ReminderConfirmation,
  NotificationSent,
} from './tools';
