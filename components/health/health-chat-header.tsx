'use client';

import { Heart } from 'lucide-react';
import { LanguageSelector } from './language-selector';
import { RoleSelector } from './role-selector';
import { VoiceOutputToggle } from './voice-output-toggle';
import { type SupportedLanguage, type UserRole } from '@/lib/health-platform';

interface HealthChatHeaderProps {
  language: SupportedLanguage;
  role: UserRole;
  voiceEnabled: boolean;
  onLanguageChange: (language: SupportedLanguage) => void;
  onRoleChange: (role: UserRole) => void;
  onVoiceToggle: (enabled: boolean) => void;
}

export function HealthChatHeader({
  language,
  role,
  voiceEnabled,
  onLanguageChange,
  onRoleChange,
  onVoiceToggle,
}: HealthChatHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-red-500">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">
              Health Assistant
            </span>
            <span className="text-xs text-muted-foreground leading-none mt-0.5">
              Disease Awareness Platform
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <VoiceOutputToggle
            value={voiceEnabled}
            onChange={onVoiceToggle}
          />
          <LanguageSelector
            value={language}
            onChange={onLanguageChange}
            compact
          />
          <RoleSelector
            value={role}
            onChange={onRoleChange}
            language={language}
            compact
          />
        </div>
      </div>
    </header>
  );
}
