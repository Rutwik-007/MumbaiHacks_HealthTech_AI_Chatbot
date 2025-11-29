'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Phone, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type SupportedLanguage, speak, stopSpeaking, isSpeaking } from '@/lib/health-platform';
import { cn } from '@/lib/utils';

const EMERGENCY_MESSAGES: Record<SupportedLanguage, {
  title: string;
  description: string;
  callText: string;
  dismissText: string;
  voiceAlert: string;
}> = {
  en: {
    title: '🚨 Emergency Detected!',
    description: 'Your message indicates a medical emergency. Please seek immediate help.',
    callText: 'Call 108 (Ambulance)',
    dismissText: 'Dismiss',
    voiceAlert: 'Emergency detected! Please call 108 for an ambulance immediately, or visit your nearest hospital.',
  },
  hi: {
    title: '🚨 आपातकालीन स्थिति!',
    description: 'आपके संदेश में चिकित्सा आपातकाल का संकेत है। कृपया तुरंत मदद लें।',
    callText: '108 पर कॉल करें (एम्बुलेंस)',
    dismissText: 'खारिज करें',
    voiceAlert: 'आपातकालीन स्थिति! कृपया तुरंत 108 पर कॉल करें या अपने निकटतम अस्पताल जाएं।',
  },
  mr: {
    title: '🚨 आणीबाणी आढळली!',
    description: 'तुमच्या संदेशात वैद्यकीय आणीबाणीचे संकेत आहेत. कृपया त्वरित मदत घ्या।',
    callText: '108 वर कॉल करा (रुग्णवाहिका)',
    dismissText: 'बंद करा',
    voiceAlert: 'आणीबाणी आढळली! कृपया लगेच 108 वर कॉल करा किंवा जवळच्या रुग्णालयात जा।',
  },
  pa: {
    title: '🚨 ਐਮਰਜੈਂਸੀ ਦਾ ਪਤਾ ਲੱਗਿਆ!',
    description: 'ਤੁਹਾਡੇ ਸੁਨੇਹੇ ਵਿੱਚ ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਦਾ ਸੰਕੇਤ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਮਦਦ ਲਓ।',
    callText: '108 ਤੇ ਕਾਲ ਕਰੋ (ਐਂਬੂਲੈਂਸ)',
    dismissText: 'ਖਾਰਜ ਕਰੋ',
    voiceAlert: 'ਐਮਰਜੈਂਸੀ ਦਾ ਪਤਾ ਲੱਗਿਆ! ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ 108 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨੇੜੇ ਦੇ ਹਸਪਤਾਲ ਜਾਓ।',
  },
};

interface EmergencyAlertBannerProps {
  isVisible: boolean;
  language?: SupportedLanguage;
  onDismiss?: () => void;
  className?: string;
  autoSpeak?: boolean; // Auto-speak the emergency alert
}

export function EmergencyAlertBanner({
  isVisible,
  language = 'en',
  onDismiss,
  className,
  autoSpeak = true,
}: EmergencyAlertBannerProps) {
  const [isShowing, setIsShowing] = useState(false);
  const [isSpeakingAlert, setIsSpeakingAlert] = useState(false);

  const messages = EMERGENCY_MESSAGES[language];

  // Speak the emergency alert
  const speakAlert = useCallback(() => {
    if (isSpeaking()) {
      stopSpeaking();
      setIsSpeakingAlert(false);
      return;
    }

    speak(messages.voiceAlert, {
      language,
      rate: 0.9, // Slightly slower for clarity
      onStart: () => setIsSpeakingAlert(true),
      onEnd: () => setIsSpeakingAlert(false),
      onError: () => setIsSpeakingAlert(false),
    });
  }, [language, messages.voiceAlert]);

  useEffect(() => {
    if (isVisible && !isShowing) {
      setIsShowing(true);
      
      // Auto-speak the alert when it appears
      if (autoSpeak) {
        // Small delay to let the banner animate in
        const timer = setTimeout(() => {
          speakAlert();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, isShowing, autoSpeak, speakAlert]);

  const handleDismiss = () => {
    stopSpeaking(); // Stop any ongoing speech
    setIsShowing(false);
    onDismiss?.();
  };

  const handleCall = () => {
    window.location.href = 'tel:108';
  };

  if (!isShowing) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white p-4 shadow-lg animate-in slide-in-from-top duration-300',
        className
      )}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 animate-pulse" />
          <div>
            <h3 className="font-bold text-lg">{messages.title}</h3>
            <p className="text-sm text-red-100">{messages.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Voice replay button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={speakAlert}
            className="text-white hover:bg-red-700"
            title={isSpeakingAlert ? 'Stop speaking' : 'Speak alert'}
          >
            {isSpeakingAlert ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            onClick={handleCall}
            className="bg-white text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
          >
            <Phone className="h-4 w-4 mr-2" />
            {messages.callText}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="text-white hover:bg-red-700"
            title={messages.dismissText}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
