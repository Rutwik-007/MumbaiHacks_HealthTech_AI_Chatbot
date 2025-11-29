/**
 * Health Knowledge Base Seeding Script
 * 
 * This script populates the ChromaDB vector store with health information
 * for the Disease Awareness Platform.
 * 
 * Run with: npx tsx lib/health-platform/seed-knowledge-base.ts
 */

import { addDocuments, initializeVectorStore, getCollectionStats } from './rag/vector-store';
import type { HealthCategory, SupportedLanguage } from './types';

// ===== DISEASE INFORMATION =====
const DISEASE_DOCUMENTS = [
  // DENGUE
  {
    id: 'dengue-overview-en',
    content: `Dengue Fever Overview
    
Dengue is a viral infection spread by Aedes mosquitoes, primarily Aedes aegypti. It is common during and after monsoon season in India.

Symptoms (appear 4-10 days after bite):
- High fever (40°C/104°F)
- Severe headache
- Pain behind eyes
- Muscle and joint pain
- Nausea and vomiting
- Skin rash (appears 2-5 days after fever)
- Mild bleeding (nose, gums)

Warning Signs (Seek immediate care):
- Severe abdominal pain
- Persistent vomiting
- Rapid breathing
- Bleeding gums or nose
- Fatigue and restlessness
- Blood in vomit or stool
- Very low platelet count

Prevention:
- Remove stagnant water from containers, tires, flower pots
- Use mosquito nets and repellents
- Wear long-sleeved clothes
- Use screens on windows and doors
- Spray insecticides in dark corners

Treatment:
- No specific antiviral treatment
- Rest and plenty of fluids
- Paracetamol for fever (NOT aspirin or ibuprofen)
- Monitor platelet count
- Hospitalization if platelets drop below 50,000

Emergency Number: 108 (Ambulance)`,
    metadata: {
      title: 'Dengue Fever Overview',
      category: 'dengue' as HealthCategory,
      language: 'en' as SupportedLanguage,
      source: 'National Vector Borne Disease Control Programme',
      tags: ['dengue', 'fever', 'mosquito', 'symptoms', 'prevention'],
    },
  },
  {
    id: 'dengue-overview-hi',
    content: `डेंगू बुखार जानकारी

डेंगू एक वायरल संक्रमण है जो एडीज मच्छरों से फैलता है। यह भारत में मानसून के दौरान और बाद में आम है।

लक्षण (काटने के 4-10 दिन बाद):
- तेज बुखार (40°C/104°F)
- तेज सिरदर्द
- आंखों के पीछे दर्द
- मांसपेशियों और जोड़ों में दर्द
- मतली और उल्टी
- त्वचा पर चकत्ते
- हल्का रक्तस्राव (नाक, मसूड़ों से)

खतरे के संकेत (तुरंत चिकित्सा लें):
- पेट में तेज दर्द
- लगातार उल्टी
- तेज सांस लेना
- मसूड़ों या नाक से खून
- थकान और बेचैनी
- उल्टी या मल में खून
- प्लेटलेट्स बहुत कम

बचाव:
- बर्तनों, टायरों, गमलों से पानी हटाएं
- मच्छरदानी और रिपेलेंट का उपयोग करें
- पूरी बाजू के कपड़े पहनें
- खिड़कियों पर जाली लगाएं

इलाज:
- आराम और खूब पानी पीएं
- बुखार के लिए पैरासिटामोल (एस्पिरिन नहीं)
- प्लेटलेट्स की निगरानी करें
- 50,000 से कम प्लेटलेट्स पर अस्पताल जाएं

आपातकालीन नंबर: 108 (एम्बुलेंस)`,
    metadata: {
      title: 'डेंगू बुखार जानकारी',
      category: 'dengue' as HealthCategory,
      language: 'hi' as SupportedLanguage,
      source: 'राष्ट्रीय वेक्टर जनित रोग नियंत्रण कार्यक्रम',
      tags: ['डेंगू', 'बुखार', 'मच्छर'],
    },
  },

  // MALARIA
  {
    id: 'malaria-overview-en',
    content: `Malaria Overview

Malaria is caused by Plasmodium parasites transmitted through infected Anopheles mosquito bites. It's common in tribal and forest areas of India.

Types in India:
- Plasmodium vivax (most common, milder)
- Plasmodium falciparum (severe, can be fatal)

Symptoms (appear 10-15 days after bite):
- Fever with chills and sweating
- Headache
- Nausea and vomiting
- Muscle pain and fatigue
- Fever comes in cycles (every 48-72 hours)

Severe Malaria Signs:
- Very high fever
- Confusion or drowsiness
- Severe anemia
- Breathing difficulty
- Kidney failure
- Jaundice

Diagnosis:
- Blood smear test (microscopy)
- Rapid Diagnostic Test (RDT)
- Available free at all government hospitals

Treatment:
- ACT (Artemisinin Combination Therapy) for P. falciparum
- Chloroquine + Primaquine for P. vivax
- Complete the full course of treatment
- Free treatment available at PHC/CHC

Prevention:
- Sleep under insecticide-treated bed nets (LLIN)
- Use mosquito repellents
- Wear protective clothing in evening
- Indoor residual spraying in endemic areas
- Remove mosquito breeding sites

National Program: National Vector Borne Disease Control Programme (NVBDCP)
Emergency: 108`,
    metadata: {
      title: 'Malaria Overview',
      category: 'malaria' as HealthCategory,
      language: 'en' as SupportedLanguage,
      source: 'NVBDCP Guidelines',
      tags: ['malaria', 'fever', 'mosquito', 'treatment'],
    },
  },

  // VACCINES
  {
    id: 'vaccines-schedule-en',
    content: `National Immunization Schedule (NIS) - India

At Birth:
- BCG (Bacillus Calmette-Guérin) - Prevents TB
- OPV-0 (Oral Polio Vaccine) - Prevents Polio
- Hepatitis B - Birth dose

6 Weeks:
- OPV-1
- Pentavalent-1 (DPT + HepB + Hib)
- Rotavirus-1 (in selected states)
- fIPV-1 (Injectable Polio)
- PCV-1 (Pneumococcal, in selected states)

10 Weeks:
- OPV-2
- Pentavalent-2
- Rotavirus-2

14 Weeks:
- OPV-3
- Pentavalent-3
- Rotavirus-3
- fIPV-2
- PCV-2

9 Months:
- Measles-Rubella (MR-1)
- JE-1 (Japanese Encephalitis, endemic areas)
- PCV Booster

16-24 Months:
- MR-2
- JE-2
- DPT Booster-1
- OPV Booster

5-6 Years:
- DPT Booster-2

10 Years:
- TT-1 (Tetanus Toxoid)

16 Years:
- TT-2

During Pregnancy:
- Td-1 (early pregnancy)
- Td-2 (4 weeks after Td-1)
- Td Booster (if previously vaccinated)

All vaccines are FREE at government health facilities.
For nearest vaccination center: Contact ANM/ASHA or call 104`,
    metadata: {
      title: 'National Immunization Schedule',
      category: 'vaccines' as HealthCategory,
      language: 'en' as SupportedLanguage,
      source: 'Ministry of Health & Family Welfare',
      tags: ['vaccine', 'immunization', 'child', 'schedule'],
    },
  },
  {
    id: 'vaccines-schedule-hi',
    content: `राष्ट्रीय टीकाकरण कार्यक्रम - भारत

जन्म के समय:
- BCG - टीबी से बचाव
- OPV-0 - पोलियो से बचाव
- हेपेटाइटिस B - जन्म खुराक

6 सप्ताह:
- OPV-1
- पेंटावैलेंट-1 (DPT + HepB + Hib)
- रोटावायरस-1 (चुनिंदा राज्यों में)

10 सप्ताह:
- OPV-2
- पेंटावैलेंट-2
- रोटावायरस-2

14 सप्ताह:
- OPV-3
- पेंटावैलेंट-3
- रोटावायरस-3

9 महीने:
- खसरा-रूबेला (MR-1)
- JE-1 (जापानी एन्सेफलाइटिस)

16-24 महीने:
- MR-2
- JE-2
- DPT बूस्टर-1

5-6 साल:
- DPT बूस्टर-2

10 साल:
- TT-1 (टेटनस)

16 साल:
- TT-2

गर्भावस्था में:
- Td-1 (शुरुआती गर्भावस्था)
- Td-2 (Td-1 के 4 सप्ताह बाद)

सभी टीके सरकारी स्वास्थ्य केंद्रों पर मुफ्त हैं।
नजदीकी टीकाकरण केंद्र: ANM/आशा से संपर्क करें या 104 पर कॉल करें`,
    metadata: {
      title: 'राष्ट्रीय टीकाकरण कार्यक्रम',
      category: 'vaccines' as HealthCategory,
      language: 'hi' as SupportedLanguage,
      source: 'स्वास्थ्य और परिवार कल्याण मंत्रालय',
      tags: ['टीका', 'टीकाकरण', 'बच्चे'],
    },
  },

  // PREGNANCY/MATERNAL HEALTH
  {
    id: 'pregnancy-care-en',
    content: `Pregnancy Care Guide

Antenatal Care (ANC) Visits:
- First visit: Within 12 weeks of pregnancy
- Second visit: 14-26 weeks
- Third visit: 28-34 weeks
- Fourth visit: 36 weeks onwards
- More visits for high-risk pregnancies

Tests During Pregnancy:
- Hemoglobin (for anemia)
- Blood group and Rh factor
- Urine test (for infection/sugar)
- Blood pressure check
- Weight monitoring
- Ultrasound (at least 2)

Nutrition During Pregnancy:
- Iron and Folic Acid tablets daily (IFA)
- Calcium tablets
- Eat green leafy vegetables
- Protein-rich foods (dal, eggs, milk)
- Avoid raw or undercooked food

Danger Signs (Rush to Hospital):
- Vaginal bleeding
- Severe headache with blurred vision
- High fever
- Reduced or no fetal movement
- Water breaking before time
- Swelling of face and hands
- Severe abdominal pain
- Convulsions

Government Benefits:
- Janani Suraksha Yojana (JSY): Cash for institutional delivery
  - Rural: ₹1,400
  - Urban: ₹1,000
- Free delivery at government hospitals
- Free ambulance (108 Dial)
- Pradhan Mantri Matru Vandana Yojana: ₹5,000 in installments

ASHA Worker Support:
- Home visits during pregnancy
- Accompaniment to hospital
- Postnatal care support
- Help with government schemes

Emergency: Call 108 for ambulance`,
    metadata: {
      title: 'Pregnancy Care Guide',
      category: 'maternal_health' as HealthCategory,
      language: 'en' as SupportedLanguage,
      source: 'National Health Mission',
      tags: ['pregnancy', 'anc', 'maternal', 'delivery'],
    },
  },

  // CHILD HEALTH
  {
    id: 'child-health-en',
    content: `Child Health Care (0-5 Years)

Newborn Care (First 28 Days):
- Breastfeeding within 1 hour of birth
- Exclusive breastfeeding for 6 months
- Keep baby warm (Kangaroo care for low birth weight)
- Clean cord care
- Watch for danger signs

Danger Signs in Newborn:
- Not feeding well
- High fever or very cold
- Fast breathing (>60/min)
- Chest indrawing
- Convulsions
- Jaundice within 24 hours
- No movement when stimulated

Growth Monitoring:
- Monthly weighing at Anganwadi
- Plot on growth chart
- Check for undernutrition

Malnutrition Types:
- Underweight: Weight-for-age low
- Stunting: Height-for-age low
- Wasting: Weight-for-height low
- SAM (Severe Acute Malnutrition): Needs immediate treatment

IMNCI Approach:
When child is sick, check for:
- Danger signs
- Cough/breathing difficulty
- Diarrhea
- Fever
- Ear problems
- Malnutrition
- Anemia

Nutrition After 6 Months:
- Continue breastfeeding until 2 years
- Start complementary feeding at 6 months
- Thick consistency, not watery
- Variety of foods
- Feed 3-4 times a day (6-8 months)
- Feed 4-5 times a day (9-24 months)

Government Programs:
- Anganwadi: Supplementary nutrition
- ICDS: Child development services
- RBSK: Health screening at schools
- Free treatment under NHM

Contact: ASHA worker or Anganwadi center`,
    metadata: {
      title: 'Child Health Care Guide',
      category: 'child_health' as HealthCategory,
      language: 'en' as SupportedLanguage,
      source: 'ICDS/NHM Guidelines',
      tags: ['child', 'newborn', 'nutrition', 'growth'],
    },
  },

  // GOVERNMENT SCHEMES
  {
    id: 'ayushman-bharat-en',
    content: `Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)

Overview:
World's largest health insurance scheme providing ₹5 lakh coverage per family per year for secondary and tertiary hospitalization.

Eligibility:
- Families identified in SECC 2011 database
- No premium or enrollment fee
- No age or family size limit
- Covers pre-existing conditions from day 1

Coverage:
- ₹5 lakh per family per year
- Cashless treatment at empaneled hospitals
- 1,350+ medical packages covered
- Both government and private hospitals
- Includes 3 days pre-hospitalization
- 15 days post-hospitalization

How to Check Eligibility:
1. Visit mera.pmjay.gov.in
2. Enter mobile number with captcha
3. Check family details
4. Or call toll-free: 14555

How to Get Card:
1. Visit nearest CSC (Common Service Center)
2. Or visit empaneled hospital
3. Carry Aadhaar/Ration Card
4. Free e-card generation

Documents Required:
- Aadhaar card
- Ration card
- Any government ID

What's Covered:
- Medical tests and treatment
- Medicines during hospitalization
- Room charges
- ICU charges
- Surgery costs
- Organ transplants (some)
- Cancer treatment

What's NOT Covered:
- OPD treatment
- Cosmetic procedures
- Fertility treatment
- Drug/alcohol abuse treatment

Helpline: 14555 (Toll-free)
Website: pmjay.gov.in`,
    metadata: {
      title: 'Ayushman Bharat PM-JAY',
      category: 'general' as HealthCategory,
      language: 'en' as SupportedLanguage,
      source: 'National Health Authority',
      tags: ['ayushman', 'insurance', 'pmjay', 'scheme'],
    },
  },
  {
    id: 'jsy-scheme-en',
    content: `Janani Suraksha Yojana (JSY)

Objective:
Promote institutional deliveries to reduce maternal and infant mortality.

Eligibility:
- All pregnant women in LPS (Low Performing States)
- BPL pregnant women in HPS (High Performing States)
- Delivery at government or accredited private hospital

LPS States: UP, Uttarakhand, Bihar, Jharkhand, MP, Chhattisgarh, Assam, Rajasthan, Odisha, J&K

Cash Benefits:

Rural Areas:
- Mother: ₹1,400
- ASHA: ₹600

Urban Areas:
- Mother: ₹1,000
- ASHA: ₹400

How to Avail:
1. Register pregnancy with ANM/ASHA
2. Get MCH card
3. Complete ANC visits
4. Deliver at registered hospital
5. Cash transferred to bank account

ASHA Role:
- Identify pregnant women
- Facilitate 3+ ANC visits
- Arrange transport
- Stay with mother during delivery
- Ensure post-natal care

Documents Needed:
- MCH card
- Aadhaar card
- Bank account details
- BPL card (for HPS states)

Related Scheme: 
Janani Shishu Suraksha Karyakram (JSSK)
- Free delivery (normal and C-section)
- Free medicines and diagnostics
- Free diet during stay
- Free transport (home to hospital and back)

Contact: Nearest PHC/CHC or ASHA worker`,
    metadata: {
      title: 'Janani Suraksha Yojana',
      category: 'maternal_health' as HealthCategory,
      language: 'en' as SupportedLanguage,
      source: 'National Health Mission',
      tags: ['jsy', 'delivery', 'pregnancy', 'scheme'],
    },
  },

  // NUTRITION
  {
    id: 'nutrition-basics-en',
    content: `Nutrition Guidelines for Health

Balanced Diet Components:
1. Carbohydrates: Rice, wheat, millets
2. Proteins: Dal, pulses, eggs, milk, meat
3. Fats: Oil, ghee (in moderation)
4. Vitamins: Fruits and vegetables
5. Minerals: Green leafy vegetables, milk
6. Water: 8-10 glasses daily

Anemia Prevention:
- Iron-rich foods: Green leafy vegetables, jaggery, dates
- Vitamin C helps iron absorption: Lemon, amla, orange
- Avoid tea/coffee with meals
- Take IFA tablets as prescribed

For Pregnant Women:
- Extra 300 calories/day
- IFA tablets daily (one red tablet)
- Calcium tablets
- Eat small, frequent meals
- Avoid raw papaya, pineapple excess

For Children (6 months - 2 years):
- Continue breastfeeding
- Start with mashed foods at 6 months
- Add variety gradually
- Thick consistency, not watery
- Feed frequently (4-5 times/day)
- Add oil/ghee for energy

Iodine Deficiency Prevention:
- Use only iodized salt
- Don't add salt while cooking, add later
- Store salt in covered container

Vitamin A:
- Yellow/orange fruits and vegetables
- Green leafy vegetables
- Vitamin A supplements for children

Local Nutritious Foods:
- Sattu (roasted gram flour)
- Khichdi with vegetables
- Daliya (broken wheat)
- Ragi (finger millet)
- Local seasonal fruits

Government Nutrition Programs:
- Mid-Day Meal Scheme (schools)
- ICDS (Anganwadi nutrition)
- Take Home Ration (THR)
- Poshan Abhiyaan`,
    metadata: {
      title: 'Nutrition Guidelines',
      category: 'nutrition' as HealthCategory,
      language: 'en' as SupportedLanguage,
      source: 'National Nutrition Mission',
      tags: ['nutrition', 'diet', 'anemia', 'food'],
    },
  },

  // EMERGENCY
  {
    id: 'emergency-guide-en',
    content: `Medical Emergency Guide

EMERGENCY NUMBERS:
- Ambulance: 108 (Free)
- All Emergencies: 112
- Women Helpline: 181
- Child Helpline: 1098
- Health Helpline: 104

WHEN TO CALL 108:
- Chest pain or heart attack symptoms
- Difficulty breathing
- Unconsciousness
- Severe bleeding
- Stroke symptoms (face drooping, arm weakness, speech difficulty)
- Severe allergic reaction
- Accidents and injuries
- Childbirth/delivery
- Poisoning
- Snake/animal bite
- Drowning

FIRST AID BASICS:

For Bleeding:
1. Apply direct pressure with clean cloth
2. Elevate the injured part
3. Don't remove the cloth, add more if needed
4. Get to hospital

For Burns:
1. Cool with running water for 10-20 minutes
2. Don't apply ice, butter, or toothpaste
3. Cover with clean cloth
4. Don't break blisters

For Choking:
1. Encourage coughing
2. For adults: 5 back blows, then 5 abdominal thrusts
3. For infants: 5 back blows, then 5 chest thrusts

For Unconscious Person:
1. Check if breathing
2. Call 108
3. If not breathing: Start CPR
4. Place in recovery position if breathing

For Snake Bite:
1. Keep calm, don't panic
2. Immobilize the bitten limb
3. Don't cut or suck the wound
4. Don't apply tourniquet
5. Rush to hospital
6. Anti-venom available at PHC/CHC

Heat Stroke:
1. Move to shade
2. Cool with water/fan
3. Give ORS or water (if conscious)
4. Rush to hospital

REMEMBER:
- Stay calm
- Call for help immediately
- Don't delay hospital visit
- All government hospitals have emergency services`,
    metadata: {
      title: 'Emergency Guide',
      category: 'emergency' as HealthCategory,
      language: 'en' as SupportedLanguage,
      source: 'Emergency Medical Services',
      tags: ['emergency', 'first aid', 'ambulance', '108'],
    },
  },
];

// ===== SEEDING FUNCTION =====
async function seedKnowledgeBase() {
  console.log('🌱 Starting Health Knowledge Base Seeding...\n');

  try {
    // Initialize vector store
    console.log('📦 Initializing vector store...');
    await initializeVectorStore();
    console.log('✅ Vector store initialized\n');

    // Add documents
    console.log(`📄 Adding ${DISEASE_DOCUMENTS.length} documents...`);
    
    await addDocuments(DISEASE_DOCUMENTS);
    
    console.log('✅ Documents added successfully\n');

    // Get stats
    const stats = await getCollectionStats();
    console.log('📊 Collection Stats:');
    console.log(`   Total documents: ${stats.count}`);
    console.log(`   Collection: ${stats.name}\n`);

    console.log('🎉 Knowledge base seeding complete!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeding
seedKnowledgeBase()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
