import React, { useState, useEffect } from 'react';
import { CalculationMethod, JuristicSchool, LocationCoordinates, PrayerTimeData } from './types';
import { calculatePrayerTimes, POPULAR_CITIES } from './utils/prayerCalculations';
import { audioAlertSystem } from './utils/audioAlerts';
import { Navbar } from './components/Navbar';
import { ScholarEngineView } from './components/KnowledgeEngine/ScholarEngineView';
import { PrayerAndQiblaView } from './components/PrayerAndQibla/PrayerAndQiblaView';
import { DigitalLibraryView } from './components/ClassicalLibrary/DigitalLibraryView';
import { NewsDigestView } from './components/DailyNewsDigest/NewsDigestView';
import { DownloadModal } from './components/DownloadModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BookOpen, Compass, Sparkles, Globe, Heart, Download, Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scholar' | 'prayers' | 'library' | 'news'>('scholar');
  const [coords, setCoords] = useState<LocationCoordinates>(POPULAR_CITIES[0]); // Defaults to Makkah al-Mukarramah
  const [method, setMethod] = useState<CalculationMethod>('MWL');
  const [juristic, setJuristic] = useState<JuristicSchool>('Standard');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData>(() =>
    calculatePrayerTimes(POPULAR_CITIES[0], new Date(), 'MWL', 'Standard')
  );

  const [nextPrayerName, setNextPrayerName] = useState<string>('Dhuhr');
  const [timeToNextPrayer, setTimeToNextPrayer] = useState<string>('00:00:00');
  const [progressPercent, setProgressPercent] = useState<number>(50);

  // Sync mute state with audio alert system
  const handleToggleMute = (muted: boolean) => {
    setIsMuted(muted);
    audioAlertSystem.setMuted(muted);
  };

  const handleRequestNotifications = async () => {
    const granted = await audioAlertSystem.requestNotificationPermission();
    if (granted) {
      audioAlertSystem.sendPrayerAlert('Al-Mizan Alerts', 'Notifications active for prayer times.');
    }
  };

  // Recalculate prayer times whenever location, method, or juristic school changes
  useEffect(() => {
    const times = calculatePrayerTimes(coords, new Date(), method, juristic);
    setPrayerTimes(times);
  }, [coords, method, juristic]);

  // Real-time prayer countdown & alert trigger loop
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentTimes = calculatePrayerTimes(coords, now, method, juristic);
      setPrayerTimes(currentTimes);

      const prayers = [
        { name: 'Fajr', date: currentTimes.rawDates.fajr },
        { name: 'Dhuhr', date: currentTimes.rawDates.dhuhr },
        { name: 'Asr', date: currentTimes.rawDates.asr },
        { name: 'Maghrib', date: currentTimes.rawDates.maghrib },
        { name: 'Isha', date: currentTimes.rawDates.isha },
      ];

      // Find next upcoming prayer today
      let next = prayers.find((p) => p.date.getTime() > now.getTime());
      let prevDate: Date;

      if (!next) {
        // All prayers for today have passed; next is tomorrow's Fajr
        next = { name: 'Fajr', date: new Date(currentTimes.rawDates.fajr.getTime() + 24 * 60 * 60 * 1000) };
        prevDate = currentTimes.rawDates.isha;
      } else {
        const nextIdx = prayers.indexOf(next);
        prevDate = nextIdx === 0
          ? new Date(currentTimes.rawDates.isha.getTime() - 24 * 60 * 60 * 1000)
          : prayers[nextIdx - 1].date;
      }

      setNextPrayerName(next.name);

      const diffMs = next.date.getTime() - now.getTime();
      const totalInterval = next.date.getTime() - prevDate.getTime();
      const elapsed = now.getTime() - prevDate.getTime();
      const progress = totalInterval > 0 ? (elapsed / totalInterval) * 100 : 0;
      setProgressPercent(progress);

      // Check if prayer moment reached (within 1 second)
      if (diffMs <= 1000 && diffMs > 0) {
        audioAlertSystem.sendPrayerAlert(next.name, next.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }

      const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const formatted = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimeToNextPrayer(formatted);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [coords, method, juristic]);

  return (
    <div className="min-h-screen bg-arabesque flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        nextPrayerName={nextPrayerName}
        timeToNextPrayer={timeToNextPrayer}
        isMuted={isMuted}
        setIsMuted={handleToggleMute}
        onRequestNotifications={handleRequestNotifications}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {activeTab === 'scholar' && <ScholarEngineView />}
        {activeTab === 'prayers' && (
          <PrayerAndQiblaView
            coords={coords}
            setCoords={setCoords}
            method={method}
            setMethod={setMethod}
            juristic={juristic}
            setJuristic={setJuristic}
            prayerTimes={prayerTimes}
            nextPrayerName={nextPrayerName}
            timeToNextPrayer={timeToNextPrayer}
            progressPercent={progressPercent}
            onOpenApkModal={() => setIsDownloadOpen(true)}
          />
        )}
        {activeTab === 'library' && <DigitalLibraryView />}
        {activeTab === 'news' && <NewsDigestView />}
      </main>

      {/* Download & Install Modal */}
      <DownloadModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />

      {/* Offline Connectivity Toast */}
      <OfflineIndicator />

      {/* Footer */}
      <footer className="border-t border-emerald-950/80 bg-stone-950/90 py-8 px-4 text-xs text-stone-400">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-900/50 text-amber-300 border border-emerald-700/40 font-arabic font-bold text-sm">
              م
            </div>
            <div>
              <p className="font-classical font-semibold text-stone-200">
                Al-Mizan (الميزان) • Islamic Epistemology & Scholarly Intelligence
              </p>
              <p className="text-[11px] text-stone-400">
                Anchored in the Qur'an, Sunnah, Usul al-Fiqh, and Maqasid al-Shariah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs text-stone-400">
            <button
              onClick={() => setIsDownloadOpen(true)}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-100 transition-colors cursor-pointer"
            >
              <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
              <span>Android APK Package & Install</span>
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="h-3 w-3" />
              <span>Gemini 3.8 Flash</span>
            </span>
            <span>•</span>
            <span className="text-stone-300">PWA / TWA v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
