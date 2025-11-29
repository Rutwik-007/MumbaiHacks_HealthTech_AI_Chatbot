/**
 * Health Agent Tools - Agentic AI capabilities
 * All tools use FREE services only
 */

import { tool } from "ai";
import { z } from "zod";
import { searchDocuments } from "../rag/vector-store";
import type { HealthCategory, SupportedLanguage } from "../types";
import { EMERGENCY_KEYWORDS, HEALTH_PHRASES, VACCINE_SCHEDULE } from "../types";

/**
 * Search health knowledge base
 */
export const searchHealthKnowledge = tool({
  description: "Search the health knowledge base for relevant information about diseases, symptoms, treatments, and government schemes",
  inputSchema: z.object({
    query: z.string().describe("The health topic or question to search for"),
    category: z.enum([
      "pregnancy",
      "vaccines", 
      "dengue",
      "malaria",
      "nutrition",
      "emergency",
      "child_health",
      "maternal_health",
      "general",
    ]).optional().describe("Optional category to filter results"),
    language: z.enum(["en", "hi", "mr", "pa"]).optional().describe("Preferred language for results"),
  }),
  execute: async ({ query, category, language }) => {
    try {
      const results = await searchDocuments(query, {
        topK: 5,
        category: category as HealthCategory | undefined,
        language: language as SupportedLanguage | undefined,
      });

      if (results.length === 0) {
        return {
          success: true,
          found: false,
          message: "No relevant information found in the knowledge base.",
          results: [],
        };
      }

      return {
        success: true,
        found: true,
        results: results.map((r) => ({
          content: r.content,
          source: r.metadata.source || "Health Knowledge Base",
          category: r.metadata.category,
          relevance: Math.round(r.score * 100),
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to search knowledge base",
      };
    }
  },
});

/**
 * Detect emergency from user message
 */
export const detectEmergency = tool({
  description: "Check if the user's message contains emergency keywords indicating a medical emergency",
  inputSchema: z.object({
    message: z.string().describe("The user's message to check for emergency keywords"),
  }),
  execute: async ({ message }) => {
    const lowerMessage = message.toLowerCase();
    
    // Check all emergency keywords across all languages
    const detectedKeywords: string[] = [];
    let detectedLanguage: SupportedLanguage = "en";

    for (const [lang, keywords] of Object.entries(EMERGENCY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          detectedKeywords.push(keyword);
          detectedLanguage = lang as SupportedLanguage;
        }
      }
    }

    const isEmergency = detectedKeywords.length > 0;
    const phrases = HEALTH_PHRASES[detectedLanguage];

    return {
      isEmergency,
      detectedKeywords,
      language: detectedLanguage,
      response: isEmergency
        ? {
            alert: phrases.emergency,
            action: phrases.callAmbulance,
            numbers: {
              ambulance: "108",
              emergency: "112",
              women: "181",
              child: "1098",
            },
          }
        : null,
    };
  },
});

/**
 * Get vaccine schedule
 */
export const getVaccineSchedule = tool({
  description: "Get the vaccination schedule for a specific age group",
  inputSchema: z.object({
    ageGroup: z.enum(["birth", "6_weeks", "10_weeks", "14_weeks", "9_months", "16_months", "5_years", "10_years"])
      .describe("The age group to get vaccine schedule for"),
    language: z.enum(["en", "hi", "mr", "pa"]).optional().describe("Preferred language for response"),
  }),
  execute: async ({ ageGroup, language = "en" }) => {
    // Map age group to index in VACCINE_SCHEDULE array
    const ageGroupMap: Record<string, number> = {
      birth: 0,
      "6_weeks": 1,
      "10_weeks": 2,
      "14_weeks": 3,
      "9_months": 4,
      "16_months": 5,
      "5_years": 6,
      "10_years": 7,
    };

    const index = ageGroupMap[ageGroup];
    const schedule = VACCINE_SCHEDULE[index];
    
    if (!schedule) {
      return {
        success: false,
        error: "Invalid age group",
      };
    }

    const phrases = HEALTH_PHRASES[language as SupportedLanguage];

    return {
      success: true,
      ageGroup,
      age: schedule.age,
      vaccines: schedule.vaccines,
      localizedTitle: phrases.vaccineReminder || "Vaccine Reminder",
    };
  },
});

/**
 * Assess health risk level
 */
export const assessRiskLevel = tool({
  description: "Assess the risk level based on symptoms and conditions reported by the user",
  inputSchema: z.object({
    symptoms: z.array(z.string()).describe("List of symptoms reported"),
    age: z.number().optional().describe("Age of the patient"),
    isPregnant: z.boolean().optional().describe("Whether the patient is pregnant"),
    hasChronicCondition: z.boolean().optional().describe("Whether the patient has chronic conditions"),
  }),
  execute: async ({ symptoms, age, isPregnant, hasChronicCondition }) => {
    // Risk scoring
    let riskScore = 0;
    const riskFactors: string[] = [];

    // High-risk symptoms
    const criticalSymptoms = [
      "chest pain", "difficulty breathing", "unconscious", "severe bleeding",
      "seizure", "stroke symptoms", "severe allergic reaction",
    ];
    const moderateSymptoms = [
      "high fever", "persistent vomiting", "severe headache", "confusion",
      "dehydration", "blood in stool", "blood in urine",
    ];

    for (const symptom of symptoms) {
      const lowerSymptom = symptom.toLowerCase();
      if (criticalSymptoms.some((cs) => lowerSymptom.includes(cs))) {
        riskScore += 40;
        riskFactors.push(`Critical symptom: ${symptom}`);
      } else if (moderateSymptoms.some((ms) => lowerSymptom.includes(ms))) {
        riskScore += 20;
        riskFactors.push(`Moderate symptom: ${symptom}`);
      } else {
        riskScore += 5;
      }
    }

    // Age-based risk
    if (age !== undefined) {
      if (age < 5 || age > 65) {
        riskScore += 15;
        riskFactors.push(`Age group risk: ${age} years`);
      }
    }

    // Pregnancy risk
    if (isPregnant) {
      riskScore += 20;
      riskFactors.push("Pregnancy increases risk");
    }

    // Chronic condition risk
    if (hasChronicCondition) {
      riskScore += 15;
      riskFactors.push("Pre-existing chronic condition");
    }

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" | "critical";
    let recommendation: string;

    if (riskScore >= 60) {
      riskLevel = "critical";
      recommendation = "SEEK IMMEDIATE MEDICAL ATTENTION. Call 108 for ambulance.";
    } else if (riskScore >= 40) {
      riskLevel = "high";
      recommendation = "Visit the nearest hospital or health center immediately.";
    } else if (riskScore >= 20) {
      riskLevel = "medium";
      recommendation = "Consult a doctor within 24 hours. Monitor symptoms closely.";
    } else {
      riskLevel = "low";
      recommendation = "Monitor symptoms at home. Seek care if symptoms worsen.";
    }

    return {
      riskLevel,
      riskScore,
      riskFactors,
      recommendation,
      emergencyNumbers: riskLevel === "critical" ? { ambulance: "108", emergency: "112" } : undefined,
    };
  },
});

/**
 * Get government health scheme information
 */
export const getHealthSchemeInfo = tool({
  description: "Get information about government health schemes like Ayushman Bharat, Janani Suraksha Yojana, etc.",
  inputSchema: z.object({
    schemeName: z.enum([
      "ayushman_bharat",
      "janani_suraksha",
      "rashtriya_bal_swasthya",
      "mission_indradhanush",
      "national_health_mission",
    ]).describe("The health scheme to get information about"),
    language: z.enum(["en", "hi", "mr", "pa"]).optional(),
  }),
  execute: async ({ schemeName }) => {
    const schemes: Record<string, {
      name: string;
      fullName: string;
      description: string;
      eligibility: string[];
      benefits: string[];
      howToApply: string;
    }> = {
      ayushman_bharat: {
        name: "Ayushman Bharat PM-JAY",
        fullName: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
        description: "World's largest health insurance scheme providing ₹5 lakh coverage per family per year",
        eligibility: [
          "Families in SECC 2011 database",
          "No premium or enrollment fee",
          "Covers pre-existing conditions",
        ],
        benefits: [
          "₹5 lakh coverage per family per year",
          "Cashless treatment at empaneled hospitals",
          "1,350+ medical packages covered",
          "No age or family size limit",
        ],
        howToApply: "Visit nearest CSC, PHC, or Ayushman Bharat Beneficiary Identification Portal with Aadhaar/Ration Card",
      },
      janani_suraksha: {
        name: "Janani Suraksha Yojana (JSY)",
        fullName: "Janani Suraksha Yojana",
        description: "Cash assistance for institutional deliveries to reduce maternal and infant mortality",
        eligibility: [
          "All pregnant women in LPS states",
          "BPL pregnant women in HPS states",
          "Deliveries at government or accredited hospitals",
        ],
        benefits: [
          "Rural: ₹1,400 cash assistance",
          "Urban: ₹1,000 cash assistance",
          "ASHA incentive: ₹600",
          "Free transport assistance",
        ],
        howToApply: "Register at ANM/ASHA worker during pregnancy, deliver at empaneled hospital",
      },
      rashtriya_bal_swasthya: {
        name: "Rashtriya Bal Swasthya Karyakram",
        fullName: "Rashtriya Bal Swasthya Karyakram (RBSK)",
        description: "Child health screening and early intervention services for children 0-18 years",
        eligibility: [
          "All children from birth to 18 years",
          "Focus on 4 D's: Defects, Deficiencies, Diseases, Development delays",
        ],
        benefits: [
          "Free health screening at schools/Anganwadis",
          "Free treatment for identified conditions",
          "Referral to District Early Intervention Centers",
        ],
        howToApply: "Automatic screening at schools/Anganwadis by Mobile Health Teams",
      },
      mission_indradhanush: {
        name: "Mission Indradhanush",
        fullName: "Intensified Mission Indradhanush",
        description: "Special immunization drive to vaccinate all unvaccinated and partially vaccinated children",
        eligibility: [
          "Children under 2 years",
          "Pregnant women",
          "Focus on hard-to-reach areas",
        ],
        benefits: [
          "Free vaccines for 12 diseases",
          "Door-to-door vaccination",
          "Mobile vaccination teams",
        ],
        howToApply: "Contact nearest ANM/ASHA worker or visit PHC during immunization sessions",
      },
      national_health_mission: {
        name: "National Health Mission",
        fullName: "National Health Mission (NHM)",
        description: "Umbrella program for strengthening healthcare delivery across India",
        eligibility: [
          "All citizens of India",
          "Focus on underserved areas",
        ],
        benefits: [
          "Free OPD/IPD services at government hospitals",
          "Free medicines and diagnostics",
          "ASHA worker support in every village",
          "108 ambulance service",
        ],
        howToApply: "Visit nearest Sub-center, PHC, CHC, or District Hospital",
      },
    };

    const scheme = schemes[schemeName];
    if (!scheme) {
      return { success: false, error: "Scheme not found" };
    }

    return {
      success: true,
      ...scheme,
    };
  },
});

/**
 * Get nearby health facilities (placeholder - would integrate with real data)
 */
export const getNearbyFacilities = tool({
  description: "Get nearby health facilities based on location or district",
  inputSchema: z.object({
    district: z.string().describe("District name to search for facilities"),
    facilityType: z.enum(["phc", "chc", "hospital", "pharmacy", "lab"]).optional(),
  }),
  execute: async () => {
    // This would integrate with real data from HMIS or other sources
    // For now, return helpful guidance
    return {
      success: true,
      note: "For accurate facility information, please check:",
      resources: [
        {
          name: "National Health Portal",
          url: "https://nhp.gov.in/",
          description: "Official health facility database",
        },
        {
          name: "Hospital Finder",
          url: "https://pmjay.gov.in/hospital",
          description: "Find Ayushman Bharat empaneled hospitals",
        },
        {
          name: "108 Ambulance",
          number: "108",
          description: "Free emergency ambulance service",
        },
      ],
      emergencyNumbers: {
        ambulance: "108",
        emergency: "112",
        healthHelpline: "104",
      },
    };
  },
});

// Export all tools as a collection
export const healthTools = {
  searchHealthKnowledge,
  detectEmergency,
  getVaccineSchedule,
  assessRiskLevel,
  getHealthSchemeInfo,
  getNearbyFacilities,
};

// ============================================
// PHASE 6: ENHANCED AGENTIC AI TOOLS
// ============================================

// Import test data for facilities and schemes
import { 
  TEST_FACILITIES, 
  AMBULANCE_SERVICES, 
  TEST_SCHEMES, 
  SEASONAL_ALERTS 
} from '../db/seed-test-data';

/**
 * Find health facilities with detailed info (enhanced version)
 */
export const findHealthFacility = tool({
  description: `Find nearby health facilities (hospitals, PHCs, clinics, ASHA workers) based on location and facility type. 
    Use this when user asks about nearby hospitals, health centers, where to get treatment, or needs emergency medical facility.`,
  inputSchema: z.object({
    location: z.string().describe('User location - village, district, or region name'),
    facilityType: z.enum(['hospital', 'phc', 'chc', 'subCenter', 'ashaWorker', 'anganwadi', 'pharmacy', 'ambulance'])
      .describe('Type of health facility to find'),
    specialty: z.string().optional().describe('Medical specialty needed (e.g., maternity, pediatric, emergency)'),
    urgency: z.enum(['emergency', 'urgent', 'routine']).default('routine').describe('How urgent is the need'),
  }),
  execute: async ({ location, facilityType, specialty, urgency }) => {
    // Use real test data from seed-test-data.ts
    let facilities = TEST_FACILITIES.filter(f => f.type === facilityType);
    
    // Filter by location if specified
    const locationLower = location.toLowerCase();
    if (location) {
      const locationFiltered = facilities.filter(f => 
        f.district?.toLowerCase().includes(locationLower) ||
        f.address?.toLowerCase().includes(locationLower) ||
        f.state?.toLowerCase().includes(locationLower)
      );
      // If location filter finds results, use them; otherwise show all of that type
      if (locationFiltered.length > 0) {
        facilities = locationFiltered;
      }
    }

    // Filter by specialty if specified
    if (specialty) {
      const specialtyFiltered = facilities.filter(f =>
        f.services?.some(s => s.toLowerCase().includes(specialty.toLowerCase())) ||
        f.specialties?.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
      if (specialtyFiltered.length > 0) {
        facilities = specialtyFiltered;
      }
    }

    // Add ambulance services if type is ambulance
    if (facilityType === 'ambulance') {
      return {
        success: true,
        location,
        facilityType,
        specialty,
        urgency,
        facilities: AMBULANCE_SERVICES.map(a => ({
          name: a.name,
          address: a.coverage,
          phone: a.phone,
          distance: 'On Call',
          services: a.services,
          isOpen: a.available24x7,
        })),
        emergencyNote: '🚨 For emergencies, CALL 108 IMMEDIATELY for free ambulance service!',
        helplineNumbers: {
          ambulance: '108',
          emergency: '112',
          healthHelpline: '104',
          womenHelpline: '181',
          childHelpline: '1098',
        },
      };
    }

    // Format facilities for response
    const formattedFacilities = facilities.map(f => ({
      name: f.name,
      type: f.type,
      address: f.address,
      phone: f.phone || f.emergencyPhone || 'Contact PHC',
      distance: '2-10 km', // Would be calculated with real GPS
      services: f.services || [],
      specialties: f.specialties || [],
      isOpen: f.isOpen24x7,
      rating: f.rating,
      ayushmanEmpaneled: f.ayushmanEmpaneled,
      hasAmbulance: f.hasAmbulance,
      workingHours: f.workingHours,
    }));
    
    return {
      success: true,
      location,
      facilityType,
      specialty,
      urgency,
      totalFound: formattedFacilities.length,
      facilities: formattedFacilities,
      emergencyNote: urgency === 'emergency' ? '🚨 For emergencies, CALL 108 IMMEDIATELY for free ambulance service!' : null,
      helplineNumbers: {
        ambulance: '108',
        emergency: '112',
        healthHelpline: '104',
        womenHelpline: '181',
        childHelpline: '1098',
      },
    };
  },
});

/**
 * Book medical appointment
 */
export const bookAppointment = tool({
  description: `Book a medical appointment at a health facility. 
    Use when user wants to schedule a doctor visit, ANC checkup, vaccination, or any health appointment.`,
  inputSchema: z.object({
    facilityName: z.string().describe('Name of the health facility'),
    appointmentType: z.enum(['general', 'anc', 'vaccination', 'specialist', 'followup', 'emergency'])
      .describe('Type of appointment'),
    preferredDate: z.string().describe('Preferred date in YYYY-MM-DD format'),
    preferredTime: z.enum(['morning', 'afternoon', 'evening', 'any']).default('any')
      .describe('Preferred time slot'),
    patientName: z.string().describe('Name of the patient'),
    patientPhone: z.string().describe('Phone number for confirmation'),
    notes: z.string().optional().describe('Additional notes or symptoms'),
  }),
  execute: async ({ facilityName, appointmentType, preferredDate, preferredTime, patientName, patientPhone, notes }) => {
    // Generate booking reference
    const bookingRef = `APT${Date.now().toString(36).toUpperCase()}`;
    
    // In production, this would integrate with hospital management systems
    const timeSlots: Record<string, string> = {
      morning: '9:00 AM - 12:00 PM',
      afternoon: '2:00 PM - 5:00 PM',
      evening: '5:00 PM - 8:00 PM',
      any: 'Will be confirmed',
    };

    const appointmentTypeLabels: Record<string, string> = {
      general: 'General OPD',
      anc: 'Antenatal Checkup',
      vaccination: 'Vaccination',
      specialist: 'Specialist Consultation',
      followup: 'Follow-up Visit',
      emergency: 'Emergency',
    };

    return {
      success: true,
      bookingReference: bookingRef,
      status: 'PENDING_CONFIRMATION',
      details: {
        facility: facilityName,
        appointmentType: appointmentTypeLabels[appointmentType],
        date: preferredDate,
        timeSlot: timeSlots[preferredTime],
        patient: patientName,
        phone: patientPhone,
        notes: notes || 'None',
      },
      nextSteps: [
        'You will receive SMS confirmation within 24 hours',
        'Bring Aadhaar card and any previous medical records',
        'Arrive 15 minutes before appointment time',
        'For cancellation, call the facility helpline',
      ],
      reminder: 'A reminder will be sent 1 day before your appointment',
    };
  },
});

/**
 * Send SMS/Notification
 */
export const sendNotification = tool({
  description: `Send SMS or notification to user or their emergency contacts. 
    Use for appointment reminders, health alerts, emergency notifications, or scheme updates.`,
  inputSchema: z.object({
    recipientPhone: z.string().describe('Phone number to send message to'),
    recipientName: z.string().describe('Name of recipient'),
    messageType: z.enum(['reminder', 'alert', 'emergency', 'info', 'confirmation'])
      .describe('Type of message'),
    message: z.string().describe('The message content'),
    language: z.enum(['en', 'hi', 'mr', 'pa']).default('en').describe('Language for the message'),
  }),
  execute: async ({ recipientPhone, recipientName, messageType, message, language }) => {
    // In production, integrate with SMS gateway (MSG91, Twilio, etc.)
    const messageId = `MSG${Date.now().toString(36).toUpperCase()}`;
    
    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      mr: 'Marathi',
      pa: 'Punjabi',
    };

    return {
      success: true,
      messageId,
      status: 'QUEUED',
      recipient: {
        name: recipientName,
        phone: recipientPhone.replace(/(\d{2})(\d+)(\d{2})/, '$1****$3'), // Mask phone
      },
      messageType,
      language: languageNames[language],
      estimatedDelivery: 'Within 5 minutes',
      note: 'Message will be delivered in ' + languageNames[language],
    };
  },
});

/**
 * Get weather-based health alerts
 */
export const getWeatherHealthAlerts = tool({
  description: `Get weather information and associated health alerts for a location. 
    Use to provide season-specific health advice, disease outbreak warnings, or weather-related precautions.`,
  inputSchema: z.object({
    location: z.string().describe('Location to get weather for'),
    includeAdvice: z.boolean().default(true).describe('Include health advice'),
  }),
  execute: async ({ location, includeAdvice }) => {
    // Get current month to determine season
    const month = new Date().getMonth();
    let season: string;
    let alerts: { type: string; severity: string; message: string; precautions: string[] }[] = [];

    // Determine season (India-centric)
    if (month >= 2 && month <= 5) {
      season = 'summer';
      alerts = [
        {
          type: 'heatwave',
          severity: 'high',
          message: 'High temperatures expected. Heat stroke risk elevated.',
          precautions: [
            'Stay indoors during 11 AM - 4 PM',
            'Drink plenty of water (ORS if dehydrated)',
            'Wear light, loose cotton clothes',
            'Avoid strenuous outdoor work',
            'Keep checking on elderly and children',
          ],
        },
        {
          type: 'waterborne',
          severity: 'medium',
          message: 'Risk of water contamination increases in summer.',
          precautions: [
            'Drink only boiled or filtered water',
            'Avoid street food',
            'Wash fruits and vegetables thoroughly',
          ],
        },
      ];
    } else if (month >= 6 && month <= 9) {
      season = 'monsoon';
      alerts = [
        {
          type: 'mosquito-borne',
          severity: 'high',
          message: 'Dengue and Malaria risk HIGH during monsoon.',
          precautions: [
            'Use mosquito nets while sleeping',
            'Apply mosquito repellent',
            'Remove stagnant water around home',
            'Wear full-sleeve clothes in evening',
            'Seek immediate care if fever with body ache',
          ],
        },
        {
          type: 'waterborne',
          severity: 'high',
          message: 'Cholera, Typhoid, and Diarrhea risk elevated.',
          precautions: [
            'Boil water before drinking',
            'Avoid raw/street food',
            'Wash hands frequently',
            'Use ORS for any diarrhea',
          ],
        },
        {
          type: 'flood',
          severity: 'medium',
          message: 'Flood risk in low-lying areas.',
          precautions: [
            'Keep emergency kit ready',
            'Know your nearest shelter location',
            'Avoid walking in flood water',
            'Watch for snake bites',
          ],
        },
      ];
    } else if (month >= 10 && month <= 11) {
      season = 'post-monsoon';
      alerts = [
        {
          type: 'airQuality',
          severity: 'high',
          message: 'Air quality may deteriorate due to stubble burning.',
          precautions: [
            'Wear N95 mask outdoors',
            'Avoid morning walks during smog',
            'Keep windows closed',
            'Use air purifier if available',
            'People with asthma should keep inhalers ready',
          ],
        },
      ];
    } else {
      season = 'winter';
      alerts = [
        {
          type: 'cold',
          severity: 'medium',
          message: 'Cold wave conditions possible.',
          precautions: [
            'Keep warm, especially at night',
            'Protect infants and elderly from cold',
            'Watch for hypothermia signs',
            'Avoid prolonged outdoor exposure',
          ],
        },
        {
          type: 'respiratory',
          severity: 'medium',
          message: 'Flu and respiratory infections more common.',
          precautions: [
            'Get flu vaccination if available',
            'Wash hands frequently',
            'Cover mouth while coughing',
            'Keep distance from sick people',
          ],
        },
      ];
    }

    return {
      success: true,
      location,
      season,
      currentMonth: new Date().toLocaleString('en-IN', { month: 'long' }),
      alerts,
      generalAdvice: includeAdvice ? [
        'Keep emergency numbers saved: 108 (Ambulance), 104 (Health Helpline)',
        'Maintain hygiene and wash hands regularly',
        'Eat fresh, home-cooked food',
        'Stay updated on local health advisories',
      ] : [],
    };
  },
});

/**
 * Schedule health reminder
 */
export const scheduleReminder = tool({
  description: `Schedule a health reminder for the user (medication, appointment, vaccination, ANC visit). 
    Use when user needs to remember health activities or when proactively setting up care reminders.`,
  inputSchema: z.object({
    reminderType: z.enum(['medication', 'appointment', 'vaccination', 'ancVisit', 'exercise', 'checkup', 'custom'])
      .describe('Type of reminder'),
    title: z.string().describe('Short title for the reminder'),
    description: z.string().describe('Detailed description'),
    scheduledDate: z.string().describe('Date for reminder (YYYY-MM-DD)'),
    scheduledTime: z.string().default('09:00').describe('Time for reminder (HH:MM)'),
    recurring: z.enum(['none', 'daily', 'weekly', 'monthly']).default('none')
      .describe('Recurrence pattern'),
    notifyVia: z.enum(['sms', 'app', 'both']).default('both')
      .describe('How to notify'),
  }),
  execute: async ({ reminderType, title, description, scheduledDate, scheduledTime, recurring, notifyVia }) => {
    const reminderId = `REM${Date.now().toString(36).toUpperCase()}`;
    
    const reminderTypeLabels: Record<string, string> = {
      medication: '💊 Medication Reminder',
      appointment: '🏥 Appointment Reminder',
      vaccination: '💉 Vaccination Reminder',
      ancVisit: '🤰 ANC Visit Reminder',
      exercise: '🏃 Exercise Reminder',
      checkup: '🩺 Health Checkup Reminder',
      custom: '📋 Custom Reminder',
    };

    return {
      success: true,
      reminderId,
      status: 'SCHEDULED',
      details: {
        type: reminderTypeLabels[reminderType],
        title,
        description,
        scheduledFor: `${scheduledDate} at ${scheduledTime}`,
        recurring: recurring === 'none' ? 'One-time' : `Repeats ${recurring}`,
        notificationMethod: notifyVia,
      },
      message: `Reminder scheduled! You will be notified on ${scheduledDate} at ${scheduledTime}.`,
      canCancel: true,
      cancelInstructions: 'Say "cancel reminder" with the reminder ID to cancel',
    };
  },
});

/**
 * Check scheme eligibility with detailed analysis
 */
export const checkSchemeEligibility = tool({
  description: `Check eligibility for government health schemes based on user profile. 
    Use when user asks about schemes, benefits, financial assistance, or free healthcare programs.`,
  inputSchema: z.object({
    category: z.enum(['maternal', 'child', 'general', 'elderly', 'disability', 'all'])
      .describe('Category of schemes to check'),
    isPregnant: z.boolean().default(false).describe('Whether user is pregnant'),
    pregnancyWeek: z.number().optional().describe('Current pregnancy week if pregnant'),
    hasChildren: z.boolean().default(false).describe('Whether user has children under 6'),
    childrenAges: z.array(z.number()).optional().describe('Ages of children in years'),
    incomeLevel: z.enum(['bpl', 'apl', 'unknown']).default('unknown')
      .describe('Income level - Below/Above Poverty Line'),
    state: z.string().optional().describe('State for state-specific schemes'),
  }),
  execute: async ({ category, isPregnant, pregnancyWeek, hasChildren, childrenAges, incomeLevel, state }) => {
    const eligibleSchemes: {
      name: string;
      eligibility: string;
      benefits: string[];
      howToApply: string;
      priority: 'high' | 'medium' | 'low';
    }[] = [];

    // Maternal schemes
    if ((category === 'maternal' || category === 'all') && isPregnant) {
      eligibleSchemes.push({
        name: 'Janani Suraksha Yojana (JSY)',
        eligibility: 'You are ELIGIBLE as a pregnant woman',
        benefits: [
          'Cash assistance: ₹1,400 (rural) / ₹1,000 (urban)',
          'Free institutional delivery',
          'ASHA support and transport assistance',
        ],
        howToApply: 'Register with local ASHA worker or ANM. Deliver at government hospital.',
        priority: 'high',
      });

      eligibleSchemes.push({
        name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
        eligibility: 'You are ELIGIBLE for your first live birth',
        benefits: [
          'Total ₹5,000 cash benefit in 3 installments',
          '₹1,000 after registration',
          '₹2,000 after 6 months',
          '₹2,000 after child birth registration',
        ],
        howToApply: 'Register at Anganwadi center with Aadhaar, bank account, and MCP card.',
        priority: 'high',
      });

      if (pregnancyWeek && pregnancyWeek <= 12) {
        eligibleSchemes.push({
          name: 'Early ANC Registration Benefit',
          eligibility: 'You registered early - within first trimester!',
          benefits: [
            'Priority care at health facility',
            'Complete ANC package (4+ visits)',
            'All tests free at government facility',
          ],
          howToApply: 'Already registered. Continue regular ANC visits.',
          priority: 'medium',
        });
      }
    }

    // Child schemes
    if ((category === 'child' || category === 'all') && hasChildren) {
      eligibleSchemes.push({
        name: 'Mission Indradhanush (Vaccination)',
        eligibility: 'Your children are ELIGIBLE for free vaccination',
        benefits: [
          'Free vaccines for 12 diseases',
          'Protection from Polio, Measles, Hepatitis, etc.',
          'Door-to-door service in many areas',
        ],
        howToApply: 'Visit nearest PHC/Sub-center or contact ASHA worker.',
        priority: 'high',
      });

      eligibleSchemes.push({
        name: 'ICDS (Anganwadi Services)',
        eligibility: 'Children under 6 are ELIGIBLE',
        benefits: [
          'Supplementary nutrition',
          'Preschool education (3-6 years)',
          'Growth monitoring',
          'Immunization support',
        ],
        howToApply: 'Register at nearest Anganwadi center.',
        priority: 'high',
      });

      if (childrenAges?.some(age => age < 2)) {
        eligibleSchemes.push({
          name: 'Rashtriya Bal Swasthya Karyakram (RBSK)',
          eligibility: 'Children 0-18 years ELIGIBLE for health screening',
          benefits: [
            'Free health screening',
            'Early detection of defects and diseases',
            'Free treatment at District Early Intervention Centers',
          ],
          howToApply: 'Automatic screening at schools/Anganwadis.',
          priority: 'medium',
        });
      }
    }

    // General schemes
    if (category === 'general' || category === 'all') {
      if (incomeLevel === 'bpl' || incomeLevel === 'unknown') {
        eligibleSchemes.push({
          name: 'Ayushman Bharat PM-JAY',
          eligibility: incomeLevel === 'bpl' ? 'You are ELIGIBLE (BPL family)' : 'Check eligibility at mera.pmjay.gov.in',
          benefits: [
            '₹5 lakh health coverage per family per year',
            'Cashless treatment at 25,000+ hospitals',
            '1,350+ medical packages covered',
            'No premium or enrollment fee',
          ],
          howToApply: 'Visit CSC/PHC with Aadhaar & ration card. Check: mera.pmjay.gov.in',
          priority: 'high',
        });
      }

      eligibleSchemes.push({
        name: 'National Health Mission (Free Services)',
        eligibility: 'All citizens ELIGIBLE',
        benefits: [
          'Free OPD at government hospitals',
          'Free essential medicines',
          'Free diagnostics',
          '108 ambulance service',
        ],
        howToApply: 'Visit nearest PHC/CHC/District Hospital.',
        priority: 'medium',
      });
    }

    // State-specific placeholder
    if (state) {
      eligibleSchemes.push({
        name: `${state} State Health Scheme`,
        eligibility: 'Check state-specific eligibility',
        benefits: [
          'State-specific health benefits',
          'May include additional coverage',
          'Contact local health office for details',
        ],
        howToApply: `Visit ${state} state health portal or local PHC.`,
        priority: 'low',
      });
    }

    return {
      success: true,
      totalSchemesFound: eligibleSchemes.length,
      profile: {
        isPregnant,
        pregnancyWeek,
        hasChildren,
        childrenAges,
        incomeLevel,
        state,
      },
      eligibleSchemes: eligibleSchemes.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      nextSteps: [
        'Visit your nearest PHC or Anganwadi with Aadhaar card',
        'Carry ration card if BPL',
        'ASHA worker can help with registration',
      ],
      helplineNumbers: {
        ayushmanBharat: '14555',
        healthHelpline: '104',
        womenHelpline: '181',
      },
    };
  },
});

/**
 * Apply for scheme (guided application)
 */
export const applyForScheme = tool({
  description: `Help user apply for a government health scheme. 
    Use after eligibility is confirmed and user wants to proceed with application.`,
  inputSchema: z.object({
    schemeName: z.string().describe('Name of the scheme to apply for'),
    applicantName: z.string().describe('Full name of applicant'),
    applicantPhone: z.string().describe('Phone number'),
    applicantAddress: z.string().describe('Full address'),
    hasAadhaar: z.boolean().describe('Whether applicant has Aadhaar'),
    hasBankAccount: z.boolean().describe('Whether applicant has bank account'),
  }),
  execute: async ({ schemeName, applicantName, applicantPhone, applicantAddress, hasAadhaar, hasBankAccount }) => {
    const applicationId = `APP${Date.now().toString(36).toUpperCase()}`;
    
    const missingDocuments: string[] = [];
    if (!hasAadhaar) missingDocuments.push('Aadhaar Card');
    if (!hasBankAccount) missingDocuments.push('Bank Account (for cash benefits)');

    const applicationSteps = [
      {
        step: 1,
        title: 'Document Collection',
        status: missingDocuments.length === 0 ? 'ready' : 'pending',
        description: missingDocuments.length === 0 
          ? 'All required documents available'
          : `Missing: ${missingDocuments.join(', ')}`,
      },
      {
        step: 2,
        title: 'Visit Enrollment Center',
        status: 'pending',
        description: 'Visit nearest PHC, CSC, or Anganwadi center',
      },
      {
        step: 3,
        title: 'Fill Application Form',
        status: 'pending',
        description: 'ASHA worker or staff will help fill the form',
      },
      {
        step: 4,
        title: 'Verification',
        status: 'pending',
        description: 'Documents and eligibility will be verified',
      },
      {
        step: 5,
        title: 'Enrollment Confirmation',
        status: 'pending',
        description: 'You will receive confirmation via SMS',
      },
    ];

    return {
      success: true,
      applicationId,
      scheme: schemeName,
      applicant: {
        name: applicantName,
        phone: applicantPhone.replace(/(\d{2})(\d+)(\d{2})/, '$1****$3'),
        address: applicantAddress,
      },
      readyToApply: missingDocuments.length === 0,
      missingDocuments,
      applicationSteps,
      tips: [
        'Carry original documents for verification',
        'Keep photocopies of all documents',
        'Note down the application reference number',
        'Follow up after 15 days if no response',
      ],
      helpDesk: {
        phone: '104',
        description: 'Health Helpline for scheme queries',
      },
    };
  },
});

/**
 * Get personalized health recommendations
 */
export const getPersonalizedRecommendations = tool({
  description: `Get personalized health recommendations based on user's profile, pregnancy status, children, location, and season. 
    Use proactively to provide tailored health advice and care reminders.`,
  inputSchema: z.object({
    isPregnant: z.boolean().default(false),
    pregnancyWeek: z.number().optional(),
    hasChildren: z.boolean().default(false),
    childrenAges: z.array(z.number()).optional(),
    region: z.string().optional(),
    healthConditions: z.array(z.string()).optional(),
    language: z.enum(['en', 'hi', 'mr', 'pa']).default('en'),
  }),
  execute: async ({ isPregnant, pregnancyWeek, hasChildren, childrenAges, region, healthConditions, language }) => {
    const recommendations: {
      category: string;
      priority: 'urgent' | 'important' | 'routine';
      title: string;
      description: string;
      action: string;
    }[] = [];

    const month = new Date().getMonth();
    const season = month >= 6 && month <= 9 ? 'monsoon' : month >= 2 && month <= 5 ? 'summer' : 'winter';

    // Pregnancy-specific recommendations
    if (isPregnant && pregnancyWeek) {
      if (pregnancyWeek <= 12) {
        recommendations.push({
          category: 'Pregnancy',
          priority: 'urgent',
          title: 'First Trimester Care',
          description: 'Critical period for baby development. Take folic acid daily. Avoid heavy lifting.',
          action: 'Schedule first ANC checkup if not done',
        });
      } else if (pregnancyWeek >= 13 && pregnancyWeek <= 28) {
        recommendations.push({
          category: 'Pregnancy',
          priority: 'important',
          title: 'Second Trimester Checkups',
          description: 'Get ultrasound scan done. Check for gestational diabetes.',
          action: 'Ensure 2nd ANC visit completed',
        });
        if (pregnancyWeek >= 20) {
          recommendations.push({
            category: 'Pregnancy',
            priority: 'important',
            title: 'TT Vaccination Due',
            description: 'Tetanus vaccination protects mother and baby during delivery.',
            action: 'Get TT-1 vaccine at PHC',
          });
        }
      } else if (pregnancyWeek >= 29) {
        recommendations.push({
          category: 'Pregnancy',
          priority: 'urgent',
          title: 'Third Trimester - Prepare for Delivery',
          description: 'Pack hospital bag. Know danger signs. Have transport ready.',
          action: 'Identify delivery hospital and keep 108 number saved',
        });
        recommendations.push({
          category: 'Pregnancy',
          priority: 'important',
          title: 'Increased ANC Visits',
          description: 'Weekly checkups recommended after week 36.',
          action: 'Schedule weekly PHC visits',
        });
      }
    }

    // Child health recommendations
    if (hasChildren && childrenAges) {
      for (const age of childrenAges) {
        if (age < 1) {
          recommendations.push({
            category: 'Child Health',
            priority: 'urgent',
            title: 'Infant Vaccination Schedule',
            description: 'Multiple vaccines due in first year. Critical for protection.',
            action: 'Check and complete all due vaccines at PHC',
          });
          recommendations.push({
            category: 'Child Health',
            priority: 'important',
            title: 'Exclusive Breastfeeding',
            description: 'Only breast milk for first 6 months. Best nutrition and immunity.',
            action: 'Continue exclusive breastfeeding if child < 6 months',
          });
        } else if (age >= 1 && age < 2) {
          recommendations.push({
            category: 'Child Health',
            priority: 'important',
            title: 'Booster Vaccines Due',
            description: 'DPT and OPV boosters due at 16-24 months.',
            action: 'Visit PHC for booster doses',
          });
        } else if (age >= 2 && age < 6) {
          recommendations.push({
            category: 'Child Health',
            priority: 'routine',
            title: 'Anganwadi Registration',
            description: 'Free preschool, nutrition, and health checkups.',
            action: 'Register at nearest Anganwadi if not done',
          });
        }
      }
    }

    // Seasonal recommendations
    if (season === 'monsoon') {
      recommendations.push({
        category: 'Seasonal Health',
        priority: 'urgent',
        title: 'Dengue & Malaria Prevention',
        description: 'High risk season. Use mosquito nets and repellents.',
        action: 'Remove stagnant water around home. If fever, get tested immediately.',
      });
    } else if (season === 'summer') {
      recommendations.push({
        category: 'Seasonal Health',
        priority: 'important',
        title: 'Heat Protection',
        description: 'Stay hydrated. Avoid outdoor work in afternoon.',
        action: 'Drink ORS if feeling dehydrated. Keep children indoors 11 AM - 4 PM.',
      });
    }

    // General recommendations
    recommendations.push({
      category: 'General Health',
      priority: 'routine',
      title: 'Regular Health Checkup',
      description: 'Annual health checkup helps detect problems early.',
      action: 'Schedule checkup at PHC if not done in last year',
    });

    // Sort by priority
    const priorityOrder = { urgent: 0, important: 1, routine: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return {
      success: true,
      generatedAt: new Date().toISOString(),
      profile: {
        isPregnant,
        pregnancyWeek,
        hasChildren,
        childrenAges,
        region,
        season,
      },
      totalRecommendations: recommendations.length,
      recommendations,
      urgentActions: recommendations.filter(r => r.priority === 'urgent').map(r => r.action),
      helplineNumbers: {
        healthHelpline: '104',
        ambulance: '108',
        womenHelpline: '181',
      },
    };
  },
});

// ============================================
// ENHANCED TOOLS EXPORT
// ============================================
export const agenticHealthTools = {
  // Basic tools
  ...healthTools,
  // Enhanced agentic tools
  findHealthFacility,
  bookAppointment,
  sendNotification,
  getWeatherHealthAlerts,
  scheduleReminder,
  checkSchemeEligibility,
  applyForScheme,
  getPersonalizedRecommendations,
};

export type AgenticToolName = keyof typeof agenticHealthTools;
