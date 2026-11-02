import React, { useState } from 'react';
import {
  Sparkles,
  BookMarked,
  Scale,
  ShieldCheck,
  Brain,
  History,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { ScholarlySynthesisResult, SectorField } from '../../types';

const SAMPLE_INQUIRIES = [
  {
    title: 'Autonomous AI & Moral Agency',
    field: 'Artificial Intelligence & Deep Tech' as SectorField,
    query: 'Can autonomous AI systems possess moral agency or legal liability under Islamic jurisprudence, and how do Maqasid al-Shariah govern algorithmic decisions?',
  },
  {
    title: 'Fiat Money, Debt Systems & Ribā',
    field: 'Economy & Islamic Finance' as SectorField,
    query: 'How does modern unbacked fiat currency and fractional-reserve central banking align or conflict with the classical prohibition of Ribā, Gharar, and intrinsic money principles?',
  },
  {
    title: 'CRISPR & Germline Gene Editing',
    field: 'Medicine & Bioethics' as SectorField,
    query: 'What is the Islamic bioethical ruling on CRISPR germline genetic modification versus somatic therapy through the lens of preserving Nafs (life) and preventing Taghyir Khalq Allah (altering creation)?',
  },
  {
    title: 'Ibn Khaldun\'s Asabiyyah in Modern States',
    field: 'Geopolitics & World Order' as SectorField,
    query: 'How does Ibn Khaldun\'s theory of Asabiyyah (social solidarity) and civilizational senescence explain the fragility and polarization of contemporary nation-states?',
  },
  {
    title: 'Climate Crisis & The Earth as Amanah',
    field: 'Environment & Ecological Stewardship' as SectorField,
    query: 'Analyze ecological collapse, climate emissions, and corporate environmental destruction through the Islamic doctrine of Khilafah (stewardship) and legal maxim "La Darar wa la Dirar".',
  },
  {
    title: 'Quantum Indeterminacy & Divine Qadar',
    field: 'Philosophy & Epistemology' as SectorField,
    query: 'How do classical Islamic theologians (Ash\'ari and Maturidi) reconcile cosmic causation, quantum probabilistic indeterminacy, and omniscient Divine Decree (Al-Qada\' wal-Qadar)?',
  },
];

export const ScholarEngineView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedField, setSelectedField] = useState<SectorField>('All Sectors');
  const [scholarlyFocus, setScholarlyFocus] = useState('Maqasid & Usul al-Fiqh');
  const [depth, setDepth] = useState('Comprehensive Scholarly Monograph');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScholarlySynthesisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToRun = customQuery || query;
    if (!queryToRun.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/scholar-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToRun,
          field: selectedField,
          scholarlyFocus,
          depth,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to synthesize response');
      }

      const data = await response.json();
      setResult(data.result);
      if (customQuery) {
        setQuery(customQuery);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while synthesizing knowledge.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `${result.title}\n\nSUMMARY:\n${result.summary}\n\nPRIMARY SOURCES:\n${result.primarySources
      .map((s) => `• [${s.type}] ${s.citation}: ${s.translation}`)
      .join('\n')}\n\nMODERN SYNTHESIS:\n${result.modernSynthesisAndContemporaryFiqh}\n\nACTIONABLE GUIDANCE:\n${result.actionableGuidance.map((g) => `- ${g}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-900/60 bg-gradient-to-b from-stone-900/90 via-stone-900/60 to-stone-950 p-6 sm:p-8 islamic-glow">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-950/60 px-3 py-1 text-xs text-emerald-300">
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            <span>Authentic Scholarly Hermeneutics & Primary Sources</span>
          </div>

          <h1 className="font-classical text-2xl sm:text-4xl font-bold tracking-tight text-amber-100">
            Islamic Universal Epistemology Engine
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Filter all human inquiry—from ancient civilizations, scientific breakthroughs, bioethics, and modern economics to quantum theory—through the authoritative foundational sources of Islam: the Holy Qur'an, authentic Sunnah, <span className="text-emerald-400 font-medium">Usūl al-Fiqh</span> (Legal Maxims), and <span className="text-amber-400 font-medium">Maqāsid al-Sharī‘ah</span> (Higher Divine Objectives).
          </p>

          {/* Methodological Badges */}
          <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-stone-400">
            <span className="rounded-md border border-stone-800 bg-stone-950/80 px-2.5 py-1 text-emerald-300">
              ✓ Qur'an with Classical Tafsīr
            </span>
            <span className="rounded-md border border-stone-800 bg-stone-950/80 px-2.5 py-1 text-emerald-300">
              ✓ Isnād-Verified Hadīth
            </span>
            <span className="rounded-md border border-stone-800 bg-stone-950/80 px-2.5 py-1 text-emerald-300">
              ✓ 5 Universal Maqāsid
            </span>
            <span className="rounded-md border border-stone-800 bg-stone-950/80 px-2.5 py-1 text-amber-300">
              ✓ Qat‘ī vs. Dhannī Certainty
            </span>
            <span className="rounded-md border border-stone-800 bg-stone-950/80 px-2.5 py-1 text-stone-300">
              ✓ Harmony of ‘Aql (Reason) & Naql (Revelation)
            </span>
          </div>
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="rounded-2xl border border-stone-800 bg-stone-900/80 p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center justify-between">
            <span>Inquire Upon Any Field, History, or Contemporary Issue</span>
            <span className="text-emerald-400 text-[11px] lowercase">powered by authentic Islamic jurisprudence</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Can Artificial General Intelligence possess moral agency under Islamic bioethics, and how do Maqasid al-Shariah govern algorithmic decisions?"
              className="w-full resize-none rounded-xl border border-stone-700/80 bg-stone-950 p-4 text-sm sm:text-base text-stone-100 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="text-[11px] font-medium text-stone-400 mb-1 block">Sector / Discipline</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value as SectorField)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="All Sectors">All Sectors & Fields</option>
              <option value="Artificial Intelligence & Deep Tech">Artificial Intelligence & Deep Tech</option>
              <option value="Economy & Islamic Finance">Economy & Islamic Finance</option>
              <option value="Medicine & Bioethics">Medicine & Bioethics</option>
              <option value="Geopolitics & World Order">Geopolitics & World Order</option>
              <option value="Environment & Ecological Stewardship">Environment & Stewardship</option>
              <option value="Philosophy & Epistemology">Philosophy & Epistemology</option>
              <option value="Society, Family & Education">Society, Family & Education</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-stone-400 mb-1 block">Scholarly Framework</label>
            <select
              value={scholarlyFocus}
              onChange={(e) => setScholarlyFocus(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="Maqasid & Usul al-Fiqh">Maqasid al-Shariah & Usul al-Fiqh (Maxims)</option>
              <option value="Comparative Madhahib Synthesis">Comparative Sunni Madhahib (Four Schools)</option>
              <option value="Kalam & Epistemology">Theology (Kalam) & Epistemology</option>
              <option value="Civilizational Historiography">Civilizational Historiography & Umran</option>
              <option value="Comprehensive Integrated Synthesis">Comprehensive Integrated Synthesis</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-stone-400 mb-1 block">Analytical Depth</label>
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="Comprehensive Scholarly Monograph">Comprehensive Monograph (Detailed)</option>
              <option value="Executive Epistemic Summary">Executive Epistemic Summary</option>
              <option value="Juristic & Ethical Framework">Juristic & Ethical Framework Focus</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Evaluated against Quran, Sahih Hadith & Classical Jurists</span>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-emerald-500 hover:to-teal-600 focus:outline-none disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Synthesizing Scholarly Corpus...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Synthesize Knowledge</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Inspirations */}
      {!result && !loading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Pivotal Historical & Contemporary Inquiries</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SAMPLE_INQUIRIES.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedField(item.field);
                  handleSubmit(undefined, item.query);
                }}
                className="group cursor-pointer rounded-xl border border-stone-800/80 bg-stone-900/50 p-4 hover:border-emerald-500/50 hover:bg-stone-900/90 transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium mb-1">
                  <span>{item.field}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-semibold text-stone-200 text-sm group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {item.query}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 text-rose-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Synthesis Error</h4>
            <p className="text-xs text-rose-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state skeleton */}
      {loading && (
        <div className="space-y-4 rounded-2xl border border-stone-800 bg-stone-900/40 p-8 text-center animate-pulse">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            <Scale className="h-7 w-7 animate-bounce" />
          </div>
          <h3 className="font-classical text-lg font-semibold text-amber-200">
            Analyzing Through Islamic Scholarly Epistemologies...
          </h3>
          <p className="mx-auto max-w-md text-xs text-stone-400 leading-relaxed">
            Interrogating Quranic corpus, verified Hadith corpuses (Bukhari, Muslim), Usul al-Fiqh legal maxims, and Maqasid al-Shariah teleological objectives...
          </p>
        </div>
      )}

      {/* Synthesized Scholarly Result View */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Result Header */}
          <div className="rounded-2xl border border-emerald-900/60 bg-stone-900/90 p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {result.epistemicClassification && (
                  <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-amber-400" />
                    <span>{result.epistemicClassification.level}</span>
                  </span>
                )}
                <span className="rounded-full bg-stone-800 px-3 py-1 text-xs text-stone-300 border border-stone-700">
                  {selectedField}
                </span>
              </div>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs text-stone-200 hover:bg-stone-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Synthesis'}</span>
              </button>
            </div>

            <h2 className="font-classical text-2xl sm:text-3xl font-bold text-amber-100">
              {result.title}
            </h2>

            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 text-stone-200 text-sm sm:text-base leading-relaxed">
              <p className="font-medium text-emerald-300 mb-1 text-xs uppercase tracking-wider">
                Epistemic Synthesis & Core Verdict
              </p>
              <p>{result.summary}</p>
              {result.epistemicClassification?.rationale && (
                <p className="mt-2 text-xs text-stone-400 italic">
                  Classification Rationale: {result.epistemicClassification.rationale}
                </p>
              )}
            </div>
          </div>

          {/* Section 1: Primary Religious Sources (Qur'an & Hadith) */}
          {result.primarySources && result.primarySources.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-300">
                <BookMarked className="h-4 w-4 text-emerald-400" />
                <span>Primary Religious Sources & Evidentiary Text</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.primarySources.map((source, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-stone-800 bg-stone-900/70 p-5 space-y-3 hover:border-emerald-800/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-2">
                        <span className="rounded bg-emerald-950/80 px-2 py-0.5 border border-emerald-800/60">
                          {source.type}
                        </span>
                        <span className="text-stone-400">{source.citation}</span>
                      </div>

                      {source.arabic && (
                        <div className="my-3 rounded-lg bg-stone-950 p-3 text-right">
                          <p className="font-arabic text-lg sm:text-xl text-amber-100 leading-loose" dir="rtl">
                            {source.arabic}
                          </p>
                        </div>
                      )}

                      <p className="text-sm text-stone-200 italic leading-relaxed">
                        "{source.translation}"
                      </p>
                    </div>

                    {source.contextAndTafsir && (
                      <div className="border-t border-stone-800/80 pt-2.5 text-xs text-stone-400">
                        <span className="font-semibold text-emerald-400">Classical Tafsīr / Explanation: </span>
                        {source.contextAndTafsir}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Scholarly Frameworks (Maqasid al-Shariah & Usul al-Fiqh Maxims) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Maqasid Impact */}
            {result.scholarlyFrameworks?.maqasidImpact && (
              <div className="space-y-3 rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Maqāsid al-Sharī‘ah (Higher Objectives)</span>
                </div>

                <div className="space-y-2.5">
                  {result.scholarlyFrameworks.maqasidImpact.map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-stone-950/70 p-3 border border-stone-800/70">
                      <div className="font-semibold text-xs text-amber-300 mb-1 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {item.objective}
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">{item.analysis}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usul Legal Maxims */}
            {result.scholarlyFrameworks?.usulMaximsApplied && (
              <div className="space-y-3 rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-300">
                  <Scale className="h-4 w-4" />
                  <span>Qawā‘id Fiqhiyyah (Legal Maxims Applied)</span>
                </div>

                <div className="space-y-2.5">
                  {result.scholarlyFrameworks.usulMaximsApplied.map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-stone-950/70 p-3 border border-stone-800/70">
                      <div className="font-semibold text-xs text-emerald-300 mb-1">
                        {item.maxim}
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">{item.application}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Classical Scholars' Perspectives */}
          {result.scholarlyFrameworks?.classicalScholarsViews && result.scholarlyFrameworks.classicalScholarsViews.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-300">
                <History className="h-4 w-4 text-emerald-400" />
                <span>Classical Scholars & Historical Precedents</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.scholarlyFrameworks.classicalScholarsViews.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-stone-800 bg-stone-900/70 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-200">{item.scholar}</span>
                      <span className="text-stone-400 text-[11px]">{item.era}</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">{item.insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Modern Synthesis & Contemporary Fiqh Councils */}
          {result.modernSynthesisAndContemporaryFiqh && (
            <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
                <Brain className="h-4 w-4" />
                <span>Contemporary Fiqh Academies & Scientific Integration</span>
              </div>
              <p className="text-stone-200 text-sm leading-relaxed whitespace-pre-line">
                {result.modernSynthesisAndContemporaryFiqh}
              </p>
            </div>
          )}

          {/* Section 5: Actionable Ethical Guidance */}
          {result.actionableGuidance && result.actionableGuidance.length > 0 && (
            <div className="rounded-2xl border border-amber-900/40 bg-stone-900/90 p-6 space-y-3 gold-glow">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Practical & Ethical Directives for Today</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {result.actionableGuidance.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-lg bg-stone-950/80 p-3 border border-stone-800/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-700/50">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-stone-200 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
