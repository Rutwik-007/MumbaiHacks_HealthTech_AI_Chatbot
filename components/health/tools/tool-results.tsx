'use client';

/**
 * Tool Result UI Components
 * Display results from agentic AI tool calls
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SupportedLanguage } from '@/lib/health-platform/types';

// Translations
const TRANSLATIONS: Record<SupportedLanguage, {
  callNow: string;
  getDirections: string;
  bookAppointment: string;
  viewDetails: string;
  open24x7: string;
  services: string;
  distance: string;
  emergencyNumbers: string;
  facilities: string;
}> = {
  en: {
    callNow: 'Call Now',
    getDirections: 'Get Directions',
    bookAppointment: 'Book Appointment',
    viewDetails: 'View Details',
    open24x7: 'Open 24x7',
    services: 'Services',
    distance: 'Distance',
    emergencyNumbers: 'Emergency Numbers',
    facilities: 'Health Facilities',
  },
  hi: {
    callNow: 'अभी कॉल करें',
    getDirections: 'दिशा प्राप्त करें',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    viewDetails: 'विवरण देखें',
    open24x7: '24x7 खुला',
    services: 'सेवाएं',
    distance: 'दूरी',
    emergencyNumbers: 'आपातकालीन नंबर',
    facilities: 'स्वास्थ्य सुविधाएं',
  },
  mr: {
    callNow: 'आता कॉल करा',
    getDirections: 'दिशा मिळवा',
    bookAppointment: 'अपॉइंटमेंट बुक करा',
    viewDetails: 'तपशील पहा',
    open24x7: '24x7 उघडे',
    services: 'सेवा',
    distance: 'अंतर',
    emergencyNumbers: 'आपत्कालीन क्रमांक',
    facilities: 'आरोग्य सुविधा',
  },
  pa: {
    callNow: 'ਹੁਣੇ ਕਾਲ ਕਰੋ',
    getDirections: 'ਦਿਸ਼ਾ ਪ੍ਰਾਪਤ ਕਰੋ',
    bookAppointment: 'ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ',
    viewDetails: 'ਵੇਰਵੇ ਵੇਖੋ',
    open24x7: '24x7 ਖੁੱਲ੍ਹਾ',
    services: 'ਸੇਵਾਵਾਂ',
    distance: 'ਦੂਰੀ',
    emergencyNumbers: 'ਐਮਰਜੈਂਸੀ ਨੰਬਰ',
    facilities: 'ਸਿਹਤ ਸਹੂਲਤਾਂ',
  },
};

// Facility type icons and colors
const FACILITY_STYLES: Record<string, { icon: string; color: string }> = {
  hospital: { icon: '🏥', color: 'bg-red-100 text-red-800' },
  phc: { icon: '🏪', color: 'bg-blue-100 text-blue-800' },
  chc: { icon: '🏨', color: 'bg-green-100 text-green-800' },
  subCenter: { icon: '🏠', color: 'bg-yellow-100 text-yellow-800' },
  ashaWorker: { icon: '👩‍⚕️', color: 'bg-purple-100 text-purple-800' },
  anganwadi: { icon: '👶', color: 'bg-pink-100 text-pink-800' },
  pharmacy: { icon: '💊', color: 'bg-orange-100 text-orange-800' },
  ambulance: { icon: '🚑', color: 'bg-red-100 text-red-800' },
};

interface Facility {
  name: string;
  type: string;
  address: string;
  phone: string;
  distance: string;
  services: string[];
  isOpen?: boolean;
  rating?: number;
}

interface FacilityCardProps {
  facility: Facility;
  language?: SupportedLanguage;
  onBook?: (facility: Facility) => void;
}

/**
 * Single Facility Card
 */
export function FacilityCard({ facility, language = 'en', onBook }: FacilityCardProps) {
  const t = TRANSLATIONS[language];
  const style = FACILITY_STYLES[facility.type] || FACILITY_STYLES.hospital;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{style.icon}</span>
            <div>
              <CardTitle className="text-base">{facility.name}</CardTitle>
              <CardDescription className="text-sm">{facility.address}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={style.color}>
            {facility.type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>📍 {t.distance}: {facility.distance}</span>
          {facility.isOpen && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {t.open24x7}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {facility.services.slice(0, 4).map((service, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {service}
            </Badge>
          ))}
          {facility.services.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{facility.services.length - 4}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="default"
            onClick={() => window.open(`tel:${facility.phone}`)}
            className="flex-1"
          >
            📞 {t.callNow}
          </Button>
          {onBook && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onBook(facility)}
              className="flex-1"
            >
              📅 {t.bookAppointment}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface FacilityListProps {
  facilities: Facility[];
  emergencyNumbers?: Record<string, string>;
  language?: SupportedLanguage;
  onBook?: (facility: Facility) => void;
}

/**
 * List of Facility Cards with Emergency Numbers
 */
export function FacilityList({ 
  facilities, 
  emergencyNumbers, 
  language = 'en',
  onBook 
}: FacilityListProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-4">
      {/* Emergency Numbers Banner */}
      {emergencyNumbers && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-semibold text-red-800">🚨 {t.emergencyNumbers}:</span>
              <div className="flex gap-3">
                {Object.entries(emergencyNumbers).map(([key, value]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant="destructive"
                    onClick={() => window.open(`tel:${value}`)}
                  >
                    {key}: {value}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facilities Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {facilities.map((facility, idx) => (
          <FacilityCard 
            key={idx} 
            facility={facility} 
            language={language}
            onBook={onBook}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// APPOINTMENT RESULT COMPONENT
// ============================================

interface AppointmentResultProps {
  bookingReference: string;
  status: 'pending' | 'confirmed' | 'failed';
  details: {
    facility: string;
    appointmentType: string;
    date: string;
    timeSlot: string;
    patient: string;
  };
  nextSteps: string[];
  language?: SupportedLanguage;
}

const APPOINTMENT_TRANSLATIONS: Record<SupportedLanguage, {
  bookingConfirmation: string;
  bookingReference: string;
  status: string;
  pending: string;
  confirmed: string;
  failed: string;
  facility: string;
  type: string;
  date: string;
  time: string;
  patient: string;
  nextSteps: string;
}> = {
  en: {
    bookingConfirmation: 'Appointment Booking',
    bookingReference: 'Booking Reference',
    status: 'Status',
    pending: 'Pending Confirmation',
    confirmed: 'Confirmed',
    failed: 'Failed',
    facility: 'Facility',
    type: 'Type',
    date: 'Date',
    time: 'Time',
    patient: 'Patient',
    nextSteps: 'Next Steps',
  },
  hi: {
    bookingConfirmation: 'अपॉइंटमेंट बुकिंग',
    bookingReference: 'बुकिंग संदर्भ',
    status: 'स्थिति',
    pending: 'पुष्टि लंबित',
    confirmed: 'पुष्टि हो गई',
    failed: 'विफल',
    facility: 'सुविधा',
    type: 'प्रकार',
    date: 'तारीख',
    time: 'समय',
    patient: 'मरीज',
    nextSteps: 'अगले कदम',
  },
  mr: {
    bookingConfirmation: 'अपॉइंटमेंट बुकिंग',
    bookingReference: 'बुकिंग संदर्भ',
    status: 'स्थिती',
    pending: 'पुष्टी प्रलंबित',
    confirmed: 'पुष्टी झाली',
    failed: 'अयशस्वी',
    facility: 'सुविधा',
    type: 'प्रकार',
    date: 'तारीख',
    time: 'वेळ',
    patient: 'रुग्ण',
    nextSteps: 'पुढील पावले',
  },
  pa: {
    bookingConfirmation: 'ਅਪਾਇੰਟਮੈਂਟ ਬੁਕਿੰਗ',
    bookingReference: 'ਬੁਕਿੰਗ ਹਵਾਲਾ',
    status: 'ਸਥਿਤੀ',
    pending: 'ਪੁਸ਼ਟੀ ਬਾਕੀ',
    confirmed: 'ਪੁਸ਼ਟੀ ਹੋਈ',
    failed: 'ਅਸਫਲ',
    facility: 'ਸਹੂਲਤ',
    type: 'ਕਿਸਮ',
    date: 'ਤਾਰੀਖ',
    time: 'ਸਮਾਂ',
    patient: 'ਮਰੀਜ਼',
    nextSteps: 'ਅਗਲੇ ਕਦਮ',
  },
};

export function AppointmentResult({ 
  bookingReference, 
  status, 
  details, 
  nextSteps,
  language = 'en' 
}: AppointmentResultProps) {
  const t = APPOINTMENT_TRANSLATIONS[language];
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: t.pending,
    confirmed: t.confirmed,
    failed: t.failed,
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            📅 {t.bookingConfirmation}
          </CardTitle>
          <Badge className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>
        <CardDescription>
          {t.bookingReference}: <span className="font-mono font-bold">{bookingReference}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">{t.facility}:</span>
            <p className="font-medium">{details.facility}</p>
          </div>
          <div>
            <span className="text-muted-foreground">{t.type}:</span>
            <p className="font-medium">{details.appointmentType}</p>
          </div>
          <div>
            <span className="text-muted-foreground">{t.date}:</span>
            <p className="font-medium">{details.date}</p>
          </div>
          <div>
            <span className="text-muted-foreground">{t.time}:</span>
            <p className="font-medium">{details.timeSlot}</p>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">{t.patient}:</span>
            <p className="font-medium">{details.patient}</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-sm font-medium mb-2">{t.nextSteps}:</p>
          <ul className="text-sm space-y-1">
            {nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// WEATHER ALERT COMPONENT
// ============================================

interface WeatherAlert {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  precautions: string[];
}

interface WeatherAlertCardProps {
  season: string;
  alerts: WeatherAlert[];
  generalAdvice?: string[];
  language?: SupportedLanguage;
}

const SEVERITY_STYLES = {
  low: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'ℹ️' },
  medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '⚠️' },
  high: { bg: 'bg-orange-50', border: 'border-orange-200', icon: '🔶' },
  critical: { bg: 'bg-red-50', border: 'border-red-200', icon: '🚨' },
};

export function WeatherAlertCard({ 
  season, 
  alerts, 
  generalAdvice,
  language = 'en' 
}: WeatherAlertCardProps) {
  const seasonIcons: Record<string, string> = {
    summer: '☀️',
    monsoon: '🌧️',
    winter: '❄️',
    'post-monsoon': '🍂',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {seasonIcons[season] || '🌡️'} Weather Health Alerts
        </CardTitle>
        <CardDescription>
          Current Season: {season.charAt(0).toUpperCase() + season.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, idx) => {
          const style = SEVERITY_STYLES[alert.severity];
          return (
            <div 
              key={idx} 
              className={`${style.bg} ${style.border} border rounded-lg p-3`}
            >
              <div className="flex items-center gap-2 font-medium mb-2">
                <span>{style.icon}</span>
                <span>{alert.message}</span>
              </div>
              <ul className="text-sm space-y-1 ml-6">
                {alert.precautions.map((precaution, pIdx) => (
                  <li key={pIdx}>• {precaution}</li>
                ))}
              </ul>
            </div>
          );
        })}

        {generalAdvice && generalAdvice.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2">💡 General Advice:</p>
            <ul className="text-sm space-y-1">
              {generalAdvice.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span>•</span>
                  {advice}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// SCHEME ELIGIBILITY COMPONENT
// ============================================

interface SchemeResult {
  name: string;
  isEligible: boolean;
  eligibilityReason: string;
  benefits: string[];
  howToApply?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface SchemeEligibilityCardProps {
  schemes: SchemeResult[];
  nextSteps?: string[];
  helplineNumbers?: Record<string, string>;
  language?: SupportedLanguage;
  onApply?: (scheme: SchemeResult) => void;
}

export function SchemeEligibilityCard({ 
  schemes, 
  nextSteps,
  helplineNumbers,
  language = 'en',
  onApply 
}: SchemeEligibilityCardProps) {
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

  const eligibleSchemes = schemes.filter(s => s.isEligible);
  const otherSchemes = schemes.filter(s => !s.isEligible);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏛️ Government Scheme Eligibility
        </CardTitle>
        <CardDescription>
          Found {eligibleSchemes.length} eligible schemes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Eligible Schemes */}
        {eligibleSchemes.map((scheme, idx) => (
          <div 
            key={idx}
            className="border border-green-200 bg-green-50 rounded-lg p-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">Eligible ✓</Badge>
                  {scheme.priority === 'high' && (
                    <Badge variant="outline" className="border-orange-500 text-orange-600">
                      High Priority
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium mt-1">{scheme.name}</h4>
                <p className="text-sm text-muted-foreground">{scheme.eligibilityReason}</p>
              </div>
            </div>
            
            <div className="mt-2">
              <button
                onClick={() => setExpandedScheme(expandedScheme === scheme.name ? null : scheme.name)}
                className="text-sm text-primary hover:underline"
              >
                {expandedScheme === scheme.name ? 'Hide Details' : 'View Benefits'}
              </button>
              
              {expandedScheme === scheme.name && (
                <div className="mt-2 space-y-2">
                  <ul className="text-sm space-y-1">
                    {scheme.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  {scheme.howToApply && (
                    <p className="text-sm text-muted-foreground">
                      <strong>How to Apply:</strong> {scheme.howToApply}
                    </p>
                  )}
                  {onApply && (
                    <Button 
                      size="sm" 
                      onClick={() => onApply(scheme)}
                      className="mt-2"
                    >
                      Apply Now
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Other Schemes (collapsed) */}
        {otherSchemes.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-sm text-muted-foreground mb-2">
              Other schemes (may not be eligible):
            </p>
            {otherSchemes.map((scheme, idx) => (
              <div key={idx} className="text-sm py-1">
                <span className="text-muted-foreground">• {scheme.name}</span>
                <span className="text-xs ml-2">({scheme.eligibilityReason})</span>
              </div>
            ))}
          </div>
        )}

        {/* Next Steps */}
        {nextSteps && nextSteps.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2">📋 Next Steps:</p>
            <ul className="text-sm space-y-1">
              {nextSteps.map((step, idx) => (
                <li key={idx}>• {step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Helpline Numbers */}
        {helplineNumbers && (
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(helplineNumbers).map(([name, number]) => (
              <Button
                key={name}
                size="sm"
                variant="outline"
                onClick={() => window.open(`tel:${number}`)}
              >
                📞 {name}: {number}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// REMINDER CONFIRMATION COMPONENT
// ============================================

interface ReminderConfirmationProps {
  reminderId: string;
  title: string;
  description: string;
  scheduledFor: string;
  recurring: string;
  language?: SupportedLanguage;
}

export function ReminderConfirmation({
  reminderId,
  title,
  description,
  scheduledFor,
  recurring,
  language = 'en',
}: ReminderConfirmationProps) {
  return (
    <Card className="border-primary/20">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⏰</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600">Reminder Set ✓</Badge>
              <span className="text-xs text-muted-foreground font-mono">
                #{reminderId}
              </span>
            </div>
            <h4 className="font-medium mt-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span>📅 {scheduledFor}</span>
              <span>🔄 {recurring}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// NOTIFICATION SENT COMPONENT
// ============================================

interface NotificationSentProps {
  messageId: string;
  recipient: string;
  messageType: string;
  status: 'sent' | 'queued' | 'failed';
  language?: SupportedLanguage;
}

export function NotificationSent({
  messageId,
  recipient,
  messageType,
  status,
  language = 'en',
}: NotificationSentProps) {
  const statusStyles = {
    sent: { bg: 'bg-green-100', text: 'text-green-800', label: 'Sent ✓' },
    queued: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Queued' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed ✗' },
  };

  const style = statusStyles[status];

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">💬</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge className={`${style.bg} ${style.text}`}>{style.label}</Badge>
              <span className="text-xs text-muted-foreground capitalize">
                {messageType}
              </span>
            </div>
            <p className="text-sm mt-1">
              To: <span className="font-mono">{recipient}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Message ID: {messageId}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
