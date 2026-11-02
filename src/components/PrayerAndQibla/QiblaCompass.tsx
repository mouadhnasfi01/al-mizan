import React, { useState, useEffect } from 'react';
import { Compass, RotateCw, CheckCircle, Navigation2 } from 'lucide-react';
import { LocationCoordinates, QiblaInfo } from '../../types';
import { calculateQibla } from '../../utils/prayerCalculations';

interface QiblaCompassProps {
  coords: LocationCoordinates;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ coords }) => {
  const [qibla, setQibla] = useState<QiblaInfo>(() => calculateQibla(coords));
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  useEffect(() => {
    setQibla(calculateQibla(coords));
  }, [coords]);

  // Attempt to listen to real device orientation on mobile devices
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading on iOS, or alpha on Android
      let heading: number | null = null;
      if ((e as any).webkitCompassHeading) {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(Math.round(heading));
        setHasCompassSensor(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Request iOS permission if needed
  const requestCompassPermission = async () => {
    if (
      typeof (DeviceOrientationEvent as any) !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setHasCompassSensor(true);
        }
      } catch (err) {
        console.warn('Orientation permission error:', err);
      }
    }
  };

  // Relative angle between device heading and Kaaba
  const relativeAngle = (qibla.bearing - deviceHeading + 360) % 360;
  const isAligned = relativeAngle <= 5 || relativeAngle >= 355;

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-emerald-400" />
            <h3 className="font-classical text-lg font-bold text-amber-100">
              Qibla Direction (اتجاه القبلة)
            </h3>
          </div>
          <p className="text-xs text-stone-400">
            Great Circle bearing toward Kaaba al-Musharrafah in Makkah
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-lg bg-emerald-950/80 px-2.5 py-1 text-emerald-300 font-mono border border-emerald-800/60">
            {qibla.bearing}° {qibla.compassDirection}
          </span>
          <span className="rounded-lg bg-stone-800 px-2.5 py-1 text-stone-300 font-mono">
            {qibla.distanceKm.toLocaleString()} km away
          </span>
        </div>
      </div>

      {/* Main Interactive Compass Dial */}
      <div className="relative flex flex-col items-center justify-center py-4">
        {/* Glow halo when aligned */}
        <div
          className={`relative flex h-72 w-72 sm:h-80 sm:w-80 items-center justify-center rounded-full border-4 transition-all duration-300 ${
            isAligned
              ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_50px_rgba(16,185,129,0.35)]'
              : 'border-stone-800 bg-stone-950/80 shadow-2xl'
          }`}
        >
          {/* Compass Rose Dial (rotates with device heading) */}
          <div
            className="absolute inset-0 rounded-full transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${-deviceHeading}deg)` }}
          >
            {/* Cardinal points */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-rose-400">N</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-stone-400">S</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">E</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">W</div>

            {/* Degree ticks */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 h-full w-[1px] -translate-x-1/2 pointer-events-none"
                style={{ transform: `rotate(${i * 15}deg)` }}
              >
                <div className={`mx-auto ${i % 6 === 0 ? 'h-3 w-1 bg-stone-500' : 'h-1.5 w-[1px] bg-stone-700'}`} />
              </div>
            ))}

            {/* The Holy Kaaba Beacon Marker at Qibla bearing */}
            <div
              className="absolute inset-0 flex items-start justify-center"
              style={{ transform: `rotate(${qibla.bearing}deg)` }}
            >
              <div className="relative -top-3 flex flex-col items-center group cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 border-2 border-amber-400 shadow-lg gold-glow text-amber-300">
                  <div className="h-4 w-4 bg-stone-950 border border-amber-400 rounded-sm flex items-center justify-center">
                    <span className="h-1 w-1 rounded-full bg-amber-400" />
                  </div>
                </div>
                <span className="mt-1 rounded bg-stone-950/90 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/50">
                  KAABA
                </span>
              </div>
            </div>
          </div>

          {/* Central Fixed Device Heading Needle */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-14 w-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <div className="h-4 w-4 rounded-full bg-stone-100 border-2 border-emerald-500 shadow-md my-0.5" />
            <div className="h-10 w-0.5 bg-stone-600 rounded-full" />
          </div>

          {/* Alignment status notification */}
          {isAligned && (
            <div className="absolute bottom-6 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white shadow-lg flex items-center gap-1.5 animate-bounce">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Facing the Kaaba!</span>
            </div>
          )}
        </div>

        {/* Live Heading & Manual Rotation Simulator Slider */}
        <div className="mt-6 w-full max-w-xs space-y-2 text-center">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Device Orientation</span>
            <span className="font-mono text-emerald-400">{deviceHeading}°</span>
          </div>

          <input
            type="range"
            min="0"
            max="359"
            value={deviceHeading}
            onChange={(e) => setDeviceHeading(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 cursor-pointer"
          />

          <p className="text-[11px] text-stone-400">
            {hasCompassSensor
              ? 'Using live device magnetometer'
              : 'Rotate your device, or drag slider to simulate compass orientation'}
          </p>

          {!hasCompassSensor && (
            <button
              onClick={requestCompassPermission}
              className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
            >
              <Navigation2 className="h-3 w-3" />
              <span>Enable mobile compass sensor</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
