import React, { useState, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  Search,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  Cpu,
  DollarSign,
  HeartPulse,
  Leaf,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { GroundingSource, SectorField } from '../../types';

interface CuratedNewsCard {
  title: string;
  sector: SectorField;
  date: string;
  summary: string;
  islamicLens: string;
  scripturalWisdom: {
    text: string;
    source: string;
  };
  implications: string;
}

const PRELOADED_DIGEST: CuratedNewsCard[] = [
  {
    title: 'Global Acceleration of Autonomous AI Agents & Ethical Guardrails',
    sector: 'Artificial Intelligence & Deep Tech',
    date: 'Current Global Brief',
    summary: 'Rapid deployment of autonomous multi-agent reasoning models across defense, financial automation, and legal contracts raises urgent worldwide calls for algorithmic governance and accountability standards.',
    islamicLens: 'Under Usul al-Fiqh, automated tools cannot assume primary moral agency (Mukallaf). The developer and deployer retain strict legal and ethical liability (Daman). The maxim "Harm must be preempted" (Dar’ al-mafasid awla min jalb al-masalih) mandates strict safety thresholds before deployment.',
    scripturalWisdom: {
      text: 'And do not pursue that of which you have no knowledge. Indeed, the hearing, the sight and the heart — about all those one will be questioned.',
      source: 'Surah Al-Isra 17:36',
    },
    implications: 'Technological power must remain subordinate to human welfare and moral conscience, rather than unchecked corporate optimization.',
  },
  {
    title: 'Sovereign Debt Crises & Surge in Asset-Backed Islamic Sukuk Financing',
    sector: 'Economy & Islamic Finance',
    date: 'Current Global Brief',
    summary: 'Escalating sovereign debt burdens in developing nations prompt international central banks to explore asset-backed bonds, infrastructure Waqf endowments, and profit-sharing Sukuk instruments.',
    islamicLens: 'Classical Islamic economics prohibits debt monetization and interest (Ribā) which creates artificial fictitious wealth divorced from real productivity. Asset-backed risk-sharing aligns risk with reward and protects society from speculative predatory bubbles.',
    scripturalWisdom: {
      text: 'Allah has permitted trade and has forbidden interest (Ribā)...',
      source: 'Surah Al-Baqarah 2:275',
    },
    implications: 'A structural shift from speculative debt leverage toward shared equity and tangible economic infrastructure.',
  },
  {
    title: 'Global Biodiversity Accord & International Freshwater Scarcity Accords',
    sector: 'Environment & Ecological Stewardship',
    date: 'Current Global Brief',
    summary: 'International climate summits confront historic aquifer depletion and biodiversity loss, debating universal legal moratoriums on river diversions and rainforest deforestation.',
    islamicLens: 'The Earth is an inviolable trust (Amanah) given to humanity as stewards (Khulafa\'). Prophet Muhammad ﷺ prohibited wasting water even while performing ablution at a flowing river, establishing conservation as an act of worship.',
    scripturalWisdom: {
      text: 'And do not cause corruption upon the earth after its reformation...',
      source: 'Surah Al-A‘raf 7:56',
    },
    implications: 'Environmental preservation is not merely a secular policy option, but an existential moral responsibility toward future generations.',
  },
  {
    title: 'Global Humanitarian Coordination & Multilateral Diplomatic Realignment',
    sector: 'Geopolitics & World Order',
    date: 'Current Global Brief',
    summary: 'Shifts in Global South alliances, multilateral trade pacts, and UN humanitarian resolutions emphasize sovereign neutrality and protection of civilian populations in conflict zones.',
    islamicLens: 'Justice (\'Adl) is non-negotiable in Islamic political philosophy and must be applied impartially to ally and adversary alike. All human life possesses inviolable dignity conferred by the Creator.',
    scripturalWisdom: {
      text: 'O you who have believed, be persistently standing firm for Allah, witnesses in justice, and do not let the hatred of a people prevent you from being just. Be just; that is nearer to righteousness.',
      source: 'Surah Al-Ma’idah 5:8',
    },
    implications: 'True lasting peace can only be established upon impartial justice, ending double standards in international jurisprudence.',
  },
];

export const NewsDigestView: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<SectorField>('All Sectors');
  const [customSearch, setCustomSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [digestText, setDigestText] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveNews = async (sectorName?: string, query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/news-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: sectorName || selectedSector,
          customQuery: query || customSearch,
        }),
      });

      if (!response.ok) throw new Error('Failed to retrieve news digest');
      const data = await response.json();
      setDigestText(data.text);
      setSources(data.sources || []);
      setTimestamp(data.timestamp);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching news.');
    } finally {
      setLoading(false);
    }
  };

  const sectorIcons: Record<string, any> = {
    'All Sectors': Globe,
    'Geopolitics & World Order': Compass,
    'Economy & Islamic Finance': DollarSign,
    'Artificial Intelligence & Deep Tech': Cpu,
    'Medicine & Bioethics': HeartPulse,
    'Environment & Ecological Stewardship': Leaf,
    'Society, Family & Education': Users,
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/60 bg-gradient-to-b from-stone-900/90 to-stone-950 p-6 sm:p-8 islamic-glow space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Globe className="h-4 w-4" />
          <span>Global Intelligence & Information Collection</span>
        </div>
        <h1 className="font-classical text-2xl sm:text-3xl font-bold text-amber-100">
          Daily News & Global Affairs (The Islamic Ethical Lens)
        </h1>
        <p className="max-w-3xl text-xs sm:text-sm text-stone-300 leading-relaxed">
          Real-time information collection and news synthesis across all sectors—Geopolitics, Islamic Finance, Artificial Intelligence, Bioethics, and Climate Stewardship—filtered through verified facts, <span className="text-emerald-400 font-medium">Maqāsid al-Sharī‘ah</span>, and prophetic wisdom.
        </p>

        {/* Live Search & Query Bar */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              placeholder="Search or collect live news on any topic (e.g. quantum computing, central bank digital currency, Gaza peace talks)..."
              className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && fetchLiveNews(undefined, customSearch)}
            />
          </div>

          <button
            onClick={() => fetchLiveNews(undefined, customSearch)}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 transition-all cursor-pointer shadow-lg"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-amber-300" />
            )}
            <span>{loading ? 'Synthesizing...' : 'Collect Live News'}</span>
          </button>
        </div>

        {/* Sector Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1">
          {(
            [
              'All Sectors',
              'Geopolitics & World Order',
              'Economy & Islamic Finance',
              'Artificial Intelligence & Deep Tech',
              'Medicine & Bioethics',
              'Environment & Ecological Stewardship',
              'Society, Family & Education',
            ] as SectorField[]
          ).map((sec) => {
            const Icon = sectorIcons[sec] || Globe;
            return (
              <button
                key={sec}
                onClick={() => {
                  setSelectedSector(sec);
                  fetchLiveNews(sec);
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                  selectedSector === sec
                    ? 'border-emerald-500 bg-emerald-950 text-emerald-300 shadow-sm'
                    : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{sec}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-8 text-center space-y-3 animate-pulse">
          <Globe className="mx-auto h-8 w-8 text-emerald-400 animate-spin" />
          <h3 className="font-classical text-base font-semibold text-amber-200">
            Scanning Global Intelligence via Google Search Grounding...
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Extracting factual developments and applying Islamic scholarly ethical critique...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Live Grounded Synthesis Result */}
      {digestText && !loading && (
        <div className="rounded-2xl border border-emerald-900/70 bg-stone-900/90 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-800/60">
                Live Search Grounded
              </span>
              <span className="text-xs text-stone-400">{selectedSector}</span>
            </div>
            {timestamp && (
              <span className="text-[11px] text-stone-400 font-mono">
                Updated: {new Date(timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line space-y-4">
            {digestText}
          </div>

          {/* Sources Grounding Chunks */}
          {sources.length > 0 && (
            <div className="border-t border-stone-800 pt-4 space-y-2">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                Verified Global Sources & Citations:
              </span>
              <div className="flex flex-wrap gap-2">
                {sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1 text-[11px] text-emerald-400 hover:border-emerald-600 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate max-w-[200px]">{src.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Curated Editorial News & Scholarly Filter Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Curated Global Briefings & Epistemic Filter</span>
          </div>
          <span className="text-xs text-stone-400">All Sectors & Fields</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRELOADED_DIGEST.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900/70 p-5 space-y-4 hover:border-emerald-800/60 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded bg-stone-950 px-2.5 py-0.5 text-emerald-400 font-semibold border border-stone-800">
                    {item.sector}
                  </span>
                  <span className="text-stone-400 text-[11px]">{item.date}</span>
                </div>

                <h3 className="font-classical text-base font-bold text-amber-100 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/40 p-3 rounded-xl border border-stone-800/60">
                  {item.summary}
                </p>

                {/* Islamic Scholarly Lens */}
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                    <span>Islamic Ethical & Maqāsid Analysis</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{item.islamicLens}</p>
                </div>
              </div>

              {/* Scriptural Anchor */}
              <div className="border-t border-stone-800/80 pt-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                  <BookOpen className="h-3 w-3" />
                  <span>Scriptural Wisdom ({item.scripturalWisdom.source})</span>
                </div>
                <p className="text-xs text-stone-400 italic">
                  "{item.scripturalWisdom.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
