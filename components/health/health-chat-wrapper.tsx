'use client';

import { useState, useCallback } from 'react';
import {
  HealthPlatformProvider,
  useHealthPlatform,
  HealthChatHeader,
  EmergencyAlertBanner,
  VoiceInputButton,
} from '@/components/health';
import { type SupportedLanguage, type UserRole } from '@/lib/health-platform';

interface HealthChatWrapperProps {
  children: React.ReactNode;
  onVoiceInput?: (transcript: string) => void;
}

function HealthChatContent({ 
  children, 
  onVoiceInput 
}: HealthChatWrapperProps) {
  const {
    language,
    role,
    voiceOutputEnabled,
    isEmergency,
    setLanguage,
    setRole,
    setVoiceOutputEnabled,
    clearEmergency,
  } = useHealthPlatform();

  return (
    <div className="flex flex-col h-full">
      {/* Emergency Alert Banner */}
      <EmergencyAlertBanner
        isVisible={isEmergency}
        language={language}
        onDismiss={clearEmergency}
      />

      {/* Health Platform Header */}
      <HealthChatHeader
        language={language}
        role={role}
        voiceEnabled={voiceOutputEnabled}
        onLanguageChange={setLanguage}
        onRoleChange={setRole}
        onVoiceToggle={setVoiceOutputEnabled}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Voice Input Button - Fixed at bottom right */}
      {onVoiceInput && (
        <div className="fixed bottom-24 right-6 z-50">
          <VoiceInputButton
            onTranscript={onVoiceInput}
            language={language}
            className="h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          />
        </div>
      )}
    </div>
  );
}

export function HealthChatWrapper({ 
  children, 
  onVoiceInput 
}: HealthChatWrapperProps) {
  return (
    <HealthPlatformProvider>
      <HealthChatContent onVoiceInput={onVoiceInput}>
        {children}
      </HealthChatContent>
    </HealthPlatformProvider>
  );
}

// Hook to get health platform context from outside the wrapper
export { useHealthPlatform } from '@/components/health';
