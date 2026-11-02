import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Settings,
  Volume2,
  Navigation,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { CalculationMethod, JuristicSchool, LocationCoordinates, PrayerTimeData } from '../../types';
import { POPULAR_CITIES } from '../../utils/prayerCalculations';
import { audioAlertSystem } from '../../utils/audioAlerts';

interface PrayerTimesCardProps {
  coords: LocationCoordinates;
  setCoords: (coords: LocationCoordinates) => void;
  method: CalculationMethod;
  setMethod: (method: CalculationMethod) => void;
  juristic: JuristicSchool;
  setJuristic: (juristic: JuristicSchool) => void;
  prayerTimes: PrayerTimeData;
  nextPrayerName: string;
  timeToNextPrayer: string;
  progressPercent: number;
}

export const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({
  coords,
  setCoords,
  method,
  setMethod,
  juristic,
  setJuristic,
  prayerTimes,
  nextPrayerName,
  timeToNextPrayer,
  progressPercent,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleCitySelect = (cityName: string) => {
    const selected = POPULAR_CITIES.find((c) => c.city === cityName);
    if (selected) {
      setCoords(selected);
    }
  };

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          city: 'Current Location',
          country: 'GPS Detected',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(err.message || 'Unable to retrieve location.');
        setGeoLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const prayersList = [
    { name: 'Fajr', arabic: 'الفَجْر', time: prayerTimes.fajr, isNext: nextPrayerName === 'Fajr' },
    { name: 'Sunrise', arabic: 'الشُّرُوق', time: prayerTimes.sunrise, isNext: false, isShuruq: true },
    { name: 'Dhuhr', arabic: 'الظُّهْر', time: prayerTimes.dhuhr, isNext: nextPrayerName === 'Dhuhr' },
    { name: 'Asr', arabic: 'العَصْر', time: prayerTimes.asr, isNext: nextPrayerName === 'Asr' },
    { name: 'Maghrib', arabic: 'المَغْرِب', time: prayerTimes.maghrib, isNext: nextPrayerName === 'Maghrib' },
    { name: 'Isha', arabic: 'العِشَاء', time: prayerTimes.isha, isNext: nextPrayerName === 'Isha' },
  ];

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header: Location & Next Prayer Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <h3 className="font-semibold text-stone-100 text-base sm:text-lg">
              {coords.city}, {coords.country}
            </h3>
            <span className="text-[11px] text-stone-400">
              ({coords.latitude.toFixed(2)}°, {coords.longitude.toFixed(2)}°)
            </span>
          </div>

          <p className="text-xs text-stone-400">
            Calculated via {method} Method • Asr: {juristic}
          </p>
        </div>

        {/* Location selector buttons */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={POPULAR_CITIES.some((c) => c.city === coords.city) ? coords.city : ''}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="appearance-none rounded-lg border border-stone-700 bg-stone-950 px-3 py-1.5 pr-8 text-xs text-stone-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>
                Select City...
              </option>
              {POPULAR_CITIES.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}, {c.country}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
          </div>

          <button
            onClick={handleAutoLocate}
            disabled={geoLoading}
            title="Auto-detect current GPS location"
            className="flex items-center gap-1.5 rounded-lg border border-emerald-800/80 bg-emerald-950/60 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-900/80 transition-colors cursor-pointer"
          >
            <Navigation className={`h-3.5 w-3.5 ${geoLoading ? 'animate-spin' : ''}`} />
            <span>{geoLoading ? 'Detecting...' : 'GPS'}</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Prayer calculation settings"
            className="rounded-lg border border-stone-700 bg-stone-800 p-1.5 text-stone-300 hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {geoError && (
        <p className="text-xs text-amber-400 bg-amber-950/30 border border-amber-900/50 p-2 rounded-lg">
          {geoError} (Using preset location instead)
        </p>
      )}

      {/* Settings Drawer (expandable) */}
      {showSettings && (
        <div className="rounded-xl border border-stone-700/80 bg-stone-950 p-4 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Astronomical Calculation Settings
            </span>
            <button
              onClick={() => audioAlertSystem.playAdhanChime()}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>Test Melodic Adhan Chime</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-stone-400 mb-1">Convention / Authority</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as CalculationMethod)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 p-2 text-stone-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="MWL">Muslim World League (Fajr 18°, Isha 17°)</option>
                <option value="ISNA">ISNA North America (Fajr 15°, Isha 15°)</option>
                <option value="Makkah">Umm Al-Qura, Makkah (Fajr 18.5°, Isha +90m)</option>
                <option value="Egypt">Egyptian General Authority (Fajr 19.5°, Isha 17.5°)</option>
                <option value="Karachi">Univ. of Islamic Sciences Karachi (Fajr 18°, Isha 18°)</option>
                <option value="Tehran">Institute of Geophysics Tehran (Fajr 17.7°, Isha 14°)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Asr Juristic Shadow Method</label>
              <select
                value={juristic}
                onChange={(e) => setJuristic(e.target.value as JuristicSchool)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 p-2 text-stone-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Standard">Standard / Shafi'i, Maliki, Hanbali (1x Shadow)</option>
                <option value="Hanafi">Hanafi School (2x Shadow)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Next Prayer Countdown Banner */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-800/60 bg-gradient-to-r from-emerald-950/80 via-stone-900 to-stone-950 p-4 sm:p-5 islamic-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Clock className="h-3.5 w-3.5" />
              <span>UPCOMING PRAYER</span>
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-classical text-2xl sm:text-3xl font-bold text-amber-200">
                {nextPrayerName}
              </span>
              <span className="font-arabic text-xl text-emerald-400">
                {prayersList.find((p) => p.name === nextPrayerName)?.arabic}
              </span>
            </div>
          </div>

          <div className="text-right sm:text-right">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-stone-100">
              {timeToNextPrayer}
            </div>
            <p className="text-xs text-stone-400">time remaining</p>
          </div>
        </div>

        {/* Progress Bar towards next prayer */}
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of All 6 Daily Times */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {prayersList.map((prayer) => (
          <div
            key={prayer.name}
            className={`relative flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${
              prayer.isNext
                ? 'border-emerald-500 bg-emerald-950/50 shadow-lg shadow-emerald-950/50 scale-[1.02]'
                : prayer.isShuruq
                ? 'border-stone-800 bg-stone-900/30 opacity-75'
                : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
            }`}
          >
            {prayer.isNext && (
              <span className="absolute -top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                Next
              </span>
            )}
            <span className="font-arabic text-xs text-stone-400 mb-0.5">{prayer.arabic}</span>
            <span className="text-xs font-semibold text-stone-300">{prayer.name}</span>
            <span className="font-mono text-base font-bold text-amber-200 mt-1">{prayer.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
