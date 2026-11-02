import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  BookMarked,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  Filter,
  X,
  Send,
  ExternalLink,
} from 'lucide-react';
import { ClassicalText } from '../../types';
import { CLASSICAL_LIBRARY } from '../../utils/classicalLibraryData';

export const DigitalLibraryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<ClassicalText>(CLASSICAL_LIBRARY[0]);
  const [selectedPassageId, setSelectedPassageId] = useState<string>(CLASSICAL_LIBRARY[0].passages[0]?.id || '');
  const [arabicFontSize, setArabicFontSize] = useState<'text-lg' | 'text-xl' | 'text-2xl'>('text-xl');
  const [showTransliteration, setShowTransliteration] = useState(true);

  // AI Ask Drawer State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = [
    'All',
    'Quran',
    'Hadith',
    'Fiqh & Usul',
    'Maqasid & Philosophy',
    'Tazkiyah & Ethics',
    'Theology',
  ];

  const filteredBooks = CLASSICAL_LIBRARY.filter((book) => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.arabicTitle.includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.passages.some(
        (p) =>
          p.label.toLowerCase().includes(q) ||
          p.translation.toLowerCase().includes(q) ||
          p.themes.some((t) => t.toLowerCase().includes(q))
      );
    return matchesCategory && matchesSearch;
  });

  const activePassage =
    selectedBook.passages.find((p) => p.id === selectedPassageId) || selectedBook.passages[0];

  const handleAskScholarAI = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiQuestion;
    if (!promptToSend.trim()) return;

    setAiLoading(true);
    setAiExplanation(null);

    try {
      const response = await fetch('/api/gemini/library-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textTitle: selectedBook.title,
          author: selectedBook.author,
          passage: `${activePassage?.label}\n${activePassage?.translation}`,
          question: promptToSend,
        }),
      });

      if (!response.ok) throw new Error('Failed to retrieve scholarly explanation');
      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (err: any) {
      console.error(err);
      setAiExplanation(`Scholarly explanation error: ${err.message || 'Unknown issue'}`);
    } finally {
      setAiLoading(false);
    }
  };

  const copyPassage = () => {
    if (!activePassage) return;
    const text = `${selectedBook.title} - ${activePassage.label}\n\n${activePassage.arabic}\n\nTranslation: ${activePassage.translation}\n\nCommentary: ${activePassage.scholarlyCommentary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/60 bg-gradient-to-b from-stone-900/90 to-stone-950 p-6 sm:p-8 islamic-glow space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <BookOpen className="h-4 w-4" />
          <span>Bayt al-Hikmah Classical Repository</span>
        </div>
        <h1 className="font-classical text-2xl sm:text-3xl font-bold text-amber-100">
          Digital Library of Classical Islamic Texts
        </h1>
        <p className="max-w-3xl text-xs sm:text-sm text-stone-300 leading-relaxed">
          Study foundational scriptures and classical works spanning Quranic Tafsir, Sahih Hadith collections, <span className="text-emerald-400 font-medium">Usūl al-Fiqh</span> by Imam al-Shafi'i, <span className="text-amber-400 font-medium">Maqāsid al-Sharī‘ah</span> by Imam al-Shatibi, sociological treatises by Ibn Khaldun, and the revivalist ethics of Imam al-Ghazali.
        </p>

        {/* Search & Filter bar */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across treatises, authors, Arabic terms, or themes (e.g. Asabiyyah, Tawhid, Harm, Intentions)..."
              className="w-full rounded-xl border border-stone-800 bg-stone-950 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual Pane: Books Catalog & Deep Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Books List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-400 px-1">
            <span>Classical Treatises ({filteredBooks.length})</span>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setSelectedPassageId(book.passages[0]?.id || '');
                }}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedBook.id === book.id
                    ? 'border-emerald-500/80 bg-emerald-950/40 shadow-md'
                    : 'border-stone-800/80 bg-stone-900/50 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="rounded bg-stone-950 px-2 py-0.5 text-emerald-400 font-medium border border-stone-800">
                    {book.category}
                  </span>
                  <span className="text-stone-400">{book.authorEra}</span>
                </div>

                <h4 className="font-semibold text-sm text-stone-100 group-hover:text-emerald-300">
                  {book.title}
                </h4>
                <p className="font-arabic text-sm text-amber-200/90 font-medium mt-0.5" dir="rtl">
                  {book.arabicTitle}
                </p>
                <p className="text-xs text-stone-400 mt-1 line-clamp-1">{book.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Deep Reader & Commentary (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-stone-800 bg-stone-900/80 p-6 space-y-6 shadow-xl">
          {/* Reader Top Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-950 px-2.5 py-0.5 text-xs text-emerald-400 border border-emerald-800/60 font-semibold">
                  {selectedBook.category}
                </span>
                <span className="text-xs text-stone-400">{selectedBook.authorEra}</span>
              </div>
              <h2 className="font-classical text-xl sm:text-2xl font-bold text-amber-100 mt-1">
                {selectedBook.title}
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">Author: {selectedBook.author}</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Font Resizing */}
              <div className="flex rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs">
                <button
                  onClick={() => setArabicFontSize('text-lg')}
                  className={`px-2 py-0.5 rounded ${arabicFontSize === 'text-lg' ? 'bg-stone-800 text-emerald-400' : 'text-stone-400'}`}
                >
                  A-
                </button>
                <button
                  onClick={() => setArabicFontSize('text-xl')}
                  className={`px-2 py-0.5 rounded ${arabicFontSize === 'text-xl' ? 'bg-stone-800 text-emerald-400' : 'text-stone-400'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setArabicFontSize('text-2xl')}
                  className={`px-2 py-0.5 rounded ${arabicFontSize === 'text-2xl' ? 'bg-stone-800 text-emerald-400' : 'text-stone-400'}`}
                >
                  A+
                </button>
              </div>

              <button
                onClick={copyPassage}
                className="rounded-lg border border-stone-700 bg-stone-800 p-2 text-stone-300 hover:bg-stone-700 transition-colors cursor-pointer"
                title="Copy Text & Commentary"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>

              <button
                onClick={() => {
                  setIsAiDrawerOpen(true);
                  handleAskScholarAI(
                    `Explain the primary legal, linguistic, and spiritual lessons of "${activePassage?.label}" according to classical commentators.`
                  );
                }}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:from-emerald-500 hover:to-teal-600 transition-all cursor-pointer shadow-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Ask Scholar AI</span>
              </button>
            </div>
          </div>

          {/* Chapters / Passages Navigation Pills */}
          {selectedBook.passages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {selectedBook.passages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPassageId(p.id)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                    activePassage?.id === p.id
                      ? 'border-emerald-500 bg-emerald-950 text-emerald-300 font-semibold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Active Passage Body */}
          {activePassage && (
            <div className="space-y-6">
              {/* Vocalized Arabic Script */}
              <div className="rounded-2xl border border-emerald-950 bg-stone-950/90 p-6 sm:p-8 text-right shadow-inner">
                <p
                  className={`font-arabic ${arabicFontSize} text-amber-100 font-normal leading-[2.5] tracking-wide`}
                  dir="rtl"
                >
                  {activePassage.arabic}
                </p>
              </div>

              {/* Transliteration */}
              {activePassage.transliteration && showTransliteration && (
                <div className="rounded-xl border border-stone-800/80 bg-stone-950/40 p-4">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 uppercase tracking-wider mb-1">
                    <span>Phonetic Transliteration</span>
                    <button
                      onClick={() => setShowTransliteration(false)}
                      className="text-stone-500 hover:text-stone-300"
                    >
                      Hide
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-400/90 font-mono italic leading-relaxed">
                    {activePassage.transliteration}
                  </p>
                </div>
              )}

              {/* Translation */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Accurate Translation & Meaning
                </h4>
                <p className="text-sm sm:text-base text-stone-100 leading-relaxed bg-stone-950/40 p-4 rounded-xl border border-stone-800/70">
                  {activePassage.translation}
                </p>
              </div>

              {/* Scholarly Commentary */}
              <div className="rounded-xl border border-amber-900/30 bg-stone-950/60 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  <BookMarked className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Scholarly Sharḥ & Jurisprudential Context</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {activePassage.scholarlyCommentary}
                </p>
              </div>

              {/* Theme Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-xs text-stone-400 mr-1">Epistemic Themes:</span>
                {activePassage.themes.map((theme, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-stone-800/80 px-2.5 py-0.5 text-[11px] text-stone-300 border border-stone-700/60"
                  >
                    #{theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Interactive Scholar Explainer Drawer / Panel */}
          {isAiDrawerOpen && (
            <div className="rounded-2xl border border-emerald-600/60 bg-stone-950 p-5 space-y-4 shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <h4 className="font-classical text-base font-bold text-amber-200">
                    Scholarly Commentary AI • {selectedBook.title}
                  </h4>
                </div>
                <button
                  onClick={() => setIsAiDrawerOpen(false)}
                  className="rounded-lg p-1 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Custom inquiry form */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask any question about grammar, context, Hadith chains, or jurisprudence..."
                    className="flex-1 rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAskScholarAI()}
                  />
                  <button
                    onClick={() => handleAskScholarAI()}
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
                  >
                    {aiLoading ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    <span>Ask</span>
                  </button>
                </div>

                {/* Preset suggestion questions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() =>
                      handleAskScholarAI(
                        'What are the linguistic subtleties and Balaghah (eloquence) in this Arabic text?'
                      )
                    }
                    className="rounded-full bg-stone-900 px-2.5 py-1 text-[11px] text-stone-300 hover:text-emerald-300 border border-stone-800"
                  >
                    Linguistic Eloquence (Balāghah)
                  </button>
                  <button
                    onClick={() =>
                      handleAskScholarAI(
                        'How does this relate to contemporary bioethics and technological dilemmas?'
                      )
                    }
                    className="rounded-full bg-stone-900 px-2.5 py-1 text-[11px] text-stone-300 hover:text-emerald-300 border border-stone-800"
                  >
                    Contemporary Relevance
                  </button>
                  <button
                    onClick={() =>
                      handleAskScholarAI(
                        'Cite 3 classical commentaries (e.g. Ibn Kathir, Al-Nawawi, Ibn Hajar) explaining this.'
                      )
                    }
                    className="rounded-full bg-stone-900 px-2.5 py-1 text-[11px] text-stone-300 hover:text-emerald-300 border border-stone-800"
                  >
                    Classical Commentaries
                  </button>
                </div>
              </div>

              {/* AI Explanation Result */}
              {aiExplanation && (
                <div className="rounded-xl border border-stone-800 bg-stone-900/80 p-4 space-y-2">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Scholarly Exegesis
                  </div>
                  <div className="text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line">
                    {aiExplanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
