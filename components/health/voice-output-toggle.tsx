'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceOutputToggleProps {
  value?: boolean;
  onChange?: (enabled: boolean) => void;
  className?: string;
}

export function VoiceOutputToggle({
  value,
  onChange,
  className,
}: VoiceOutputToggleProps) {
  const [isEnabled, setIsEnabled] = useState(value ?? false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('health-platform-voice-output');
    if (saved !== null) {
      setIsEnabled(saved === 'true');
    }
  }, []);

  // Sync with prop value
  useEffect(() => {
    if (value !== undefined) {
      setIsEnabled(value);
    }
  }, [value]);

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('health-platform-voice-output', String(newValue));
    onChange?.(newValue);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      title={isEnabled ? 'Disable voice output' : 'Enable voice output'}
      className={cn(
        isEnabled && 'text-green-600 dark:text-green-400',
        className
      )}
    >
      {isEnabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </Button>
  );
}
