import React from 'react';
import { CalculationMethod, JuristicSchool, LocationCoordinates, PrayerTimeData } from '../../types';
import { PrayerTimesCard } from './PrayerTimesCard';
import { QiblaCompass } from './QiblaCompass';
import { PrayerTasksTracker } from './PrayerTasksTracker';
import { TasbihAndAdhkar } from './TasbihAndAdhkar';

interface PrayerAndQiblaViewProps {
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
  onOpenApkModal?: () => void;
}

export const PrayerAndQiblaView: React.FC<PrayerAndQiblaViewProps> = (props) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Top Section: Astronomical Prayer Times */}
      <PrayerTimesCard {...props} />

      {/* Middle Grid: Qibla Compass + Daily Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QiblaCompass coords={props.coords} />
        <PrayerTasksTracker />
      </div>

      {/* Bottom Section: Tasbih & Adhkar */}
      <TasbihAndAdhkar />

      {/* Android APK & Offline Companion Banner */}
      {props.onOpenApkModal && (
        <div className="rounded-2xl border border-emerald-800/60 bg-gradient-to-r from-emerald-950/70 via-stone-900 to-stone-950 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 islamic-glow">
          <div className="flex items-center gap-3.5 text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-900 text-amber-300 border border-emerald-500/40 shadow">
              <span className="font-arabic text-xl font-bold">م</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-classical text-base font-bold text-amber-100">
                  Take Al-Mizan Everywhere as an Android APK
                </h4>
                <span className="rounded bg-emerald-900/80 border border-emerald-600/40 px-2 py-0.5 text-[10px] text-emerald-300 font-mono">
                  APK PKG
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Install as a standalone Android app with physical magnetic sensor Qibla compass and local astronomical prayer calculation offline.
              </p>
            </div>
          </div>

          <button
            onClick={props.onOpenApkModal}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
          >
            <span>Package & Download APK</span>
          </button>
        </div>
      )}
    </div>
  );
};
