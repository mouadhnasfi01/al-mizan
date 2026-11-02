import React from 'react';
import { BookOpen, Compass, Globe, Sparkles, Volume2, VolumeX, Bell, Download, Smartphone } from 'lucide-react';
import { getHijriDate } from '../utils/prayerCalculations';

interface NavbarProps {
  activeTab: 'scholar' | 'prayers' | 'library' | 'news';
  setActiveTab: (tab: 'scholar' | 'prayers' | 'library' | 'news') => void;
  nextPrayerName: string;
  timeToNextPrayer: string;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onRequestNotifications: () => void;
  onOpenDownload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  nextPrayerName,
  timeToNextPrayer,
  isMuted,
  setIsMuted,
  onRequestNotifications,
  onOpenDownload,
}) => {
  const hijri = getHijriDate();

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/80 bg-stone-950/90 backdrop-blur-md">
      {/* Top utility sub-bar */}
      <div className="border-b border-stone-900/60 bg-emerald-950/30 px-4 py-1.5 text-xs text-stone-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {hijri.day} {hijri.monthArabic} ({hijri.monthName}) {hijri.year} AH
            </span>
            <span className="hidden sm:inline text-stone-600">|</span>
            <span className="hidden sm:inline text-stone-400">
              Universal Islamic Epistemic & Scholarly Intelligence
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {nextPrayerName && (
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-stone-900/80 px-3 py-0.5 border border-emerald-900/40 text-stone-300">
                <span className="text-emerald-400 font-semibold">{nextPrayerName}</span>
                <span className="text-stone-400 text-[11px]">in {timeToNextPrayer}</span>
              </div>
            )}

            <button
              onClick={onOpenDownload}
              title="Download Android APK Package (.apk) or Install PWA"
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-100 bg-gradient-to-r from-emerald-950/80 to-amber-950/60 px-2.5 py-1 rounded-lg border border-emerald-600/40 hover:border-amber-500/60 transition-all cursor-pointer shadow-sm"
            >
              <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-semibold text-[11px]">APK & Install</span>
              <span className="hidden sm:inline-block px-1 py-0.2 rounded bg-emerald-800/60 text-[9px] text-emerald-200 uppercase font-mono">
                pkg
              </span>
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Adhan & Chimes' : 'Mute Audio'}
              className="flex items-center gap-1 text-stone-400 hover:text-emerald-400 transition-colors"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-amber-500" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
              <span className="hidden md:inline">{isMuted ? 'Muted' : 'Adhan Sound'}</span>
            </button>

            <button
              onClick={onRequestNotifications}
              title="Enable Prayer Time Alerts"
              className="flex items-center gap-1 text-stone-400 hover:text-emerald-400 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Alerts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scholar')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-900 text-amber-300 shadow-md islamic-glow border border-emerald-500/30">
            <span className="font-arabic text-xl font-bold">م</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-classical text-lg sm:text-xl font-bold tracking-wider text-amber-100">
                AL-MIZAN
              </span>
              <span className="font-arabic text-sm text-emerald-400 font-bold">المِيزَان</span>
            </div>
            <p className="text-[10px] text-stone-400 tracking-wide uppercase">
              Scholarly AI • Primary Sources • Global Intelligence
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('scholar')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'scholar'
                ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
            }`}
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Scholarly</span> Engine
          </button>

          <button
            onClick={() => setActiveTab('prayers')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'prayers'
                ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
            }`}
          >
            <Compass className="h-4 w-4 text-emerald-400" />
            <span>Prayers & Qibla</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'library'
                ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
            }`}
          >
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Classical</span> Library
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'news'
                ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
            }`}
          >
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>Daily News</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
