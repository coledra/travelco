import { EmergencyContact } from '../types/travel';

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'sos-112',
    service: 'National Emergency Response (Police / Fire / Ambulance)',
    number: '112',
    availableHours: '24x7 (Toll-free nationwide)',
    description: 'Unified emergency response support system (ERSS) operating in all Indian States and Union Territories with GPS locator dispatch.',
    tollFree: true,
    priority: 'Immediate SOS',
  },
  {
    id: 'sos-1363',
    service: 'Incredible India Tourist Police Helpline',
    number: '1363',
    availableHours: '24x7 (12 International & Indian Languages)',
    description: 'Dedicated Ministry of Tourism multi-lingual emergency helpline providing foreign and domestic tourists instant safety, direction, and dispute assistance.',
    tollFree: true,
    priority: 'Helpline',
  },
  {
    id: 'sos-1091',
    service: 'National Women Safety Helpline',
    number: '1091',
    availableHours: '24x7 (Toll-free)',
    description: 'Immediate police response and protective intervention for women travelers experiencing distress or harassment.',
    tollFree: true,
    priority: 'Immediate SOS',
  },
  {
    id: 'sos-139',
    service: 'Indian Railways Security & Rail Madad',
    number: '139',
    availableHours: '24x7 On-Board & Stations',
    description: 'Direct alert to Railway Protection Force (RPF) and station superintendents for medical emergency, theft, or security on trains.',
    tollFree: true,
    priority: 'Transport & Police',
  },
  {
    id: 'sos-108',
    service: 'Ambulance & Emergency Medical Response',
    number: '108',
    availableHours: '24x7',
    description: 'Paramedic ambulance dispatch for accidents, severe sickness, and acute medical situations.',
    tollFree: true,
    priority: 'Immediate SOS',
  },
];

export interface HindiEmergencyPhrase {
  id: string;
  english: string;
  devanagari: string;
  phonetic: string;
  situation: string;
}

export const HINDI_EMERGENCY_PHRASES: HindiEmergencyPhrase[] = [
  {
    id: 'p1',
    english: 'Please help me! This is an emergency.',
    devanagari: 'कृपया मेरी सहायता करें! यह आपातकालीन स्थिति है।',
    phonetic: 'Kripya meri sahayata karein! Yeh aapaatkaleen sthiti hai.',
    situation: 'Critical SOS / Immediate Attention',
  },
  {
    id: 'p2',
    english: 'Where is the nearest hospital or clinic?',
    devanagari: 'सबसे करीबी अस्पताल या क्लिनिक कहाँ है?',
    phonetic: 'Sabse kareebi aspatal ya clinic kahan hai?',
    situation: 'Medical Need',
  },
  {
    id: 'p3',
    english: 'I need a doctor immediately.',
    devanagari: 'मुझे तुरंत डॉक्टर की ज़रूरत है।',
    phonetic: 'Mujhe turant doctor ki zaroorat hai.',
    situation: 'Health & Illness',
  },
  {
    id: 'p4',
    english: 'Please call the police right now.',
    devanagari: 'कृपया अभी पुलिस को बुलाएं।',
    phonetic: 'Kripya abhi police ko bulaayein.',
    situation: 'Theft / Harassment / Safety',
  },
  {
    id: 'p5',
    english: 'I have lost my passport and wallet.',
    devanagari: 'मेरा पासपोर्ट और बटुआ खो गया है।',
    phonetic: 'Mera passport aur batua kho gaya hai.',
    situation: 'Lost Documents',
  },
  {
    id: 'p6',
    english: 'I am allergic to this ingredient / food.',
    devanagari: 'मुझे इस भोजन से एलर्जी है।',
    phonetic: 'Mujhe iss bhojan se allergy hai.',
    situation: 'Food Safety',
  },
];

export interface HospitalDirectoryEntry {
  city: string;
  name: string;
  address: string;
  phone: string;
  emergencyUnit: string;
}

export const TOURIST_HOSPITALS_DIRECTORY: HospitalDirectoryEntry[] = [
  {
    city: 'New Delhi',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    phone: '+91-11-26588500',
    emergencyUnit: '24x7 Apex Trauma & Casualty',
  },
  {
    city: 'Agra',
    name: 'S.N. Medical College & Hospital',
    address: 'Hospital Road, Motilal Nehru Nagar, Agra 282002',
    phone: '+91-562-2260353',
    emergencyUnit: '24x7 Emergency Wing (15 min from Taj Mahal)',
  },
  {
    city: 'Jaipur',
    name: 'Sawai Man Singh (SMS) Hospital',
    address: 'JLN Marg, Ashok Nagar, Jaipur 302004',
    phone: '+91-141-2560291',
    emergencyUnit: '24x7 Trauma & Emergency Center',
  },
  {
    city: 'Varanasi',
    name: 'Sir Sunderlal Hospital (BHU)',
    address: 'Banaras Hindu University Campus, Varanasi 221005',
    phone: '+91-542-2369299',
    emergencyUnit: '24x7 Superspeciality Emergency',
  },
  {
    city: 'Leh (Ladakh)',
    name: 'SNM Hospital (Sonam Norbu Memorial)',
    address: 'Hospital Road, Skalzangling, Leh 194101',
    phone: '+91-1982-252014',
    emergencyUnit: '24x7 High-Altitude Sickness & Hyperbaric Chamber',
  },
  {
    city: 'Kochi (Kerala)',
    name: 'Amrita Institute of Medical Sciences',
    address: 'AIMS Ponekkara, Kochi 682041',
    phone: '+91-484-2851234',
    emergencyUnit: '24x7 Comprehensive Emergency & Critical Care',
  },
];
