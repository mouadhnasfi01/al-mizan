// Audio alerts using Web Audio API for chime/Adhan tones, and browser Notifications API

class AudioAlertSystem {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Melodic eastern modal chime (Maqam Rast / Bayati harmonic tones)
  public playAdhanChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Notes roughly corresponding to G3, C4, D4, Eb4, F4, G4 in gentle succession
      const notes = [
        { freq: 196.0, start: 0.0, dur: 0.7 },
        { freq: 261.6, start: 0.5, dur: 0.8 },
        { freq: 293.6, start: 1.1, dur: 0.9 },
        { freq: 311.1, start: 1.8, dur: 1.2 },
        { freq: 349.2, start: 2.6, dur: 1.0 },
        { freq: 392.0, start: 3.3, dur: 2.0 },
      ];

      notes.forEach(({ freq, start, dur }) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);

        // Soft bell-like envelope
        gain.gain.setValueAtTime(0.001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.22, now + start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur + 0.1);
      });
    } catch (e) {
      console.warn('Audio chime failed:', e);
    }
  }

  // Click/bead feedback for Tasbih
  public playTasbihClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);

      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    } catch (_e) {
      // ignore
    }
  }

  // Request browser notification permission
  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const res = await Notification.requestPermission();
      return res === 'granted';
    }
    return false;
  }

  // Trigger prayer time alert
  public sendPrayerAlert(prayerName: string, time: string) {
    this.playAdhanChime();
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Time for ${prayerName} (${time})`, {
        body: `Hayya 'ala as-Salah - Come to Prayer. Time for ${prayerName} prayer.`,
        icon: '/favicon.ico',
      });
    }
  }
}

export const audioAlertSystem = new AudioAlertSystem();
