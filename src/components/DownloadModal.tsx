import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  Share,
  PlusSquare,
  Check,
  Copy,
  X,
  Code2,
  Terminal,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  Settings,
  HelpCircle,
  Cpu,
  FileCode,
  Compass,
  Bell,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  generateAndroidApkPackageZip,
  DEFAULT_ANDROID_CONFIG,
  AndroidApkPackageConfig,
} from '../utils/androidApkGenerator';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'apk' | 'pwa' | 'code'>('apk');
  const [isGeneratingZip, setIsGeneratingZip] = useState<boolean>(false);
  const [zipSuccess, setZipSuccess] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Android package configuration state
  const [packageId, setPackageId] = useState<string>(DEFAULT_ANDROID_CONFIG.packageId);
  const [appVersion, setAppVersion] = useState<string>(DEFAULT_ANDROID_CONFIG.appVersionName);

  if (!isOpen) return null;

  const currentHostUrl = typeof window !== 'undefined' ? window.location.origin : 'https://almizan.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentHostUrl)}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadApkPackageZip = async () => {
    try {
      setIsGeneratingZip(true);
      setZipSuccess(false);

      const config: Partial<AndroidApkPackageConfig> = {
        packageId: packageId.trim() || DEFAULT_ANDROID_CONFIG.packageId,
        appVersionName: appVersion.trim() || '1.0.0',
        hostUrl: currentHostUrl,
      };

      const zipBlob = await generateAndroidApkPackageZip(config);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `almizan-android-apk-pkg-v${config.appVersionName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate Android APK zip package:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleInstallPWA = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  const bubblewrapCliCommand = `# 1. Install Google Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize Android APK from project manifest
bubblewrap init --manifest="${currentHostUrl}/twa-manifest.json"

# 3. Compile signed/debug APK and AAB
bubblewrap build`;

  const capacitorCliCommand = `# 1. Install Capacitor Android tools
npm install @capacitor/core @capacitor/android @capacitor/cli

# 2. Add Android native platform
npx cap add android

# 3. Compile & run APK in Android emulator or connected device
npx cap run android`;

  const keystoreCommand = `keytool -genkey -v -keystore almizan-release.keystore -alias almizan -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Al-Mizan, OU=Mobile, O=Al-Mizan Foundation, L=Mecca, ST=Makkah, C=SA"`;

  const terminalCommands = `# 1. Clone or extract project repository
cd al-mizan

# 2. Install dependencies
npm install

# 3. Add Gemini API key
echo 'GEMINI_API_KEY="your-gemini-api-key"' > .env

# 4. Start development server
npm run dev`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-auto rounded-2xl border border-emerald-900/80 bg-stone-900 p-5 sm:p-6 shadow-2xl space-y-5 text-stone-100 islamic-glow max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-teal-950 text-amber-300 border border-emerald-500/40 shadow-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-classical text-lg sm:text-xl font-bold text-amber-100">
                  Android APK Package & App Download
                </h3>
                <span className="rounded-full bg-emerald-900/70 border border-emerald-600/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">
                  v1.0 APK
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Package Al-Mizan into a native Android APK (.apk / .aab) or install via PWA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-stone-950 p-1 border border-stone-800 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md border border-emerald-500/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="h-4 w-4 text-emerald-400" />
            <span>Android APK Package</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md border border-emerald-500/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>PWA Direct Install</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 font-semibold transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md border border-emerald-500/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code2 className="h-4 w-4 text-emerald-400" />
            <span>Source Code</span>
          </button>
        </div>

        {/* TAB 1: Android APK Package (.apk) */}
        {activeTab === 'apk' && (
          <div className="space-y-5">
            {/* Package Identity Card */}
            <div className="rounded-xl border border-emerald-800/60 bg-gradient-to-br from-emerald-950/40 via-stone-950 to-stone-900 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-amber-300 font-bold text-xs font-arabic">
                    م
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>Android Package Specification (APK / AAB)</span>
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Standardized package bundle compliant with Android 14 (API 34) & Trusted Web Activity
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-300 bg-stone-900/90 px-2.5 py-1 rounded-lg border border-stone-800">
                  <span className="text-emerald-400 font-mono font-medium">com.almizan.islamicapp</span>
                </div>
              </div>

              {/* Package properties chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="rounded-lg bg-stone-950/70 p-2 border border-stone-800/80">
                  <span className="text-stone-500 block text-[10px]">Architecture</span>
                  <span className="font-medium text-stone-200">Universal (ARM64 / x86)</span>
                </div>
                <div className="rounded-lg bg-stone-950/70 p-2 border border-stone-800/80">
                  <span className="text-stone-500 block text-[10px]">Min / Target SDK</span>
                  <span className="font-medium text-stone-200">API 24 / API 34</span>
                </div>
                <div className="rounded-lg bg-stone-950/70 p-2 border border-stone-800/80">
                  <span className="text-stone-500 block text-[10px]">Sensors Supported</span>
                  <span className="font-medium text-stone-200">Compass & Geolocation</span>
                </div>
                <div className="rounded-lg bg-stone-950/70 p-2 border border-stone-800/80">
                  <span className="text-stone-500 block text-[10px]">Offline Support</span>
                  <span className="font-medium text-stone-200">Cached Astronomical DB</span>
                </div>
              </div>
            </div>

            {/* Main Action 1: Instant Download Complete APK Package ZIP */}
            <div className="rounded-xl border border-amber-900/40 bg-stone-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-amber-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
                    Option 1: Download Complete Android APK Package (.ZIP)
                  </h4>
                </div>
                <span className="text-[11px] text-stone-400">Includes Gradle, Manifest & Scripts</span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                Generates a complete, ready-to-compile Android project package archive containing{' '}
                <code className="text-emerald-300 font-mono">AndroidManifest.xml</code>,{' '}
                <code className="text-emerald-300 font-mono">build.gradle</code>,{' '}
                <code className="text-emerald-300 font-mono">twa-manifest.json</code>, resource strings, colors,
                and one-command compilation scripts (<code className="text-amber-300 font-mono">build-apk.sh</code> /{' '}
                <code className="text-amber-300 font-mono">build-apk.bat</code>).
              </p>

              {/* Package customization options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-medium text-stone-400 block mb-1">
                    Android Package Identifier (applicationId)
                  </label>
                  <input
                    type="text"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="com.almizan.islamicapp"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-stone-400 block mb-1">
                    Release Version Name
                  </label>
                  <input
                    type="text"
                    value={appVersion}
                    onChange={(e) => setAppVersion(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-200 font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDownloadApkPackageZip}
                  disabled={isGeneratingZip}
                  className="flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3 text-xs sm:text-sm font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingZip ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                      <span>Generating Android APK Package Archive...</span>
                    </>
                  ) : zipSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-amber-300" />
                      <span>APK Package ZIP Downloaded Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4" />
                      <span>Download Android APK Package ZIP (Ready to Compile)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action 2: Cloud 1-Click APK Generator (PWABuilder) */}
            <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Option 2: Cloud 1-Click APK Generator (PWABuilder)
                  </h4>
                </div>
                <span className="rounded bg-teal-950 border border-teal-800/60 px-2 py-0.5 text-[10px] text-teal-300">
                  No Software Required
                </span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                Generate and download signed <code className="text-amber-300 font-mono">.apk</code> and{' '}
                <code className="text-amber-300 font-mono">.aab</code> packages directly in your browser using Microsoft
                PWABuilder cloud compiler. Pre-configured with Al-Mizan’s manifest and PNG icons.
              </p>

              <div className="pt-1">
                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-stone-800 hover:bg-stone-700 px-4 py-2 text-xs font-medium text-amber-300 border border-stone-700 transition-colors cursor-pointer"
                >
                  <span>Open PWABuilder with Al-Mizan URL</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Action 3: Sideload & Installation Guide on Android Phones */}
            <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Smartphone className="h-4 w-4" />
                <span>How to Install & Sideload the APK on Android Devices (Samsung, Xiaomi, Pixel, etc.)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-stone-900/80 p-3 border border-stone-800 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-950 text-[10px] border border-emerald-600">
                      1
                    </span>
                    <span>Download or Transfer APK</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Download the compiled <code className="text-stone-200">.apk</code> file onto your Android phone via
                    browser, WhatsApp, Google Drive, or USB.
                  </p>
                </div>

                <div className="rounded-lg bg-stone-900/80 p-3 border border-stone-800 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-950 text-[10px] border border-emerald-600">
                      2
                    </span>
                    <span>Enable Unknown Apps</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    When prompted: Tap <strong>Settings</strong> &rarr; Toggle on{' '}
                    <strong>"Allow from this source"</strong> for your browser or Files app.
                  </p>
                </div>

                <div className="rounded-lg bg-stone-900/80 p-3 border border-stone-800 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-950 text-[10px] border border-emerald-600">
                      3
                    </span>
                    <span>Play Protect Prompt</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    If Google Play Protect displays a caution for self-built APKs, tap{' '}
                    <strong>"More details"</strong> &rarr; <strong>"Install anyway"</strong>.
                  </p>
                </div>

                <div className="rounded-lg bg-stone-900/80 p-3 border border-stone-800 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-950 text-[10px] border border-emerald-600">
                      4
                    </span>
                    <span>Grant Permissions</span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Allow Location for accurate Prayer & Qibla sensor calculations, and Notifications for Adhan audio alerts.
                  </p>
                </div>
              </div>
            </div>

            {/* Action 4: CLI Compilation Snippets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5 font-medium text-stone-300">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Build APK with Google Bubblewrap CLI</span>
                </span>
                <button
                  onClick={() => copyToClipboard(bubblewrapCliCommand, 'bubblewrap')}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  {copiedKey === 'bubblewrap' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'bubblewrap' ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>

              <pre className="rounded-xl border border-stone-800 bg-stone-950 p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {bubblewrapCliCommand}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: PWA Direct Install */}
        {activeTab === 'pwa' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>WebAPK & Progressive Web App Direct Install</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                On Android devices running Chrome or Samsung Internet, installing creates a real native system WebAPK
                registered in Android OS with home screen icon, standalone viewport, offline astronomical database, and
                hardware sensors.
              </p>
            </div>

            {/* If already running in standalone */}
            {isInstalled ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-5 text-center space-y-2">
                <Check className="mx-auto h-8 w-8 text-emerald-400" />
                <h4 className="font-semibold text-sm text-emerald-300">Al-Mizan is Already Installed</h4>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  You are currently enjoying Al-Mizan in standalone app mode with zero browser address bar and full hardware access.
                </p>
              </div>
            ) : isInstallable ? (
              /* Chrome / Android / Windows / Edge direct 1-click install */
              <div className="space-y-3">
                <button
                  onClick={handleInstallPWA}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Click Here to Trigger WebAPK / PWA Install Prompt</span>
                </button>
                <p className="text-center text-[11px] text-stone-400">
                  Adds Al-Mizan directly to your Android App Drawer, home screen, or desktop application launcher.
                </p>
              </div>
            ) : isIOS ? (
              /* iOS Safari instructions */
              <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Smartphone className="h-4 w-4" />
                  <span>How to Install on iPhone / iPad (Safari):</span>
                </div>
                <ol className="space-y-2.5 text-xs text-stone-300">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-700">
                      1
                    </span>
                    <span>
                      Tap the <strong className="text-stone-100">Share</strong> button (
                      <Share className="inline h-3.5 w-3.5 text-emerald-400 mx-1" />
                      ) in the Safari toolbar at the bottom of your screen.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-700">
                      2
                    </span>
                    <span>
                      Scroll down and tap <strong className="text-stone-100">Add to Home Screen</strong> (
                      <PlusSquare className="inline h-3.5 w-3.5 text-emerald-400 mx-1" />
                      ).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-700">
                      3
                    </span>
                    <span>
                      Tap <strong className="text-emerald-400">Add</strong> in the top right. Al-Mizan will appear directly on your home screen!
                    </span>
                  </li>
                </ol>
              </div>
            ) : (
              /* Generic instructions for desktop / other browsers */
              <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Laptop className="h-4 w-4" />
                  <span>Installing on Desktop Browser (Chrome, Edge, Brave):</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  In Google Chrome, Microsoft Edge, or Brave: look for the{' '}
                  <strong className="text-emerald-400">Install icon</strong> (an icon with a computer screen or down arrow)
                  in the right side of the browser's address bar, and click{' '}
                  <strong className="text-stone-100">"Install Al-Mizan"</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Source Code & Local Setup */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span>Export via AI Studio Header</span>
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                In the Google AI Studio builder interface, look at the top navigation bar or menu:
              </p>
              <ul className="text-xs text-stone-400 space-y-1 list-disc list-inside">
                <li>
                  Click the <strong className="text-stone-200">Share / Export</strong> menu button at the top right of your screen.
                </li>
                <li>
                  Select <strong className="text-emerald-400">"Download Project (.zip)"</strong> or{' '}
                  <strong className="text-emerald-400">"Push to GitHub"</strong>.
                </li>
              </ul>
            </div>

            {/* Terminal snippet to run locally */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Run Locally on your Computer</span>
                </span>
                <button
                  onClick={() => copyToClipboard(terminalCommands, 'terminal')}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  {copiedKey === 'terminal' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'terminal' ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>

              <pre className="rounded-xl border border-stone-800 bg-stone-950 p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {terminalCommands}
              </pre>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="border-t border-stone-800 pt-3 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>Al-Mizan Android Package Engine • v1.0.0</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-stone-800 px-4 py-1.5 text-stone-200 hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
