import JSZip from 'jszip';

export interface AndroidApkPackageConfig {
  packageId: string;
  appName: string;
  appNameArabic: string;
  appVersionName: string;
  appVersionCode: number;
  hostUrl: string;
  themeColor: string;
  backgroundColor: string;
}

export const DEFAULT_ANDROID_CONFIG: AndroidApkPackageConfig = {
  packageId: 'com.almizan.islamicapp',
  appName: 'Al-Mizan',
  appNameArabic: 'الميزان',
  appVersionName: '1.0.0',
  appVersionCode: 1,
  hostUrl: typeof window !== 'undefined' ? window.location.origin : 'https://almizan.app',
  themeColor: '#0c0f0d',
  backgroundColor: '#0c0f0d',
};

/**
 * Builds a complete Android Studio / Gradle / TWA / Capacitor ready-to-compile APK project.
 * Returns a JSZip instance that can be exported directly as a .zip file.
 */
export async function generateAndroidApkPackageZip(
  userConfig: Partial<AndroidApkPackageConfig> = {}
): Promise<Blob> {
  const config: AndroidApkPackageConfig = {
    ...DEFAULT_ANDROID_CONFIG,
    ...userConfig,
  };

  const domain = config.hostUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const zip = new JSZip();

  // Root instructions & documentation
  const readmeContent = `# Al-Mizan Android APK Package (v${config.appVersionName})
**Package Identifier:** \`${config.packageId}\`  
**Application Name:** \`${config.appName}\` (${config.appNameArabic})  
**Version Code:** \`${config.appVersionCode}\` | **Version Name:** \`${config.appVersionName}\`  
**Connected Web Host:** \`${config.hostUrl}\`

---

## 🚀 3 Ways to Build & Install Your Android APK

### Method 1: Instant 1-Command CLI Build (Recommended)
You can compile this package into a signed \`.apk\` and \`.aab\` using Google's official Bubblewrap CLI:

\`\`\`bash
# 1. Install Google Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize from the included twa-manifest.json
bubblewrap init --manifest=twa-manifest.json

# 3. Build debug or release APK
bubblewrap build
\`\`\`
The resulting APK will be located in \`./app-release-signed.apk\` or \`./app-debug.apk\`.

---

### Method 2: Android Studio / Gradle CLI
This package includes a standard Android Gradle project structure:

\`\`\`bash
# Build Debug APK
./gradlew assembleDebug

# Build Release APK
./gradlew assembleRelease
\`\`\`
Output APK file path:
\`app/build/outputs/apk/debug/app-debug.apk\`

---

### Method 3: Instant Cloud APK via PWABuilder (Zero Install)
1. Open [https://www.pwabuilder.com](https://www.pwabuilder.com)
2. Enter your live URL: \`${config.hostUrl}\`
3. Click **"Package for Android"**
4. Download the generated \`${config.appName}.apk\` directly to your device!

---

## 📲 How to Sideload & Install APK on Android Devices

1. **Transfer or Download APK:** Send the \`.apk\` file to your Android phone (via WhatsApp, Google Drive, Telegram, or USB cable).
2. **Allow Installation of Unknown Apps:**
   - Tap the \`.apk\` file in your **Files** or **Downloads** app.
   - If prompted: Tap **Settings** -> Enable **"Allow from this source"**.
3. **Play Protect Warning (Self-Signed APKs):**
   - If Google Play Protect warns "Unrecognized app", tap **"More details"** -> **"Install anyway"**.
4. **Grant App Permissions:**
   - **Location:** Required for accurate local astronomical prayer times and Qibla compass bearing.
   - **Notifications:** Required to receive Adhan and prayer reminder audio chimes.

---

## 🔐 Keystore Generation for Google Play Release
To sign your APK with your own private key:

\`\`\`bash
keytool -genkey -v -keystore release.keystore -alias almizan -keyalg RSA -keysize 2048 -validity 10000
\`\`\`
`;

  zip.file('README-APK-GUIDE.md', readmeContent);

  // twa-manifest.json (Bubblewrap & Trusted Web Activity standard)
  const twaManifest = {
    packageId: config.packageId,
    host: domain,
    name: `${config.appName} | Islamic Knowledge & Scholarly AI`,
    launcherName: config.appName,
    display: 'standalone',
    themeColor: config.themeColor,
    navigationColor: config.themeColor,
    backgroundColor: config.backgroundColor,
    enableNotifications: true,
    startUrl: '/',
    iconUrl: `${config.hostUrl}/pwa-512x512.png`,
    maskableIconUrl: `${config.hostUrl}/pwa-maskable-512x512.png`,
    appVersionCode: config.appVersionCode,
    appVersionName: config.appVersionName,
    shortcuts: [
      {
        name: 'Prayer Times',
        short_name: 'Prayers',
        url: '/#prayers',
        icon: `${config.hostUrl}/pwa-192x192.png`,
      },
      {
        name: 'Classical Library',
        short_name: 'Library',
        url: '/#library',
        icon: `${config.hostUrl}/pwa-192x192.png`,
      },
      {
        name: 'Scholarly Engine',
        short_name: 'Scholar',
        url: '/#scholar',
        icon: `${config.hostUrl}/pwa-192x192.png`,
      },
    ],
    generatorApp: 'bubblewrap-cli',
    webManifestUrl: `${config.hostUrl}/manifest.webmanifest`,
    fallbackType: 'customtabs',
    features: {
      locationDelegation: {
        enabled: true,
      },
      playBilling: {
        enabled: false,
      },
    },
    alphaDependencies: {
      enabled: false,
    },
  };
  zip.file('twa-manifest.json', JSON.stringify(twaManifest, null, 2));

  // capacitor.config.json
  const capacitorConfig = {
    appId: config.packageId,
    appName: config.appName,
    webDir: 'dist',
    bundledWebRuntime: false,
    server: {
      url: config.hostUrl,
      cleartext: true,
      androidScheme: 'https',
    },
    android: {
      allowMixedContent: true,
      captureInput: true,
      webContentsDebuggingEnabled: true,
    },
    plugins: {
      SplashScreen: {
        launchShowDuration: 1500,
        backgroundColor: config.backgroundColor,
        androidScaleType: 'CENTER_CROP',
      },
    },
  };
  zip.file('capacitor.config.json', JSON.stringify(capacitorConfig, null, 2));

  // Android project root files
  zip.file(
    'build.gradle',
    `// Top-level build file for Al-Mizan Android Application
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`
  );

  zip.file(
    'settings.gradle',
    `rootProject.name = "${config.appName}"
include ':app'
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
`
  );

  // App module build.gradle
  const appBuildGradle = `plugins {
    id 'com.android.application'
}

android {
    namespace '${config.packageId}'
    compileSdk 34

    defaultConfig {
        applicationId "${config.packageId}"
        minSdk 24
        targetSdk 34
        versionCode ${config.appVersionCode}
        versionName "${config.appVersionName}"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        
        manifestPlaceholders = [
            hostName: "${domain}",
            defaultUrl: "${config.hostUrl}"
        ]
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            applicationIdSuffix ".debug"
            debuggable true
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
    implementation 'androidx.browser:browser:1.7.0'
    implementation 'androidx.core:core:1.12.0'
}
`;
  zip.file('app/build.gradle', appBuildGradle);

  // AndroidManifest.xml
  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageId}">

    <!-- Permissions required for Islamic Prayer calculation, Qibla compass & Adhan notifications -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <!-- Sensor feature for physical Qibla magnetic compass -->
    <uses-feature android:name="android.hardware.sensor.compass" android:required="false" />
    <uses-feature android:name="android.hardware.location.gps" android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AlMizan"
        android:usesCleartextTraffic="true">

        <meta-data
            android:name="asset_statements"
            android:resource="@string/asset_statements" />

        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:label="@string/app_name"
            android:theme="@style/Theme.AlMizan"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- TWA Intent Filter for direct deep-linking -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="${domain}" />
            </intent-filter>

            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="${config.hostUrl}" />
            <meta-data
                android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
                android:resource="@color/colorPrimaryDark" />
            <meta-data
                android:name="android.support.customtabs.trusted.NAVIGATION_BAR_COLOR"
                android:resource="@color/navigationBarColor" />
        </activity>
    </application>
</manifest>
`;
  zip.file('app/src/main/AndroidManifest.xml', androidManifest);

  // Resources
  zip.file(
    'app/src/main/res/values/strings.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${config.appName}</string>
    <string name="app_name_arabic">${config.appNameArabic}</string>
    <string name="package_name">${config.packageId}</string>
    <string name="asset_statements">[{
        \\"relation\\": [\\"delegate_permission/common.handle_all_urls\\"],
        \\"target\\": {
            \\"namespace\\": \\"android_app\\",
            \\"package_name\\": \\"${config.packageId}\\",
            \\"sha256_cert_fingerprints\\": [\\"14:6D:E9:DE:8F:F1:E7:0F:06:43:D1:04:F7:C8:12:33:E3:65:21:49:9F:92:61:42:BB:21:B3:68:C3:9C:FB:25\\"]
        }
    }]</string>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values/colors.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#064e3b</color>
    <color name="colorPrimaryDark">#0c0f0d</color>
    <color name="colorAccent">#eab308</color>
    <color name="navigationBarColor">#0c0f0d</color>
    <color name="splashBackgroundColor">#0c0f0d</color>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values/styles.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.AlMizan" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
        <item name="android:statusBarColor">@color/colorPrimaryDark</item>
        <item name="android:navigationBarColor">@color/navigationBarColor</item>
        <item name="android:windowBackground">@color/splashBackgroundColor</item>
    </style>
</resources>
`
  );

  // Build scripts
  zip.file(
    'build-apk.sh',
    `#!/bin/bash
set -e
echo "=========================================================="
echo "  Building Al-Mizan Android APK Package (${config.packageId})"
echo "=========================================================="

# Check if bubblewrap is installed
if command -v bubblewrap &> /dev/null; then
    echo "Using Bubblewrap CLI to build APK..."
    bubblewrap build
    echo "Build Complete! Check for app-release-signed.apk"
    exit 0
fi

# Fallback to Gradle
if [ -f "./gradlew" ]; then
    echo "Compiling via Gradle Wrapper..."
    chmod +x gradlew
    ./gradlew assembleDebug
    echo "Build Complete! Debug APK generated at:"
    echo "app/build/outputs/apk/debug/app-debug.apk"
    exit 0
fi

echo "Please install @bubblewrap/cli via: npm install -g @bubblewrap/cli"
echo "Or open this directory in Android Studio."
`
  );

  zip.file(
    'build-apk.bat',
    `@echo off
echo ==========================================================
echo   Building Al-Mizan Android APK Package (%~dp0)
echo ==========================================================

where bubblewrap >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Bubblewrap CLI...
    call bubblewrap build
    echo Build Complete! Check for app-release-signed.apk
    pause
    exit /b 0
)

if exist "gradlew.bat" (
    echo Compiling via Gradle Wrapper...
    call gradlew.bat assembleDebug
    echo Build Complete! Debug APK generated at app\\build\\outputs\\apk\\debug\\app-debug.apk
    pause
    exit /b 0
)

echo Please install bubblewrap: npm install -g @bubblewrap/cli
pause
`
  );

  zip.file(
    'generate-keystore.sh',
    `#!/bin/bash
echo "Generating release keystore for ${config.packageId}..."
keytool -genkey -v -keystore release.keystore -alias almizan -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Al-Mizan, OU=Mobile, O=Al-Mizan Foundation, L=Mecca, ST=Makkah, C=SA"
echo "Keystore created: release.keystore"
`
  );

  // Digital Asset Links template
  zip.file(
    'assetlinks.json',
    JSON.stringify(
      [
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: {
            namespace: 'android_app',
            package_name: config.packageId,
            sha256_cert_fingerprints: [
              '14:6D:E9:DE:8F:F1:E7:0F:06:43:D1:04:F7:C8:12:33:E3:65:21:49:9F:92:61:42:BB:21:B3:68:C3:9C:FB:25',
            ],
          },
        },
      ],
      null,
      2
    )
  );

  // Generate the zip blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  return zipBlob;
}
