import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Google GenAI client (Server-Side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Android Trusted Web Activity & APK Digital Asset Links Verification
app.get('/.well-known/assetlinks.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.resolve(__dirname, 'public', '.well-known', 'assetlinks.json'));
});

app.get('/twa-manifest.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.resolve(__dirname, 'public', 'twa-manifest.json'));
});

// Endpoint 1: The Islamic Universal Knowledge & Scholarly Synthesis Engine
app.post('/api/gemini/scholar-engine', async (req, res) => {
  try {
    const { query, field, scholarlyFocus, depth } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const systemInstruction = `You are Al-Mizan Universal Islamic Knowledge & Scholarly Epistemology Engine.
Your purpose is to collect, synthesize, and filter human knowledge (from classical antiquity, Islamic golden age, and modern discoveries) through authentic Islamic scholarly frameworks, primary religious sources, and ethical epistemologies.

CRITICAL METHODOLOGICAL GUIDELINES:
1. Primary Sources First: Always anchor analysis in authentic Qur'anic Ayat (provide Surah name, chapter and verse number, Arabic key phrase if relevant) and Authentic Hadith (cite primary source: Sahih al-Bukhari, Sahih Muslim, Sunan, Muwatta, with authenticity/Isnad note).
2. Epistemological Frameworks:
   - Usul al-Fiqh: Apply Qawa'id Fiqhiyyah (Legal Maxims such as 'Harm must be removed' [La darar wa la dirar], 'Certainty is not overruled by doubt' [Al-yaqinu la yazulu bish-shakk], 'Acts are judged by intentions', 'Hardship begets ease').
   - Maqasid al-Shariah (The 5 Essential Objectives): Systematically evaluate the preservation of: Faith/Deen, Life/Nafs, Intellect/'Aql, Lineage/Honor/Nasl, and Wealth/Mal.
   - Harmony of Reason & Revelation: Reflect the classical methodology of scholars (e.g. Al-Ghazali, Ibn Khaldun, Ibn Rushd, Ibn Taymiyyah, Al-Shatibi, Al-Biruni) demonstrating that sound reason ('Aql) and authentic revelation (Naql) do not contradict.
3. Epistemic Classification: Explicitly classify key claims:
   - Qat'i (Definitive in transmission and meaning)
   - Dhanni (Probabilistic, open to ijtihad/scholarly difference)
   - Empirical / Scientific Fact vs Theoretical Hypothesis.
4. Civilizational & Historical Context: Trace the lineage of the concept from classical Islamic civilization through contemporary scientific/philosophical consensus.
5. Tone: Dignified, intellectually rigorous, reverent towards sacred texts, objective, balanced across valid mainstream schools of jurisprudence (Hanafi, Maliki, Shafi'i, Hanbali), and actionable for modern life.

Format your response strictly as valid JSON matching this schema:
{
  "title": "Comprehensive Title of the Synthesis",
  "summary": "Clear, concise high-level synthesis (2-3 sentences)",
  "epistemicClassification": {
    "level": "Qat'i (Definitive) | Dhanni (Probabilistic) | Empirical Observation | Scientific Consensus",
    "rationale": "Brief reason for this classification"
  },
  "primarySources": [
    {
      "type": "Qur'an" | "Hadith",
      "citation": "Surah Al-Baqarah 2:164 or Sahih al-Bukhari 6412",
      "arabic": "Arabic text or key phrase",
      "translation": "Accurate English translation",
      "contextAndTafsir": "Contextual meaning according to classical commentators (Ibn Kathir, As-Sa'di, Al-Qurtubi)"
    }
  ],
  "scholarlyFrameworks": {
    "maqasidImpact": [
      {
        "objective": "Preservation of Deen (Faith) | Nafs (Life) | 'Aql (Intellect) | Nasl (Lineage) | Mal (Wealth)",
        "analysis": "How this issue impacts this objective"
      }
    ],
    "usulMaximsApplied": [
      {
        "maxim": "Arabic & English legal maxim",
        "application": "How classical jurists apply this principle here"
      }
    ],
    "classicalScholarsViews": [
      {
        "scholar": "e.g., Imam Al-Ghazali / Ibn Khaldun / Al-Shatibi / Ibn Rushd",
        "era": "e.g., 5th Century AH / 11th Century CE",
        "insight": "Historical perspective or treatise reference"
      }
    ]
  },
  "modernSynthesisAndContemporaryFiqh": "Analysis of modern discoveries, institutional rulings (e.g., International Islamic Fiqh Academy), and real-world implications.",
  "actionableGuidance": [
    "Practical, ethical advice for individuals and society today"
  ]
}`;

    const prompt = `Field: ${field || 'General'}\nScholarly Focus: ${scholarlyFocus || 'Comprehensive'}\nInquiry Depth: ${depth || 'Deep'}\n\nUser Question/Topic: "${query}"\n\nProvide a full scholarly epistemological analysis formatted strictly as JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ result: parsed });
  } catch (err: any) {
    console.error('Error in /api/gemini/scholar-engine:', err);
    res.status(500).json({
      error: 'Failed to synthesize scholarly response',
      details: err.message,
    });
  }
});

// Endpoint 2: Global Daily News Digest with Islamic Ethical Analysis & Google Search Grounding
app.post('/api/gemini/news-digest', async (req, res) => {
  try {
    const { category, customQuery } = req.body;

    const topic = customQuery || category || 'World Geopolitics, AI Technology, Global Economy, and Climate';

    const systemInstruction = `You are Al-Mizan Global News & Information Intelligence Synthesizer.
Your role is to collect and summarize real-world current news across all fields and sectors (Geopolitics, Economics & Islamic Finance, Deep Tech/AI, Medicine & Bioethics, Environment & Khilafah Stewardship, Society & Humanitarian affairs) and critically filter each event through an authentic Islamic ethical mindset and scholarly principles.

For each major news story or synthesis:
1. State the factual verified news summary clearly.
2. Provide the Islamic Ethical Lens & Maqasid al-Shariah evaluation (e.g. justice ['Adl], human dignity, prohibition of harm, financial equity).
3. Connect with a relevant Classical / Scriptural Wisdom (Qur'an verse or Hadith principle).
4. Provide constructive takeaway for ethical global citizens.`;

    const prompt = `Provide the latest current news developments and information summary regarding: "${topic}".
Structure the response with 3 to 4 distinct, significant news stories or comprehensive thematic developments.
For each item, include:
- Title
- Category/Sector
- Summary (factual events and key data)
- Islamic Scholarly & Ethical Lens (evaluation based on justice, human welfare, and ethical stewardship)
- Scriptural Reference (Qur'anic ayah or Hadith concept relevant to this development)
- Global & Societal Implications`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract sources
    const sources = groundingChunks
      .filter((c: any) => c.web?.uri)
      .map((c: any) => ({
        title: c.web?.title || 'Source Reference',
        url: c.web?.uri,
      }))
      .slice(0, 8);

    return res.json({
      text,
      sources,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/news-digest:', err);
    res.status(500).json({
      error: 'Failed to retrieve news digest',
      details: err.message,
    });
  }
});

// Endpoint 3: Classical Library Explainer & Cross-Referencer
app.post('/api/gemini/library-ask', async (req, res) => {
  try {
    const { textTitle, author, passage, question } = req.body;

    const systemInstruction = `You are a specialist in Islamic Classical Religious Texts, Hadith methodology, and Classical Arabic Philology (Balaghah, Sarf, Nahw, Usul).
Your job is to assist students and researchers in understanding classical texts (Qur'an, Hadith collections, and treatises by scholars like Al-Ghazali, Ibn Khaldun, Al-Shatibi, Ibn Rushd, Al-Shafi'i).
Explain linguistic nuances, historical context (Asbab al-Nuzul or Asbab al-Wurud), theological significance, and how classical commentators interpreted the passage.`;

    const prompt = `Classical Work: "${textTitle}" by ${author || 'Classical Scholar'}
Selected Passage / Subject:
"${passage || 'General work context'}"

Student's Question:
"${question}"

Provide a rich, educational scholarly explanation with citations to classical commentaries and cross-references.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      explanation: response.text || 'No explanation generated.',
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/library-ask:', err);
    res.status(500).json({
      error: 'Failed to generate library explanation',
      details: err.message,
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
