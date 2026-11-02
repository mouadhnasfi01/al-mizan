import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Flame, Sparkles, Award, Bell } from 'lucide-react';
import { audioAlertSystem } from '../../utils/audioAlerts';

interface TaskItem {
  id: string;
  name: string;
  arabicName: string;
  category: 'Fard' | 'Sunnah' | 'Quran' | 'Charity';
  completed: boolean;
  rewardNote: string;
}

const DEFAULT_TASKS: TaskItem[] = [
  { id: 'fajr', name: 'Fajr Prayer (in congregation/on time)', arabicName: 'صَلَاةُ الفَجْر', category: 'Fard', completed: false, rewardNote: 'Whoever prays Fajr is under the protection of Allah.' },
  { id: 'dhuhr', name: 'Dhuhr Prayer', arabicName: 'صَلَاةُ الظُّهْر', category: 'Fard', completed: false, rewardNote: 'Doors of heaven are opened at this hour.' },
  { id: 'asr', name: 'Asr Prayer (Salat al-Wusta)', arabicName: 'صَلَاةُ العَصْر', category: 'Fard', completed: false, rewardNote: 'Whoever misses Asr prayer has ruined his deeds.' },
  { id: 'maghrib', name: 'Maghrib Prayer', arabicName: 'صَلَاةُ المَغْرِب', category: 'Fard', completed: false, rewardNote: 'Angels of day and night assemble at this time.' },
  { id: 'isha', name: 'Isha Prayer', arabicName: 'صَلَاةُ العِشَاء', category: 'Fard', completed: false, rewardNote: 'Equivalent to standing half the night in prayer.' },
  { id: 'sunnah', name: 'Sunan Rawatib (12 daily Sunnah units)', arabicName: 'السُّنَنُ الرَّوَاتِب', category: 'Sunnah', completed: false, rewardNote: 'A palace built in Jannah for whoever preserves them.' },
  { id: 'duha', name: 'Duha / Ishraq Prayer (Forenoon)', arabicName: 'صَلَاةُ الضُّحَى', category: 'Sunnah', completed: false, rewardNote: 'Sadaqah on behalf of all 360 joints of the body.' },
  { id: 'tahajjud', name: 'Tahajjud & Witr (Night Vigil)', arabicName: 'قِيَامُ اللَّيْلِ وَالوِتْر', category: 'Sunnah', completed: false, rewardNote: 'The honor of the believer is in his night prayer.' },
  { id: 'quran', name: 'Daily Qur\'an Recitation & Tadabbur', arabicName: 'تِلَاوَةُ القُرْآن', category: 'Quran', completed: false, rewardNote: 'Ten good deeds for every single letter recited.' },
  { id: 'sadaqah', name: 'Daily Sadaqah / Smile / Kind Act', arabicName: 'الصَّدَقَةُ اليَوْمِيَّة', category: 'Charity', completed: false, rewardNote: 'Extinguishes sin just as water extinguishes fire.' },
];

export const PrayerTasksTracker: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const savedDate = localStorage.getItem('almizan_tasks_date');
      const today = new Date().toDateString();
      if (savedDate === today) {
        const saved = localStorage.getItem('almizan_tasks');
        if (saved) return JSON.parse(saved);
      }
    } catch (_e) {}
    return DEFAULT_TASKS;
  });

  const [alertsEnabled, setAlertsEnabled] = useState(true);

  useEffect(() => {
    try {
      const today = new Date().toDateString();
      localStorage.setItem('almizan_tasks_date', today);
      localStorage.setItem('almizan_tasks', JSON.stringify(tasks));
    } catch (_e) {}
  }, [tasks]);

  const toggleTask = (id: string) => {
    audioAlertSystem.playTasbihClick();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const fardCount = tasks.filter((t) => t.category === 'Fard' && t.completed).length;
  const completionPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            <h3 className="font-classical text-lg font-bold text-amber-100">
              Spiritual Tasks & Daily Deeds (مَهَامُّ اليَوْم)
            </h3>
          </div>
          <p className="text-xs text-stone-400">
            Daily consistency in Fard prayers, Sunan, recitation, and virtues
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-950/70 px-3 py-1 text-xs text-emerald-300 border border-emerald-800/60 font-semibold">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Fard Complete: {fardCount} / 5</span>
          </div>

          <button
            onClick={async () => {
              const res = await audioAlertSystem.requestNotificationPermission();
              setAlertsEnabled(res);
            }}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-emerald-400 cursor-pointer"
            title="Configure prayer alerts"
          >
            <Bell className={`h-4 w-4 ${alertsEnabled ? 'text-emerald-400' : 'text-stone-500'}`} />
            <span className="hidden sm:inline">Alerts Active</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-stone-400">
          <span>Daily Spiritual Fulfillment</span>
          <span className="font-mono text-emerald-400 font-bold">{completionPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Task Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
              task.completed
                ? 'border-emerald-600/60 bg-emerald-950/20 shadow-sm'
                : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
            }`}
          >
            <div className="mt-0.5 text-emerald-400">
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 fill-emerald-600 text-stone-950" />
              ) : (
                <Circle className="h-5 w-5 text-stone-600 hover:text-stone-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${task.completed ? 'text-emerald-300 line-through' : 'text-stone-200'}`}>
                  {task.name}
                </span>
                <span className="font-arabic text-[11px] text-stone-400">{task.arabicName}</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                {task.rewardNote}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
