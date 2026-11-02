export type CalculationMethod =
  | 'MWL' // Muslim World League (18°, 17°)
  | 'ISNA' // Islamic Society of North America (15°, 15°)
  | 'Makkah' // Umm al-Qura University, Makkah (18.5°, +90min)
  | 'Egypt' // Egyptian General Authority of Survey (19.5°, 17.5°)
  | 'Karachi' // University of Islamic Sciences, Karachi (18°, 18°)
  | 'Tehran'; // Institute of Geophysics, University of Tehran

export type JuristicSchool = 'Standard' | 'Hanafi'; // Asr shadow multiplier: 1x (Shafi/Maliki/Hanbali) vs 2x (Hanafi)

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  rawDates: {
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
  };
}

export interface LocationCoordinates {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezoneOffset?: number; // hours from UTC
}

export interface QiblaInfo {
  bearing: number; // degrees from North (0 - 360)
  distanceKm: number;
  compassDirection: string;
}

export interface PrimarySourceCitation {
  type: 'Qur\'an' | 'Hadith';
  citation: string;
  arabic?: string;
  translation: string;
  contextAndTafsir?: string;
}

export interface MaqasidImpact {
  objective: string;
  analysis: string;
}

export interface LegalMaxim {
  maxim: string;
  application: string;
}

export interface ScholarInsight {
  scholar: string;
  era: string;
  insight: string;
}

export interface EpistemicClassification {
  level: string;
  rationale: string;
}

export interface ScholarlySynthesisResult {
  title: string;
  summary: string;
  epistemicClassification?: EpistemicClassification;
  primarySources: PrimarySourceCitation[];
  scholarlyFrameworks: {
    maqasidImpact: MaqasidImpact[];
    usulMaximsApplied: LegalMaxim[];
    classicalScholarsViews: ScholarInsight[];
  };
  modernSynthesisAndContemporaryFiqh: string;
  actionableGuidance: string[];
}

export type SectorField =
  | 'All Sectors'
  | 'Geopolitics & World Order'
  | 'Economy & Islamic Finance'
  | 'Artificial Intelligence & Deep Tech'
  | 'Medicine & Bioethics'
  | 'Environment & Ecological Stewardship'
  | 'Society, Family & Education'
  | 'Philosophy & Epistemology';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ClassicalText {
  id: string;
  title: string;
  arabicTitle: string;
  author: string;
  authorEra: string;
  category: 'Quran' | 'Hadith' | 'Fiqh & Usul' | 'Maqasid & Philosophy' | 'Tazkiyah & Ethics' | 'Theology';
  description: string;
  passages: {
    id: string;
    label: string;
    arabic: string;
    transliteration?: string;
    translation: string;
    scholarlyCommentary: string;
    themes: string[];
  }[];
}

export interface DailyTask {
  id: string;
  name: string;
  arabicName: string;
  category: 'Fard' | 'Sunnah' | 'Adhkar' | 'Quran' | 'Charity';
  completed: boolean;
  timeEstimate?: string;
  rewardNote?: string;
}

export interface DhikrItem {
  id: string;
  phraseArabic: string;
  transliteration: string;
  translation: string;
  targetCount: number;
  virtue: string;
  currentCount: number;
}
