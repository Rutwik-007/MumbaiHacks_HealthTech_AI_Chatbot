'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { type SupportedLanguage, LANGUAGE_CODES } from '@/lib/health-platform';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: SupportedLanguage;
  disabled?: boolean;
  className?: string;
}

export function VoiceInputButton({
  onTranscript,
  language = 'en',
  disabled = false,
  className,
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = LANGUAGE_CODES[language] || 'en-US';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognitionInstance;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscript]);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = LANGUAGE_CODES[language] || 'en-US';
    }
  }, [language]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  }, [isListening]);

  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        title="Speech recognition not supported in this browser"
        className={className}
      >
        <MicOff className="h-5 w-5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant={isListening ? 'default' : 'ghost'}
      size="icon"
      onClick={toggleListening}
      disabled={disabled}
      title={isListening ? 'Stop listening' : 'Start voice input'}
      className={cn(
        isListening && 'bg-red-500 hover:bg-red-600 animate-pulse',
        className
      )}
    >
      {isListening ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
}
