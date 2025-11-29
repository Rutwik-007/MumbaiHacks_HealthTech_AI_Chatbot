/**
 * Health Agent Tool Handlers
 * Server-side execution logic for agentic AI tools
 */

import type { SupportedLanguage } from '../types';
import { 
  TEST_FACILITIES, 
  AMBULANCE_SERVICES, 
  TEST_SCHEMES, 
  SEASONAL_ALERTS,
  TEST_USER_PROFILES,
} from '../db/seed-test-data';

// Types for tool results
export interface FacilityResult {
  name: string;
  type: string;
  address: string;
  phone: string;
  distance: string;
  services: string[];
  isOpen?: boolean;
  rating?: number;
}

export interface AppointmentResult {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'failed';
  facility: string;
  dateTime: string;
  type: string;
  confirmationSent: boolean;
}

export interface NotificationResult {
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
  recipient: string;
  channel: 'sms' | 'whatsapp' | 'push';
}

export interface WeatherAlert {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  precautions: string[];
  validUntil?: string;
}

export interface ReminderResult {
  reminderId: string;
  status: 'scheduled' | 'failed';
  nextTrigger: string;
  recurring: boolean;
}

export interface SchemeResult {
  schemeId: string;
  name: string;
  isEligible: boolean;
  eligibilityReason: string;
  benefits: string[];
  applicationStatus?: 'not_applied' | 'pending' | 'approved' | 'rejected';
}

export interface RecommendationResult {
  id: string;
  category: string;
  priority: 'urgent' | 'important' | 'routine';
  title: string;
  description: string;
  action: string;
  dueDate?: string;
}

// Multilingual messages for tool responses
const TOOL_MESSAGES: Record<SupportedLanguage, {
  facilityFound: string;
  appointmentBooked: string;
  notificationSent: string;
  reminderSet: string;
  schemeEligible: string;
  schemeNotEligible: string;
  error: string;
}> = {
  en: {
    facilityFound: 'Found {count} health facilities near you',
    appointmentBooked: 'Your appointment has been booked successfully',
    notificationSent: 'Message sent successfully',
    reminderSet: 'Reminder has been scheduled',
    schemeEligible: 'You are eligible for this scheme',
    schemeNotEligible: 'You may not be eligible for this scheme',
    error: 'An error occurred. Please try again.',
  },
  hi: {
    facilityFound: 'आपके पास {count} स्वास्थ्य सुविधाएं मिलीं',
    appointmentBooked: 'आपकी अपॉइंटमेंट सफलतापूर्वक बुक हो गई है',
    notificationSent: 'संदेश सफलतापूर्वक भेजा गया',
    reminderSet: 'रिमाइंडर सेट हो गया है',
    schemeEligible: 'आप इस योजना के लिए पात्र हैं',
    schemeNotEligible: 'आप इस योजना के लिए पात्र नहीं हो सकते हैं',
    error: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
  },
  mr: {
    facilityFound: 'तुमच्या जवळ {count} आरोग्य सुविधा सापडल्या',
    appointmentBooked: 'तुमची अपॉइंटमेंट यशस्वीरित्या बुक झाली आहे',
    notificationSent: 'संदेश यशस्वीरित्या पाठवला',
    reminderSet: 'स्मरणपत्र सेट केले आहे',
    schemeEligible: 'तुम्ही या योजनेसाठी पात्र आहात',
    schemeNotEligible: 'तुम्ही या योजनेसाठी पात्र नसू शकता',
    error: 'एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
  },
  pa: {
    facilityFound: 'ਤੁਹਾਡੇ ਨੇੜੇ {count} ਸਿਹਤ ਸਹੂਲਤਾਂ ਮਿਲੀਆਂ',
    appointmentBooked: 'ਤੁਹਾਡੀ ਅਪਾਇੰਟਮੈਂਟ ਸਫਲਤਾਪੂਰਵਕ ਬੁੱਕ ਹੋ ਗਈ ਹੈ',
    notificationSent: 'ਸੁਨੇਹਾ ਸਫਲਤਾਪੂਰਵਕ ਭੇਜਿਆ ਗਿਆ',
    reminderSet: 'ਰੀਮਾਈਂਡਰ ਸੈੱਟ ਕੀਤਾ ਗਿਆ ਹੈ',
    schemeEligible: 'ਤੁਸੀਂ ਇਸ ਯੋਜਨਾ ਲਈ ਯੋਗ ਹੋ',
    schemeNotEligible: 'ਤੁਸੀਂ ਇਸ ਯੋਜਨਾ ਲਈ ਯੋਗ ਨਹੀਂ ਹੋ ਸਕਦੇ',
    error: 'ਇੱਕ ਗਲਤੀ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
  },
};

/**
 * Health Facility Database (Mock)
 * In production, this would connect to a real database or API
 */
const FACILITY_DATABASE: Record<string, FacilityResult[]> = {
  default: [
    {
      name: 'District Civil Hospital',
      type: 'hospital',
      address: 'District Headquarters',
      phone: '108',
      distance: '5-10 km',
      services: ['Emergency', 'OPD', 'IPD', 'Surgery', 'Maternity', 'Pediatric'],
      isOpen: true,
      rating: 4.2,
    },
    {
      name: 'Primary Health Center',
      type: 'phc',
      address: 'Block Headquarters',
      phone: '104',
      distance: '2-5 km',
      services: ['OPD', 'Vaccination', 'ANC', 'Basic Lab', 'Pharmacy'],
      isOpen: true,
      rating: 3.8,
    },
    {
      name: 'Community Health Center',
      type: 'chc',
      address: 'Sub-district Level',
      phone: '104',
      distance: '8-15 km',
      services: ['24x7 Emergency', 'Delivery', 'Minor Surgery', 'Blood Bank'],
      isOpen: true,
      rating: 4.0,
    },
    {
      name: 'Sub-Center',
      type: 'subCenter',
      address: 'Village Level',
      phone: 'Contact PHC',
      distance: '1-2 km',
      services: ['ANM Services', 'Basic Care', 'Vaccination', 'ANC Checkup'],
      isOpen: true,
    },
    {
      name: 'Local ASHA Worker',
      type: 'ashaWorker',
      address: 'Village Level - Home Visits',
      phone: 'Contact through PHC',
      distance: '< 1 km',
      services: ['Home Visits', 'Health Education', 'Referral', 'Medicine Distribution', 'Mother Support'],
    },
    {
      name: 'Anganwadi Center',
      type: 'anganwadi',
      address: 'Village/Ward Level',
      phone: 'Contact PHC',
      distance: '0.5-1 km',
      services: ['Child Nutrition', 'Immunization', 'Preschool Education', 'Mother Support'],
    },
    {
      name: 'Jan Aushadhi Kendra',
      type: 'pharmacy',
      address: 'Market Area',
      phone: 'Local',
      distance: '1-3 km',
      services: ['Generic Medicines', '50-90% Cheaper', 'Quality Assured'],
    },
  ],
};

/**
 * Government Schemes Database
 */
const SCHEMES_DATABASE: Record<string, {
  id: string;
  name: string;
  fullName: string;
  category: string[];
  eligibility: {
    pregnant?: boolean;
    hasChildren?: boolean;
    maxIncome?: string;
    ageRange?: [number, number];
  };
  benefits: string[];
  howToApply: string;
  documents: string[];
}> = {
  jsy: {
    id: 'jsy',
    name: 'Janani Suraksha Yojana',
    fullName: 'Janani Suraksha Yojana (JSY)',
    category: ['maternal'],
    eligibility: { pregnant: true },
    benefits: [
      '₹1,400 cash (rural) / ₹1,000 (urban)',
      'Free institutional delivery',
      'ASHA support',
      'Transport assistance',
    ],
    howToApply: 'Register with local ASHA worker or ANM',
    documents: ['Aadhaar Card', 'MCP Card', 'Bank Account'],
  },
  pmmvy: {
    id: 'pmmvy',
    name: 'PM Matru Vandana Yojana',
    fullName: 'Pradhan Mantri Matru Vandana Yojana',
    category: ['maternal'],
    eligibility: { pregnant: true },
    benefits: [
      '₹5,000 in 3 installments',
      'First pregnancy only',
      'Direct bank transfer',
    ],
    howToApply: 'Register at Anganwadi center',
    documents: ['Aadhaar Card', 'Bank Account', 'MCP Card'],
  },
  pmjay: {
    id: 'pmjay',
    name: 'Ayushman Bharat PM-JAY',
    fullName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    category: ['general'],
    eligibility: { maxIncome: 'bpl' },
    benefits: [
      '₹5 lakh health coverage per family',
      'Cashless treatment',
      '1,350+ packages covered',
    ],
    howToApply: 'Visit CSC or check mera.pmjay.gov.in',
    documents: ['Aadhaar Card', 'Ration Card'],
  },
  indradhanush: {
    id: 'indradhanush',
    name: 'Mission Indradhanush',
    fullName: 'Intensified Mission Indradhanush',
    category: ['child'],
    eligibility: { hasChildren: true },
    benefits: [
      'Free vaccines for 12 diseases',
      'Door-to-door service',
      'Complete immunization',
    ],
    howToApply: 'Contact ASHA worker or visit PHC',
    documents: ['Child Birth Certificate', 'Immunization Card'],
  },
  icds: {
    id: 'icds',
    name: 'ICDS Anganwadi Services',
    fullName: 'Integrated Child Development Services',
    category: ['child', 'maternal'],
    eligibility: { hasChildren: true },
    benefits: [
      'Supplementary nutrition',
      'Preschool education',
      'Growth monitoring',
      'Health checkups',
    ],
    howToApply: 'Register at nearest Anganwadi center',
    documents: ['Birth Certificate', 'Aadhaar (if available)'],
  },
};

/**
 * Handler: Find Health Facilities
 */
export async function handleFindHealthFacility(
  location: string,
  facilityType?: string,
  specialty?: string,
  language: SupportedLanguage = 'en'
): Promise<{
  success: boolean;
  message: string;
  facilities: FacilityResult[];
  emergencyNumbers: Record<string, string>;
}> {
  try {
    // Use real test data from seed-test-data.ts
    let facilities: FacilityResult[] = TEST_FACILITIES.map(f => ({
      name: f.name,
      type: f.type,
      address: f.address,
      phone: f.phone || f.emergencyPhone || 'Contact PHC',
      distance: '2-10 km',
      services: f.services || [],
      isOpen: f.isOpen24x7,
      rating: f.rating,
    }));

    // Filter by location if specified
    if (location) {
      const locationLower = location.toLowerCase();
      const locationFiltered = facilities.filter(f => 
        f.address.toLowerCase().includes(locationLower)
      );
      if (locationFiltered.length > 0) {
        facilities = locationFiltered;
      }
    }

    // Filter by facility type if specified
    if (facilityType) {
      facilities = facilities.filter(f => f.type === facilityType);
    }

    // Filter by specialty if specified
    if (specialty) {
      facilities = facilities.filter(f => 
        f.services.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    const messages = TOOL_MESSAGES[language];
    const message = messages.facilityFound.replace('{count}', facilities.length.toString());

    return {
      success: true,
      message,
      facilities,
      emergencyNumbers: {
        ambulance: '108',
        emergency: '112',
        healthHelpline: '104',
        womenHelpline: '181',
        childHelpline: '1098',
      },
    };
  } catch (error) {
    return {
      success: false,
      message: TOOL_MESSAGES[language].error,
      facilities: [],
      emergencyNumbers: { ambulance: '108', emergency: '112' },
    };
  }
}

/**
 * Handler: Book Appointment
 */
export async function handleBookAppointment(
  facilityName: string,
  appointmentType: string,
  preferredDate: string,
  preferredTime: string,
  patientName: string,
  patientPhone: string,
  notes?: string,
  language: SupportedLanguage = 'en'
): Promise<AppointmentResult> {
  try {
    // Generate booking ID
    const bookingId = `APT${Date.now().toString(36).toUpperCase()}`;

    // In production, this would:
    // 1. Check facility availability
    // 2. Create booking in hospital system
    // 3. Send confirmation SMS

    return {
      bookingId,
      status: 'pending',
      facility: facilityName,
      dateTime: `${preferredDate} ${preferredTime}`,
      type: appointmentType,
      confirmationSent: true,
    };
  } catch (error) {
    return {
      bookingId: '',
      status: 'failed',
      facility: facilityName,
      dateTime: preferredDate,
      type: appointmentType,
      confirmationSent: false,
    };
  }
}

/**
 * Handler: Send Notification
 */
export async function handleSendNotification(
  recipientPhone: string,
  recipientName: string,
  messageType: string,
  message: string,
  language: SupportedLanguage = 'en'
): Promise<NotificationResult> {
  try {
    // Generate message ID
    const messageId = `MSG${Date.now().toString(36).toUpperCase()}`;

    // In production, this would integrate with:
    // - MSG91, Twilio, or government SMS gateway
    // - WhatsApp Business API
    // - Push notification service

    return {
      messageId,
      status: 'queued',
      recipient: recipientPhone.replace(/(\d{2})(\d+)(\d{2})/, '$1****$3'),
      channel: 'sms',
    };
  } catch (error) {
    return {
      messageId: '',
      status: 'failed',
      recipient: recipientPhone,
      channel: 'sms',
    };
  }
}

/**
 * Handler: Get Weather Health Alerts
 */
export async function handleGetWeatherAlerts(
  location: string,
  language: SupportedLanguage = 'en'
): Promise<{
  success: boolean;
  season: string;
  alerts: WeatherAlert[];
}> {
  const month = new Date().getMonth();
  let season: string;
  const alerts: WeatherAlert[] = [];

  // Determine season (India-centric)
  if (month >= 2 && month <= 5) {
    season = 'summer';
    alerts.push({
      type: 'heatwave',
      severity: 'high',
      title: 'Heat Advisory',
      description: 'High temperatures expected',
      precautions: [
        'Stay indoors 11 AM - 4 PM',
        'Drink plenty of water',
        'Wear light clothes',
        'Use ORS if dehydrated',
      ],
    });
  } else if (month >= 6 && month <= 9) {
    season = 'monsoon';
    alerts.push({
      type: 'mosquito-borne',
      severity: 'high',
      title: 'Dengue/Malaria Alert',
      description: 'Peak mosquito-borne disease season',
      precautions: [
        'Use mosquito nets',
        'Apply repellent',
        'Remove stagnant water',
        'Seek care for fever with body ache',
      ],
    });
    alerts.push({
      type: 'waterborne',
      severity: 'medium',
      title: 'Water Safety Alert',
      description: 'Risk of waterborne diseases',
      precautions: [
        'Drink boiled/filtered water',
        'Avoid street food',
        'Wash hands frequently',
      ],
    });
  } else {
    season = 'winter';
    alerts.push({
      type: 'respiratory',
      severity: 'medium',
      title: 'Cold & Flu Season',
      description: 'Increased respiratory infections',
      precautions: [
        'Keep warm',
        'Wash hands frequently',
        'Cover coughs and sneezes',
        'Get flu vaccine if available',
      ],
    });
  }

  return {
    success: true,
    season,
    alerts,
  };
}

/**
 * Handler: Schedule Reminder
 */
export async function handleScheduleReminder(
  reminderType: string,
  title: string,
  description: string,
  scheduledDate: string,
  scheduledTime: string,
  recurring: string = 'none',
  language: SupportedLanguage = 'en'
): Promise<ReminderResult> {
  try {
    const reminderId = `REM${Date.now().toString(36).toUpperCase()}`;

    // In production, this would:
    // 1. Store reminder in database
    // 2. Schedule notification job
    // 3. Handle recurring logic

    return {
      reminderId,
      status: 'scheduled',
      nextTrigger: `${scheduledDate} ${scheduledTime}`,
      recurring: recurring !== 'none',
    };
  } catch (error) {
    return {
      reminderId: '',
      status: 'failed',
      nextTrigger: '',
      recurring: false,
    };
  }
}

/**
 * Handler: Check Scheme Eligibility
 */
export async function handleCheckSchemeEligibility(
  category: string,
  isPregnant: boolean = false,
  hasChildren: boolean = false,
  incomeLevel: string = 'unknown',
  language: SupportedLanguage = 'en'
): Promise<{
  success: boolean;
  eligibleSchemes: SchemeResult[];
}> {
  const eligibleSchemes: SchemeResult[] = [];

  for (const [key, scheme] of Object.entries(SCHEMES_DATABASE)) {
    // Check category match
    if (category !== 'all' && !scheme.category.includes(category)) {
      continue;
    }

    // Check eligibility
    let isEligible = true;
    let reason = 'You meet the eligibility criteria';

    if (scheme.eligibility.pregnant && !isPregnant) {
      isEligible = false;
      reason = 'This scheme is for pregnant women';
    }

    if (scheme.eligibility.hasChildren && !hasChildren) {
      isEligible = false;
      reason = 'This scheme is for families with children';
    }

    if (scheme.eligibility.maxIncome === 'bpl' && incomeLevel === 'apl') {
      isEligible = false;
      reason = 'This scheme is for BPL families';
    }

    eligibleSchemes.push({
      schemeId: scheme.id,
      name: scheme.fullName,
      isEligible,
      eligibilityReason: reason,
      benefits: scheme.benefits,
    });
  }

  return {
    success: true,
    eligibleSchemes: eligibleSchemes.sort((a, b) => 
      (b.isEligible ? 1 : 0) - (a.isEligible ? 1 : 0)
    ),
  };
}

/**
 * Handler: Get Personalized Recommendations
 */
export async function handleGetPersonalizedRecommendations(
  isPregnant: boolean = false,
  pregnancyWeek?: number,
  hasChildren: boolean = false,
  childrenAges: number[] = [],
  language: SupportedLanguage = 'en'
): Promise<{
  success: boolean;
  recommendations: RecommendationResult[];
}> {
  const recommendations: RecommendationResult[] = [];
  const today = new Date();

  // Pregnancy recommendations
  if (isPregnant && pregnancyWeek) {
    if (pregnancyWeek <= 12) {
      recommendations.push({
        id: `rec_${Date.now()}_1`,
        category: 'Pregnancy',
        priority: 'urgent',
        title: 'First Trimester Care',
        description: 'Take folic acid daily. Avoid heavy lifting. Get first ANC checkup.',
        action: 'Schedule ANC visit at PHC',
      });
    } else if (pregnancyWeek >= 28) {
      recommendations.push({
        id: `rec_${Date.now()}_2`,
        category: 'Pregnancy',
        priority: 'urgent',
        title: 'Prepare for Delivery',
        description: 'Pack hospital bag. Know danger signs. Have transport ready.',
        action: 'Keep 108 number saved and identify delivery hospital',
      });
    }
  }

  // Child health recommendations
  if (hasChildren && childrenAges.length > 0) {
    for (const age of childrenAges) {
      if (age < 1) {
        recommendations.push({
          id: `rec_${Date.now()}_child_${age}`,
          category: 'Child Health',
          priority: 'urgent',
          title: 'Infant Vaccination',
          description: 'Multiple vaccines due in first year',
          action: 'Visit PHC for vaccination schedule',
        });
      } else if (age < 6) {
        recommendations.push({
          id: `rec_${Date.now()}_child_${age}`,
          category: 'Child Health',
          priority: 'important',
          title: 'Anganwadi Services',
          description: 'Free nutrition, preschool, and health checkups',
          action: 'Register at nearest Anganwadi center',
        });
      }
    }
  }

  // Seasonal recommendation
  const month = today.getMonth();
  if (month >= 6 && month <= 9) {
    recommendations.push({
      id: `rec_${Date.now()}_seasonal`,
      category: 'Seasonal Health',
      priority: 'important',
      title: 'Monsoon Precautions',
      description: 'High risk of dengue and waterborne diseases',
      action: 'Use mosquito nets and drink safe water',
    });
  }

  return {
    success: true,
    recommendations: recommendations.sort((a, b) => {
      const priority = { urgent: 0, important: 1, routine: 2 };
      return priority[a.priority] - priority[b.priority];
    }),
  };
}
