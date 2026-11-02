import { CalculationMethod, JuristicSchool, LocationCoordinates, PrayerTimeData, QiblaInfo } from '../types';

export const POPULAR_CITIES: LocationCoordinates[] = [
  { city: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },
  { city: 'Madinah', country: 'Saudi Arabia', latitude: 24.4672, longitude: 39.6111 },
  { city: 'Jerusalem', country: 'Palestine', latitude: 31.7683, longitude: 35.2137 },
  { city: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784 },
  { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { city: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
  { city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
  { city: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869 },
  { city: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
  { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { city: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
  { city: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011 },
  { city: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310 },
  { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { city: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
];

// Kaaba Coordinates in Makkah al-Mukarramah
export const KAABA_LAT = 21.422487;
export const KAABA_LNG = 39.826206;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDegrees(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function fixAngle(a: number): number {
  a = a - 360.0 * Math.floor(a / 360.0);
  return a < 0 ? a + 360.0 : a;
}

function fixHour(a: number): number {
  a = a - 24.0 * Math.floor(a / 24.0);
  return a < 0 ? a + 24.0 : a;
}

// Calculate Julian Date
function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Sun position: Declination and Equation of Time
function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g)));

  const e = 23.439 - 0.00000036 * D;
  const d = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));
  let ra = toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L)))) / 15.0;
  ra = fixHour(ra);
  const eqt = q / 15.0 - ra;

  return { declination: d, equationOfTime: eqt };
}

// Compute hour angle for a given solar altitude
function hourAngle(altitude: number, lat: number, dec: number): number {
  const latRad = toRadians(lat);
  const decRad = toRadians(dec);
  const altRad = toRadians(altitude);
  const cosHA = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));

  if (cosHA > 1) return 0; // Sun never reaches this altitude (midnight sun/polar)
  if (cosHA < -1) return 180; // Sun never dips below this altitude
  return toDegrees(Math.acos(cosHA));
}

// Format fractional hours into HH:MM (e.g. 14.75 -> "14:45")
function formatHour(h: number): string {
  if (isNaN(h)) return '--:--';
  const totalMinutes = Math.round(h * 60);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Convert hour float to Date object for today
function hourToDate(h: number, baseDate: Date): Date {
  const d = new Date(baseDate);
  const totalMinutes = Math.round(h * 60);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function calculatePrayerTimes(
  coords: LocationCoordinates,
  date: Date = new Date(),
  method: CalculationMethod = 'MWL',
  juristic: JuristicSchool = 'Standard'
): PrayerTimeData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const timezone = -date.getTimezoneOffset() / 60; // Local timezone offset in hours

  const jd = julianDate(year, month, day);
  const { declination, equationOfTime } = sunPosition(jd);

  // Solar noon (Dhuhr)
  const dhuhrTime = fixHour(12 + timezone - coords.longitude / 15 - equationOfTime);

  // Fajr and Isha angle parameters
  let fajrAngle = 18;
  let ishaAngle = 17;
  let ishaInterval = 0; // minutes after Maghrib (for Umm al-Qura)

  switch (method) {
    case 'ISNA':
      fajrAngle = 15;
      ishaAngle = 15;
      break;
    case 'Makkah':
      fajrAngle = 18.5;
      ishaInterval = 90; // 90 min after maghrib (120 min during Ramadan)
      break;
    case 'Egypt':
      fajrAngle = 19.5;
      ishaAngle = 17.5;
      break;
    case 'Karachi':
      fajrAngle = 18;
      ishaAngle = 18;
      break;
    case 'Tehran':
      fajrAngle = 17.7;
      ishaAngle = 14;
      break;
    case 'MWL':
    default:
      fajrAngle = 18;
      ishaAngle = 17;
      break;
  }

  // Sunrise and Sunset (altitude -0.833° for atmospheric refraction)
  const sunRiseSetAngle = -0.833;
  const sunRiseSetHA = hourAngle(sunRiseSetAngle, coords.latitude, declination) / 15.0;
  const sunriseTime = fixHour(dhuhrTime - sunRiseSetHA);
  const sunsetTime = fixHour(dhuhrTime + sunRiseSetHA);

  // Fajr
  const fajrHA = hourAngle(-fajrAngle, coords.latitude, declination) / 15.0;
  const fajrTime = fixHour(dhuhrTime - fajrHA);

  // Asr
  const shadowMultiplier = juristic === 'Hanafi' ? 2 : 1;
  const asrAltRad = Math.atan(1 / (shadowMultiplier + Math.tan(toRadians(Math.abs(coords.latitude - declination)))));
  const asrAltDeg = toDegrees(asrAltRad);
  const asrHA = hourAngle(asrAltDeg, coords.latitude, declination) / 15.0;
  const asrTime = fixHour(dhuhrTime + asrHA);

  // Maghrib is identical to sunset time
  const maghribTime = sunsetTime;

  // Isha
  let ishaTime: number;
  if (ishaInterval > 0) {
    ishaTime = fixHour(maghribTime + ishaInterval / 60.0);
  } else {
    const ishaHA = hourAngle(-ishaAngle, coords.latitude, declination) / 15.0;
    ishaTime = fixHour(dhuhrTime + ishaHA);
  }

  return {
    fajr: formatHour(fajrTime),
    sunrise: formatHour(sunriseTime),
    dhuhr: formatHour(dhuhrTime),
    asr: formatHour(asrTime),
    maghrib: formatHour(maghribTime),
    isha: formatHour(ishaTime),
    rawDates: {
      fajr: hourToDate(fajrTime, date),
      sunrise: hourToDate(sunriseTime, date),
      dhuhr: hourToDate(dhuhrTime, date),
      asr: hourToDate(asrTime, date),
      maghrib: hourToDate(maghribTime, date),
      isha: hourToDate(ishaTime, date),
    },
  };
}

// Calculate Qibla Azimuth & Distance to Kaaba
export function calculateQibla(coords: LocationCoordinates): QiblaInfo {
  const phiK = toRadians(KAABA_LAT);
  const lambdaK = toRadians(KAABA_LNG);
  const phi = toRadians(coords.latitude);
  const lambda = toRadians(coords.longitude);

  const deltaLambda = lambdaK - lambda;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);

  let qiblaBearing = toDegrees(Math.atan2(y, x));
  qiblaBearing = (qiblaBearing + 360) % 360;

  // Haversine Distance (earth radius = 6371 km)
  const R = 6371;
  const dLat = phiK - phi;
  const dLon = lambdaK - lambda;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi) * Math.cos(phiK) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  // Compass cardinal notation (e.g. N, NNE, ESE, etc.)
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(qiblaBearing / 22.5) % 16;
  const compassDirection = cardinals[index];

  return {
    bearing: Math.round(qiblaBearing * 10) / 10,
    distanceKm,
    compassDirection,
  };
}

// Approximate Hijri Date
export function getHijriDate(date: Date = new Date()): { day: number; monthName: string; monthArabic: string; year: number } {
  // Use Intl.DateTimeFormat with islamic-umalqura calendar if supported in browser
  try {
    const formatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    const day = parseInt(parts.find((p) => p.type === 'day')?.value || '1', 10);
    const monthName = parts.find((p) => p.type === 'month')?.value || 'Muharram';
    const year = parseInt(parts.find((p) => p.type === 'year')?.value || '1448', 10);

    const arabicMonths: Record<string, string> = {
      Muharram: 'مُحَرَّم',
      Safar: 'صَفَر',
      "Rabiʻ I": 'رَبِيع الأَوَّل',
      "Rabi' I": 'رَبِيع الأَوَّل',
      "Rabi' al-Awwal": 'رَبِيع الأَوَّل',
      "Rabiʻ II": 'رَبِيع الآخِر',
      "Rabi' II": 'رَبِيع الآخِر',
      "Rabi' al-Thani": 'رَبِيع الآخِر',
      "Jumada I": 'جُمَادَى الأُولَى',
      "Jumada al-Awwal": 'جُمَادَى الأُولَى',
      "Jumada II": 'جُمَادَى الآخِرَة',
      "Jumada al-Thani": 'جُمَادَى الآخِرَة',
      Rajab: 'رَجَب',
      "Shaʻban": 'شَعْبَان',
      "Sha'ban": 'شَعْبَان',
      Ramadan: 'رَمَضَان',
      Shawwal: 'شَوَّال',
      "Dhuʻl-Qiʻdah": 'ذُو القَعْدَة',
      "Dhu al-Qi'dah": 'ذُو القَعْدَة',
      "Dhuʻl-Hijjah": 'ذُو الحِجَّة',
      "Dhu al-Hijjah": 'ذُو الحِجَّة',
    };

    return {
      day,
      monthName,
      monthArabic: arabicMonths[monthName] || 'الشَّهْر الحَرَام',
      year,
    };
  } catch (_e) {
    // Fallback estimation
    return {
      day: 14,
      monthName: 'Shaʻban',
      monthArabic: 'شَعْبَان',
      year: 1448,
    };
  }
}
