'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { type SupportedLanguage, LANGUAGE_NAMES } from '@/lib/health-platform';

const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: '🇬🇧',
  hi: '🇮🇳',
  mr: '🇮🇳',
  pa: '🇮🇳',
};

const LANGUAGE_SHORT: Record<SupportedLanguage, string> = {
  en: 'EN',
  hi: 'हि',
  mr: 'म',
  pa: 'ਪੰ',
};

interface LanguageSelectorProps {
  value?: SupportedLanguage;
  onChange?: (language: SupportedLanguage) => void;
  compact?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  compact = false,
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    value || 'en'
  );

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('health-platform-language');
    if (saved && ['en', 'hi', 'mr', 'pa'].includes(saved)) {
      setSelectedLanguage(saved as SupportedLanguage);
    }
  }, []);

  // Sync with prop value
  useEffect(() => {
    if (value) {
      setSelectedLanguage(value);
    }
  }, [value]);

  const handleSelect = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    localStorage.setItem('health-platform-language', lang);
    onChange?.(lang);
  };

  const languages: SupportedLanguage[] = ['en', 'hi', 'mr', 'pa'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          className="gap-2 min-w-[100px]"
        >
          <span>{LANGUAGE_FLAGS[selectedLanguage]}</span>
          <span className="hidden sm:inline">
            {compact
              ? LANGUAGE_SHORT[selectedLanguage]
              : LANGUAGE_NAMES[selectedLanguage]}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleSelect(lang)}
            className={`gap-3 cursor-pointer ${
              selectedLanguage === lang ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{LANGUAGE_FLAGS[lang]}</span>
            <span>{LANGUAGE_NAMES[lang]}</span>
            {selectedLanguage === lang && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
