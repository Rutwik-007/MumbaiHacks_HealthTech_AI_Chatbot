'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, Heart, Building2 } from 'lucide-react';
import { type UserRole, type SupportedLanguage, ROLE_NAMES } from '@/lib/health-platform';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  citizen: <User className="h-4 w-4" />,
  asha: <Heart className="h-4 w-4" />,
  officer: <Building2 className="h-4 w-4" />,
};

const ROLE_COLORS: Record<UserRole, string> = {
  citizen: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  asha: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  officer: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
};

const ROLE_DESCRIPTIONS: Record<UserRole, Record<string, string>> = {
  citizen: {
    en: 'General health information',
    hi: 'सामान्य स्वास्थ्य जानकारी',
    mr: 'सामान्य आरोग्य माहिती',
    pa: 'ਆਮ ਸਿਹਤ ਜਾਣਕਾਰੀ',
  },
  asha: {
    en: 'Community health worker tools',
    hi: 'सामुदायिक स्वास्थ्य कार्यकर्ता उपकरण',
    mr: 'समुदाय आरोग्य कार्यकर्ता साधने',
    pa: 'ਭਾਈਚਾਰਕ ਸਿਹਤ ਵਰਕਰ ਟੂਲ',
  },
  officer: {
    en: 'Health officer analytics & management',
    hi: 'स्वास्थ्य अधिकारी विश्लेषण और प्रबंधन',
    mr: 'आरोग्य अधिकारी विश्लेषण आणि व्यवस्थापन',
    pa: 'ਸਿਹਤ ਅਧਿਕਾਰੀ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਪ੍ਰਬੰਧਨ',
  },
};

interface RoleSelectorProps {
  value?: UserRole;
  onChange?: (role: UserRole) => void;
  language?: string;
  compact?: boolean;
}

export function RoleSelector({
  value,
  onChange,
  language = 'en',
  compact = false,
}: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(value || 'citizen');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('health-platform-role');
    if (saved && ['citizen', 'asha', 'officer'].includes(saved)) {
      setSelectedRole(saved as UserRole);
    }
  }, []);

  // Sync with prop value
  useEffect(() => {
    if (value) {
      setSelectedRole(value);
    }
  }, [value]);

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role);
    localStorage.setItem('health-platform-role', role);
    onChange?.(role);
  };

  const roles: UserRole[] = ['citizen', 'asha', 'officer'];
  const lang: SupportedLanguage = ['en', 'hi', 'mr', 'pa'].includes(language) 
    ? (language as SupportedLanguage) 
    : 'en';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          className={`gap-2 ${ROLE_COLORS[selectedRole]}`}
        >
          {ROLE_ICONS[selectedRole]}
          <span className="hidden sm:inline">
            {ROLE_NAMES[selectedRole][lang]}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleSelect(role)}
            className={`flex flex-col items-start gap-1 cursor-pointer p-3 ${
              selectedRole === role ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <span className={`p-1 rounded ${ROLE_COLORS[role]}`}>
                {ROLE_ICONS[role]}
              </span>
              <span className="font-medium">{ROLE_NAMES[role][lang]}</span>
              {selectedRole === role && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground ml-7">
              {ROLE_DESCRIPTIONS[role][lang]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
