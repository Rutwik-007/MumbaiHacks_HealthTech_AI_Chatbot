/**
 * Test Data Seed Script for Agentic AI Features
 * Run with: npx tsx lib/health-platform/db/seed-test-data.ts
 */

// =============================================
// HEALTH FACILITIES TEST DATA
// =============================================

export const TEST_FACILITIES = [
  // Maharashtra - Pune District
  {
    id: 'fac-001',
    name: 'Sassoon General Hospital',
    type: 'hospital',
    address: 'Sasoon Road, Pune, Maharashtra 411001',
    district: 'Pune',
    state: 'Maharashtra',
    phone: '020-26163000',
    emergencyPhone: '108',
    coordinates: { lat: 18.5314, lng: 73.8446 },
    services: ['Emergency', 'OPD', 'IPD', 'Surgery', 'Maternity', 'Pediatric', 'ICU', 'Blood Bank'],
    specialties: ['General Medicine', 'Gynecology', 'Pediatrics', 'Orthopedics', 'Cardiology'],
    isOpen24x7: true,
    hasAmbulance: true,
    ayushmanEmpaneled: true,
    rating: 4.2,
    totalBeds: 1300,
    availableBeds: 150,
  },
  {
    id: 'fac-002',
    name: 'Yerawada Primary Health Center',
    type: 'phc',
    address: 'Yerawada, Pune, Maharashtra 411006',
    district: 'Pune',
    state: 'Maharashtra',
    phone: '020-26680012',
    emergencyPhone: '104',
    coordinates: { lat: 18.5580, lng: 73.8992 },
    services: ['OPD', 'Vaccination', 'ANC', 'Basic Lab', 'Pharmacy', 'Family Planning'],
    specialties: ['General Medicine', 'Maternal Health', 'Child Health'],
    isOpen24x7: false,
    workingHours: '8:00 AM - 4:00 PM',
    hasAmbulance: false,
    ayushmanEmpaneled: true,
    rating: 3.8,
  },
  {
    id: 'fac-003',
    name: 'Aundh Community Health Center',
    type: 'chc',
    address: 'Aundh, Pune, Maharashtra 411007',
    district: 'Pune',
    state: 'Maharashtra',
    phone: '020-25888123',
    emergencyPhone: '108',
    coordinates: { lat: 18.5590, lng: 73.8077 },
    services: ['24x7 Emergency', 'Delivery', 'Minor Surgery', 'Blood Bank', 'X-Ray', 'Lab'],
    specialties: ['Emergency Medicine', 'Obstetrics', 'General Surgery'],
    isOpen24x7: true,
    hasAmbulance: true,
    ayushmanEmpaneled: true,
    rating: 4.0,
    totalBeds: 30,
    availableBeds: 8,
  },
  {
    id: 'fac-004',
    name: 'Kothrud Sub-Center',
    type: 'subCenter',
    address: 'Kothrud, Pune, Maharashtra 411038',
    district: 'Pune',
    state: 'Maharashtra',
    phone: '020-25382456',
    coordinates: { lat: 18.5074, lng: 73.8077 },
    services: ['ANM Services', 'Vaccination', 'ANC Checkup', 'Health Education', 'First Aid'],
    isOpen24x7: false,
    workingHours: '9:00 AM - 5:00 PM',
    hasAmbulance: false,
  },
  {
    id: 'fac-005',
    name: 'ASHA Worker - Hadapsar Area',
    type: 'ashaWorker',
    address: 'Hadapsar, Pune, Maharashtra 411028',
    district: 'Pune',
    state: 'Maharashtra',
    phone: '9876543210',
    contactPerson: 'Sunita Jadhav',
    coordinates: { lat: 18.5089, lng: 73.9260 },
    services: ['Home Visits', 'Health Education', 'Medicine Distribution', 'Referral', 'ANC Support', 'Child Care'],
    coverage: 'Hadapsar Ward 1-3',
    activeHouseholds: 250,
  },
  {
    id: 'fac-006',
    name: 'Anganwadi Center - Magarpatta',
    type: 'anganwadi',
    address: 'Magarpatta City, Hadapsar, Pune 411028',
    district: 'Pune',
    state: 'Maharashtra',
    phone: '9876543211',
    contactPerson: 'Priya Patil',
    coordinates: { lat: 18.5167, lng: 73.9273 },
    services: ['Child Nutrition', 'Preschool Education', 'Immunization', 'Growth Monitoring', 'Take-Home Ration'],
    workingHours: '8:00 AM - 1:00 PM',
    registeredChildren: 45,
    registeredMothers: 12,
  },
  {
    id: 'fac-007',
    name: 'Jan Aushadhi Kendra - Kothrud',
    type: 'pharmacy',
    address: 'Paud Road, Kothrud, Pune 411038',
    district: 'Pune',
    state: 'Maharashtra',
    phone: '020-25384567',
    coordinates: { lat: 18.5074, lng: 73.8120 },
    services: ['Generic Medicines', 'Surgical Items', 'OTC Medicines'],
    workingHours: '8:00 AM - 9:00 PM',
    discount: '50-90% cheaper than branded medicines',
  },
  
  // Maharashtra - Mumbai
  {
    id: 'fac-008',
    name: 'KEM Hospital',
    type: 'hospital',
    address: 'Parel, Mumbai, Maharashtra 400012',
    district: 'Mumbai',
    state: 'Maharashtra',
    phone: '022-24136051',
    emergencyPhone: '108',
    coordinates: { lat: 19.0030, lng: 72.8414 },
    services: ['Emergency', 'OPD', 'IPD', 'Surgery', 'Trauma', 'Burns', 'Maternity', 'NICU'],
    specialties: ['All Specialties', 'Super Specialties', 'Transplant'],
    isOpen24x7: true,
    hasAmbulance: true,
    ayushmanEmpaneled: true,
    rating: 4.5,
    totalBeds: 2500,
  },
  
  // Punjab - Ludhiana
  {
    id: 'fac-009',
    name: 'Civil Hospital Ludhiana',
    type: 'hospital',
    address: 'Civil Lines, Ludhiana, Punjab 141001',
    district: 'Ludhiana',
    state: 'Punjab',
    phone: '0161-2444123',
    emergencyPhone: '108',
    coordinates: { lat: 30.9010, lng: 75.8573 },
    services: ['Emergency', 'OPD', 'IPD', 'Surgery', 'Maternity', 'Pediatric'],
    isOpen24x7: true,
    ayushmanEmpaneled: true,
    rating: 4.0,
  },
  {
    id: 'fac-010',
    name: 'PHC Khanna',
    type: 'phc',
    address: 'Khanna, Ludhiana, Punjab 141401',
    district: 'Ludhiana',
    state: 'Punjab',
    phone: '01628-223456',
    coordinates: { lat: 30.7046, lng: 76.2178 },
    services: ['OPD', 'Vaccination', 'ANC', 'Lab', 'Pharmacy'],
    workingHours: '9:00 AM - 4:00 PM',
    ayushmanEmpaneled: true,
  },
];

// =============================================
// AMBULANCE SERVICES
// =============================================

export const AMBULANCE_SERVICES = [
  {
    id: 'amb-001',
    name: '108 Emergency Ambulance',
    phone: '108',
    type: 'emergency',
    coverage: 'All India',
    services: ['Basic Life Support', 'Advanced Life Support', 'Free Service'],
    responseTime: '15-30 minutes',
    available24x7: true,
  },
  {
    id: 'amb-002',
    name: '102 Mother-Child Ambulance',
    phone: '102',
    type: 'maternal',
    coverage: 'All India',
    services: ['Pregnant Women Transport', 'Infant Transport', 'Free Service'],
    available24x7: true,
  },
  {
    id: 'amb-003',
    name: '104 Health Helpline',
    phone: '104',
    type: 'helpline',
    coverage: 'All India',
    services: ['Health Information', 'Medical Advice', 'Facility Location', 'Grievance Registration'],
    available24x7: true,
  },
];

// =============================================
// GOVERNMENT SCHEMES TEST DATA
// =============================================

export const TEST_SCHEMES = [
  {
    id: 'scheme-001',
    code: 'PMJAY',
    name: 'Ayushman Bharat PM-JAY',
    fullName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    category: 'general',
    description: 'World\'s largest health insurance scheme providing ₹5 lakh coverage per family per year for secondary and tertiary hospitalization',
    eligibility: {
      incomeLevel: ['bpl'],
      categories: ['SECC 2011 beneficiaries', 'RSBY beneficiaries'],
      exclusions: ['Government employees', 'Income tax payers'],
    },
    benefits: [
      '₹5 lakh health coverage per family per year',
      'Cashless treatment at 25,000+ empaneled hospitals',
      '1,350+ medical packages covered',
      'No premium or enrollment fee',
      'Pre-existing conditions covered from day 1',
      'No age or family size limit',
    ],
    documents: ['Aadhaar Card', 'Ration Card', 'SECC Letter'],
    howToApply: 'Visit nearest CSC, PHC, or check eligibility at mera.pmjay.gov.in',
    helpline: '14555',
    website: 'https://pmjay.gov.in',
    isActive: true,
  },
  {
    id: 'scheme-002',
    code: 'JSY',
    name: 'Janani Suraksha Yojana',
    fullName: 'Janani Suraksha Yojana (JSY)',
    category: 'maternal',
    description: 'Cash assistance for institutional deliveries to reduce maternal and infant mortality',
    eligibility: {
      pregnant: true,
      incomeLevel: ['bpl', 'apl_lps'],
      ageLimit: '19 years and above',
    },
    benefits: [
      'Rural: ₹1,400 cash assistance for mother',
      'Urban: ₹1,000 cash assistance for mother',
      'ASHA incentive: ₹600 per delivery',
      'Free transport to hospital',
      'Free delivery at government hospital',
    ],
    documents: ['Aadhaar Card', 'MCP Card', 'Bank Account', 'BPL Certificate'],
    howToApply: 'Register with local ASHA worker or ANM during pregnancy',
    isActive: true,
  },
  {
    id: 'scheme-003',
    code: 'PMMVY',
    name: 'PM Matru Vandana Yojana',
    fullName: 'Pradhan Mantri Matru Vandana Yojana',
    category: 'maternal',
    description: 'Maternity benefit of ₹5,000 to pregnant and lactating mothers for first live birth',
    eligibility: {
      pregnant: true,
      firstPregnancy: true,
      ageLimit: '19 years and above',
    },
    benefits: [
      '₹1,000 after early registration of pregnancy (within 150 days)',
      '₹2,000 after at least one ANC (after 180 days)',
      '₹2,000 after child birth registration and first cycle of vaccination',
      'Total: ₹5,000 direct bank transfer',
    ],
    documents: ['Aadhaar Card', 'Bank Account', 'MCP Card', 'Pregnancy Registration'],
    howToApply: 'Register at Anganwadi Center or approved health facility',
    isActive: true,
  },
  {
    id: 'scheme-004',
    code: 'IMI',
    name: 'Mission Indradhanush',
    fullName: 'Intensified Mission Indradhanush',
    category: 'child',
    description: 'Special immunization drive to vaccinate all unvaccinated and partially vaccinated children and pregnant women',
    eligibility: {
      children: true,
      ageLimit: 'Under 2 years',
      pregnant: true,
    },
    benefits: [
      'Free vaccination against 12 diseases',
      'BCG, OPV, Pentavalent, Rotavirus, PCV, IPV, MR vaccines',
      'Door-to-door vaccination in hard-to-reach areas',
      'Mobile vaccination teams',
    ],
    documents: ['Child\'s Birth Certificate', 'Mother\'s ID', 'Immunization Card'],
    howToApply: 'Contact ASHA worker or visit nearest PHC during immunization sessions',
    isActive: true,
  },
  {
    id: 'scheme-005',
    code: 'ICDS',
    name: 'ICDS Anganwadi Services',
    fullName: 'Integrated Child Development Services',
    category: 'child',
    description: 'Comprehensive early childhood care including nutrition, preschool education, and health services',
    eligibility: {
      children: true,
      ageLimit: '0-6 years',
      pregnant: true,
      lactating: true,
    },
    benefits: [
      'Supplementary nutrition for children and mothers',
      'Preschool education for 3-6 year olds',
      'Growth monitoring and health checkups',
      'Immunization support',
      'Nutrition and health education',
      'Take-home ration (THR) for mothers',
    ],
    documents: ['Birth Certificate', 'Aadhaar (optional)', 'Mother\'s ID'],
    howToApply: 'Register at nearest Anganwadi Center',
    isActive: true,
  },
  {
    id: 'scheme-006',
    code: 'RBSK',
    name: 'Rashtriya Bal Swasthya Karyakram',
    fullName: 'Rashtriya Bal Swasthya Karyakram (RBSK)',
    category: 'child',
    description: 'Child health screening and early intervention services for 4 D\'s - Defects, Deficiencies, Diseases, Development delays',
    eligibility: {
      children: true,
      ageLimit: '0-18 years',
    },
    benefits: [
      'Free health screening at schools and Anganwadis',
      'Early detection of 30 health conditions',
      'Free treatment at District Early Intervention Centers',
      'Referral to higher facilities for complex cases',
      'Follow-up care',
    ],
    howToApply: 'Automatic screening by Mobile Health Teams at schools/Anganwadis',
    isActive: true,
  },
  {
    id: 'scheme-007',
    code: 'JSSK',
    name: 'Janani Shishu Suraksha Karyakram',
    fullName: 'Janani Shishu Suraksha Karyakram (JSSK)',
    category: 'maternal',
    description: 'Free delivery and treatment services for pregnant women and sick newborns up to 30 days',
    eligibility: {
      pregnant: true,
      newborn: true,
    },
    benefits: [
      'Free normal and C-section delivery',
      'Free medicines and consumables',
      'Free diagnostics',
      'Free diet during hospital stay',
      'Free transport (home to facility and back)',
      'Free blood transfusion if needed',
      'Free treatment for sick newborns up to 30 days',
    ],
    howToApply: 'Available at all government health facilities',
    isActive: true,
  },
];

// =============================================
// VACCINATION SCHEDULE
// =============================================

export const VACCINATION_SCHEDULE = [
  {
    age: 'At Birth',
    vaccines: [
      { name: 'BCG', disease: 'Tuberculosis', route: 'Intradermal' },
      { name: 'OPV-0', disease: 'Polio', route: 'Oral' },
      { name: 'Hepatitis B - Birth dose', disease: 'Hepatitis B', route: 'IM' },
    ],
  },
  {
    age: '6 Weeks',
    vaccines: [
      { name: 'OPV-1', disease: 'Polio', route: 'Oral' },
      { name: 'Pentavalent-1', disease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib', route: 'IM' },
      { name: 'Rotavirus-1', disease: 'Rotavirus diarrhea', route: 'Oral' },
      { name: 'fIPV-1', disease: 'Polio', route: 'IM' },
      { name: 'PCV-1', disease: 'Pneumococcal disease', route: 'IM' },
    ],
  },
  {
    age: '10 Weeks',
    vaccines: [
      { name: 'OPV-2', disease: 'Polio', route: 'Oral' },
      { name: 'Pentavalent-2', disease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib', route: 'IM' },
      { name: 'Rotavirus-2', disease: 'Rotavirus diarrhea', route: 'Oral' },
    ],
  },
  {
    age: '14 Weeks',
    vaccines: [
      { name: 'OPV-3', disease: 'Polio', route: 'Oral' },
      { name: 'Pentavalent-3', disease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib', route: 'IM' },
      { name: 'Rotavirus-3', disease: 'Rotavirus diarrhea', route: 'Oral' },
      { name: 'fIPV-2', disease: 'Polio', route: 'IM' },
      { name: 'PCV-2', disease: 'Pneumococcal disease', route: 'IM' },
    ],
  },
  {
    age: '9 Months',
    vaccines: [
      { name: 'MR-1', disease: 'Measles, Rubella', route: 'SC' },
      { name: 'JE-1', disease: 'Japanese Encephalitis (endemic areas)', route: 'SC' },
      { name: 'PCV Booster', disease: 'Pneumococcal disease', route: 'IM' },
    ],
  },
  {
    age: '16-24 Months',
    vaccines: [
      { name: 'MR-2', disease: 'Measles, Rubella', route: 'SC' },
      { name: 'JE-2', disease: 'Japanese Encephalitis (endemic areas)', route: 'SC' },
      { name: 'DPT Booster-1', disease: 'Diphtheria, Pertussis, Tetanus', route: 'IM' },
      { name: 'OPV Booster', disease: 'Polio', route: 'Oral' },
    ],
  },
  {
    age: '5-6 Years',
    vaccines: [
      { name: 'DPT Booster-2', disease: 'Diphtheria, Pertussis, Tetanus', route: 'IM' },
    ],
  },
  {
    age: '10 Years',
    vaccines: [
      { name: 'TT', disease: 'Tetanus', route: 'IM' },
    ],
  },
  {
    age: '16 Years',
    vaccines: [
      { name: 'TT', disease: 'Tetanus', route: 'IM' },
    ],
  },
];

// =============================================
// SEASONAL HEALTH ALERTS
// =============================================

export const SEASONAL_ALERTS = [
  {
    id: 'alert-001',
    season: 'monsoon',
    months: [6, 7, 8, 9],
    alerts: [
      {
        type: 'dengue',
        severity: 'high',
        title: 'Dengue Alert',
        description: 'Peak dengue transmission season. Aedes mosquitoes breed in clean stagnant water.',
        symptoms: ['High fever', 'Severe headache', 'Pain behind eyes', 'Joint/muscle pain', 'Rash', 'Bleeding'],
        precautions: [
          'Remove stagnant water from coolers, pots, tyres',
          'Use mosquito nets and repellents',
          'Wear full-sleeve clothes',
          'Use screens on windows/doors',
          'Seek immediate care for high fever with body ache',
        ],
        whenToSeekHelp: 'Fever with severe body ache, bleeding, or vomiting',
      },
      {
        type: 'malaria',
        severity: 'high',
        title: 'Malaria Alert',
        description: 'Malaria transmission increases during monsoon. Anopheles mosquitoes bite at night.',
        symptoms: ['Fever with chills', 'Sweating', 'Headache', 'Nausea', 'Body ache'],
        precautions: [
          'Sleep under insecticide-treated bed nets',
          'Use mosquito repellents',
          'Wear protective clothing after sunset',
          'Get fever tested for malaria',
        ],
      },
      {
        type: 'waterborne',
        severity: 'high',
        title: 'Waterborne Disease Alert',
        description: 'Risk of Cholera, Typhoid, Hepatitis A, and diarrheal diseases.',
        precautions: [
          'Drink only boiled or purified water',
          'Avoid street food and raw vegetables',
          'Wash hands before eating',
          'Use ORS for diarrhea',
        ],
      },
    ],
  },
  {
    id: 'alert-002',
    season: 'summer',
    months: [3, 4, 5, 6],
    alerts: [
      {
        type: 'heatwave',
        severity: 'high',
        title: 'Heat Wave Alert',
        description: 'Extreme temperatures can cause heat stroke and dehydration.',
        symptoms: ['High body temperature', 'Confusion', 'No sweating', 'Rapid pulse', 'Headache'],
        precautions: [
          'Stay indoors during 11 AM - 4 PM',
          'Drink plenty of water and ORS',
          'Wear light, loose cotton clothes',
          'Use wet cloth on head and body',
          'Never leave children/elderly in parked vehicles',
        ],
        whenToSeekHelp: 'Body temperature above 104°F, confusion, or no sweating',
      },
      {
        type: 'foodborne',
        severity: 'medium',
        title: 'Food Safety Alert',
        description: 'Food spoilage faster in summer. Risk of food poisoning.',
        precautions: [
          'Refrigerate perishable foods',
          'Avoid eating stale food',
          'Wash fruits and vegetables',
          'Avoid raw/undercooked food',
        ],
      },
    ],
  },
  {
    id: 'alert-003',
    season: 'winter',
    months: [11, 12, 1, 2],
    alerts: [
      {
        type: 'respiratory',
        severity: 'medium',
        title: 'Flu & Cold Season',
        description: 'Increased respiratory infections, especially in children and elderly.',
        precautions: [
          'Get flu vaccination if available',
          'Wash hands frequently',
          'Cover mouth while coughing/sneezing',
          'Avoid crowded places if sick',
          'Keep warm, especially at night',
        ],
      },
      {
        type: 'coldwave',
        severity: 'medium',
        title: 'Cold Wave Advisory',
        description: 'Extreme cold can cause hypothermia, especially in homeless and elderly.',
        precautions: [
          'Wear multiple layers of warm clothing',
          'Use room heaters safely',
          'Avoid alcohol (increases heat loss)',
          'Check on elderly neighbors',
        ],
      },
    ],
  },
  {
    id: 'alert-004',
    season: 'post-monsoon',
    months: [10, 11],
    alerts: [
      {
        type: 'airQuality',
        severity: 'high',
        title: 'Air Quality Alert',
        description: 'Poor air quality due to stubble burning and reduced wind.',
        symptoms: ['Coughing', 'Difficulty breathing', 'Eye irritation', 'Throat irritation'],
        precautions: [
          'Wear N95 mask outdoors',
          'Avoid morning outdoor exercise',
          'Keep windows closed during high pollution',
          'Use air purifier if available',
          'Stay hydrated',
        ],
        riskGroups: ['Asthma patients', 'Children', 'Elderly', 'Heart patients'],
      },
    ],
  },
];

// =============================================
// TEST USER PROFILES
// =============================================

export const TEST_USER_PROFILES = [
  {
    id: 'user-001',
    name: 'Priya Sharma',
    phone: '9876543210',
    role: 'citizen',
    language: 'hi',
    region: 'Maharashtra',
    district: 'Pune',
    village: 'Hadapsar',
    isPregnant: true,
    pregnancyWeek: 24,
    lmpDate: '2025-06-15',
    expectedDeliveryDate: '2026-03-22',
    hasChildren: false,
    incomeLevel: 'bpl',
    eligibleSchemes: ['PMJAY', 'JSY', 'PMMVY', 'JSSK'],
  },
  {
    id: 'user-002',
    name: 'Anita Patil',
    phone: '9876543211',
    role: 'citizen',
    language: 'mr',
    region: 'Maharashtra',
    district: 'Pune',
    village: 'Kothrud',
    isPregnant: false,
    hasChildren: true,
    children: [
      { name: 'Rohan', age: 2, gender: 'male', lastVaccine: 'MR-1', nextVaccine: 'DPT Booster-1' },
      { name: 'Sneha', age: 5, gender: 'female', lastVaccine: 'DPT Booster-1', nextVaccine: 'DPT Booster-2' },
    ],
    incomeLevel: 'apl',
    eligibleSchemes: ['ICDS', 'IMI', 'RBSK'],
  },
  {
    id: 'user-003',
    name: 'Sunita Jadhav',
    phone: '9876543212',
    role: 'asha',
    language: 'mr',
    region: 'Maharashtra',
    district: 'Pune',
    village: 'Hadapsar',
    ashaId: 'ASHA-MH-PUNE-001',
    coverageArea: 'Hadapsar Ward 1-3',
    activeHouseholds: 250,
    pregnantWomen: 12,
    childrenUnder5: 45,
    pendingVisits: 8,
  },
  {
    id: 'user-004',
    name: 'Dr. Rajesh Kumar',
    phone: '9876543213',
    role: 'officer',
    language: 'en',
    region: 'Maharashtra',
    district: 'Pune',
    designation: 'Block Medical Officer',
    facility: 'Aundh CHC',
    supervisedPHCs: 5,
    supervisedASHAs: 45,
  },
  {
    id: 'user-005',
    name: 'Gurpreet Kaur',
    phone: '9876543214',
    role: 'citizen',
    language: 'pa',
    region: 'Punjab',
    district: 'Ludhiana',
    village: 'Khanna',
    isPregnant: true,
    pregnancyWeek: 32,
    hasChildren: true,
    children: [
      { name: 'Arjun', age: 4, gender: 'male' },
    ],
    incomeLevel: 'bpl',
    eligibleSchemes: ['PMJAY', 'JSY', 'PMMVY', 'JSSK', 'ICDS'],
  },
];

// =============================================
// SAMPLE APPOINTMENTS
// =============================================

export const TEST_APPOINTMENTS = [
  {
    id: 'apt-001',
    userId: 'user-001',
    facilityId: 'fac-002',
    facilityName: 'Yerawada PHC',
    appointmentType: 'anc',
    date: '2025-12-05',
    timeSlot: 'morning',
    status: 'confirmed',
    notes: 'Third ANC visit',
  },
  {
    id: 'apt-002',
    userId: 'user-002',
    facilityId: 'fac-002',
    facilityName: 'Yerawada PHC',
    appointmentType: 'vaccination',
    date: '2025-12-10',
    timeSlot: 'morning',
    status: 'confirmed',
    notes: 'DPT Booster for Rohan',
  },
];

// =============================================
// SAMPLE REMINDERS
// =============================================

export const TEST_REMINDERS = [
  {
    id: 'rem-001',
    userId: 'user-001',
    type: 'ancVisit',
    title: 'ANC Checkup Due',
    description: 'Your 24-week ANC checkup is due. Visit PHC for ultrasound and blood tests.',
    scheduledDate: '2025-12-05',
    scheduledTime: '09:00',
    recurring: 'none',
    status: 'scheduled',
  },
  {
    id: 'rem-002',
    userId: 'user-001',
    type: 'medication',
    title: 'Iron + Folic Acid',
    description: 'Take your daily IFA tablet after meals.',
    scheduledDate: '2025-11-30',
    scheduledTime: '14:00',
    recurring: 'daily',
    status: 'scheduled',
  },
  {
    id: 'rem-003',
    userId: 'user-002',
    type: 'vaccination',
    title: 'Rohan\'s Vaccination Due',
    description: 'DPT Booster-1 and OPV Booster due for Rohan (age 2 years)',
    scheduledDate: '2025-12-10',
    scheduledTime: '09:00',
    recurring: 'none',
    status: 'scheduled',
  },
];

// =============================================
// EXPORT FUNCTION TO GET ALL TEST DATA
// =============================================

export function getAllTestData() {
  return {
    facilities: TEST_FACILITIES,
    ambulances: AMBULANCE_SERVICES,
    schemes: TEST_SCHEMES,
    vaccinationSchedule: VACCINATION_SCHEDULE,
    seasonalAlerts: SEASONAL_ALERTS,
    userProfiles: TEST_USER_PROFILES,
    appointments: TEST_APPOINTMENTS,
    reminders: TEST_REMINDERS,
  };
}

// Log summary
console.log('📊 Test Data Summary:');
console.log(`  - Facilities: ${TEST_FACILITIES.length}`);
console.log(`  - Ambulance Services: ${AMBULANCE_SERVICES.length}`);
console.log(`  - Government Schemes: ${TEST_SCHEMES.length}`);
console.log(`  - Vaccination Schedule: ${VACCINATION_SCHEDULE.length} age groups`);
console.log(`  - Seasonal Alerts: ${SEASONAL_ALERTS.length} seasons`);
console.log(`  - Test Users: ${TEST_USER_PROFILES.length}`);
console.log(`  - Sample Appointments: ${TEST_APPOINTMENTS.length}`);
console.log(`  - Sample Reminders: ${TEST_REMINDERS.length}`);
