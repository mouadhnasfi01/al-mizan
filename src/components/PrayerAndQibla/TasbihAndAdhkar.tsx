import React, { useState } from 'react';
import { RotateCcw, Volume2, Sparkles, BookOpen, Heart } from 'lucide-react';
import { audioAlertSystem } from '../../utils/audioAlerts';

interface DhikrPreset {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
  virtue: string;
}

const PRESETS: DhikrPreset[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥān Allāh',
    translation: 'Glory be to Allah',
    target: 33,
    virtue: 'Plants a tree in Jannah and washes away minor sins.',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    target: 33,
    virtue: 'Fills the scale of good deeds to the brim.',
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    target: 34,
    virtue: 'Affirms absolute divine transcendence over all creation.',
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullāha wa-atūbu ilayh',
    translation: 'I seek Allah’s forgiveness and repent to Him',
    target: 100,
    virtue: 'Opens closed doors, brings ease, and removes distress.',
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: 'Allāhumma ṣalli ‘alā Muḥammad wa-‘alā āli Muḥammad',
    translation: 'O Allah, send blessings upon Muhammad and the family of Muhammad',
    target: 100,
    virtue: 'Whoever sends blessings on the Prophet ﷺ once, Allah sends 10 blessings on him.',
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Lā ilāha illallāhu waḥdahū lā sharīka lah',
    translation: 'None has the right to be worshiped except Allah alone, without partner',
    target: 100,
    virtue: 'Protection from Shaytan throughout the day, equivalent to freeing 10 slaves.',
  },
];

const MORNING_EVENING_ADHKAR = [
  {
    title: 'Sayyid al-Istighfar (The Master Supplication for Forgiveness)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.',
    transliteration: 'Allāhumma Anta Rabbī, lā ilāha illā Anta, khalaqtanī wa-anā ‘abduka, wa-anā ‘alā ‘ahdika wa-wa‘dika mastata‘tu...',
    translation: 'O Allah, You are my Lord, none has the right to be worshiped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.',
    virtue: 'Whoever recites this with conviction in the morning and dies before evening will be among the people of Jannah (Sahih al-Bukhari).',
  },
  {
    title: 'Supplication for Protection from All Harm',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ. (ثَلَاثَ مَرَّاتٍ)',
    transliteration: 'Bismillāhil-ladhī lā yaḍurru ma‘as-mihī shay’un fil-arḍi wa-lā fis-samā’i wa-Huwas-Samī‘ul-‘Alīm (3x)',
    translation: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing. (Recite 3 times)',
    virtue: 'Nothing will harm the one who recites this thrice in the morning and thrice in the evening (Abu Dawud & Tirmidhi).',
  },
];

export const TasbihAndAdhkar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasbih' | 'adhkar'>('tasbih');
  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [cycles, setCycles] = useState<number>(0);

  const handleIncrement = () => {
    audioAlertSystem.playTasbihClick();
    const nextCount = count + 1;
    if (nextCount >= selectedPreset.target) {
      setCount(0);
      setCycles((c) => c + 1);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    setCycles(0);
  };

  const handlePresetSelect = (preset: DhikrPreset) => {
    setSelectedPreset(preset);
    setCount(0);
  };

  const progress = Math.min(100, Math.round((count / selectedPreset.target) * 100));

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-amber-400" />
          <h3 className="font-classical text-lg font-bold text-amber-100">
            Dhikr & Remembrance of Allah (ذِكْرُ اللَّهِ)
          </h3>
        </div>

        <div className="flex rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('tasbih')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              activeTab === 'tasbih' ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Digital Tasbīḥ
          </button>
          <button
            onClick={() => setActiveTab('adhkar')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              activeTab === 'adhkar' ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Daily Adhkār
          </button>
        </div>
      </div>

      {activeTab === 'tasbih' ? (
        <div className="space-y-6">
          {/* Preset Chips */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                  selectedPreset.id === p.id
                    ? 'border-emerald-500 bg-emerald-950/70 text-emerald-300 shadow-sm'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                {p.transliteration} ({p.target})
              </button>
            ))}
          </div>

          {/* Current Dhikr Display */}
          <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 text-center space-y-1">
            <p className="font-arabic text-2xl sm:text-3xl font-bold text-amber-100 leading-relaxed" dir="rtl">
              {selectedPreset.arabic}
            </p>
            <p className="text-sm font-semibold text-emerald-400">{selectedPreset.transliteration}</p>
            <p className="text-xs text-stone-400 italic">"{selectedPreset.translation}"</p>
            <p className="text-[11px] text-amber-300/80 pt-1">{selectedPreset.virtue}</p>
          </div>

          {/* Main Interactive Bead Counter Button */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <button
              onClick={handleIncrement}
              className="group relative flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center rounded-full border-4 border-emerald-500/50 bg-gradient-to-b from-stone-900 to-stone-950 shadow-2xl active:scale-95 transition-all cursor-pointer islamic-glow hover:border-emerald-400"
            >
              {/* Circular progress outline */}
              <svg className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-stone-800 fill-none stroke-[6px]"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-emerald-400 fill-none stroke-[6px] transition-all duration-150"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex flex-col items-center z-10 select-none">
                <span className="font-mono text-4xl sm:text-5xl font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                  {count}
                </span>
                <span className="text-xs text-stone-400 mt-1">/ {selectedPreset.target}</span>
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest mt-2">TAP BEAD</span>
              </div>
            </button>

            {/* Cycles and Reset */}
            <div className="flex items-center gap-6 text-xs text-stone-400">
              <span className="rounded-md bg-stone-950 px-3 py-1 border border-stone-800">
                Completed Sets: <strong className="text-emerald-400">{cycles}</strong>
              </span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 rounded-md bg-stone-800 px-3 py-1 text-stone-300 hover:bg-stone-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Daily Morning & Evening Adhkar */
        <div className="space-y-4">
          {MORNING_EVENING_ADHKAR.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-stone-800 bg-stone-950/60 p-4 space-y-2.5">
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">{item.title}</h4>
              <p className="font-arabic text-lg sm:text-xl text-stone-100 text-right leading-loose" dir="rtl">
                {item.arabic}
              </p>
              <p className="text-xs text-emerald-400/90 italic">{item.transliteration}</p>
              <p className="text-xs text-stone-300 leading-relaxed">"{item.translation}"</p>
              <div className="border-t border-stone-800/80 pt-2 text-[11px] text-stone-400">
                <span className="font-medium text-amber-400">Promised Virtue: </span>
                {item.virtue}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
