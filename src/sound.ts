/** Synthesized sound effects (WebAudio, no assets). Everything is deliberately
 * quiet: the sounds are texture, not notification. A global toggle is persisted
 * in localStorage under `dr_sound`. */

const KEY = 'dr_sound';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let scribble: { src: AudioBufferSourceNode; gain: GainNode } | null = null;

function enabled(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function soundOn(): boolean {
  return enabled();
}

export function toggleSound(): boolean {
  const next = !enabled();
  try {
    localStorage.setItem(KEY, next ? 'on' : 'off');
  } catch {
    // storage unavailable: the toggle just won't persist
  }
  if (!next) sfx.scribbleStop();
  return next;
}

function audio(): AudioContext | null {
  if (!enabled()) return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Mobile browsers require a user gesture before audio can play: unlock once. */
export function initSound() {
  const unlock = () => {
    audio();
    removeEventListener('pointerdown', unlock);
  };
  addEventListener('pointerdown', unlock);
}

interface ToneOpts {
  type?: OscillatorType;
  gain?: number;
  when?: number;
  glideTo?: number;
}

function tone(
  freq: number,
  dur: number,
  { type = 'sine', gain = 0.08, when = 0, glideTo }: ToneOpts = {}
) {
  const ac = audio();
  if (!ac || !master) return;
  const t = ac.currentTime + when;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function swish(dur: number, from: number, to: number, gain: number, when = 0) {
  const ac = audio();
  if (!ac || !master) return;
  const t = ac.currentTime + when;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, dur);
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.1;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t);
}

/** A-minor-ish mystical ladder for the three card flips. */
const FLIP_NOTES = [440, 523.25, 659.25];

export const sfx = {
  /** Soft click for taps. */
  pop() {
    tone(340, 0.07, { type: 'triangle', gain: 0.05, glideTo: 190 });
  },

  /** Shuffle start: a long airy whoosh. */
  whoosh() {
    swish(0.6, 500, 2000, 0.1);
    swish(0.5, 400, 1400, 0.07, 0.25);
  },

  /** Card i (0-2) lands face up: paper swish + rising chime. */
  flip(i: number) {
    swish(0.16, 700, 2600, 0.09);
    const f = FLIP_NOTES[i] ?? FLIP_NOTES[2];
    tone(f, 0.5, { type: 'triangle', gain: 0.055, when: 0.05 });
    tone(f * 2, 0.35, { gain: 0.02, when: 0.05 });
  },

  /** The reading is fully written: small golden arpeggio. */
  complete() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(f, 0.7, { gain: 0.045, when: i * 0.09 })
    );
  },

  /** Celebration shimmer (streak up, credit unlocked). */
  sparkle() {
    for (let i = 0; i < 6; i++) {
      tone(1100 + Math.random() * 1400, 0.4, { gain: 0.03, when: i * 0.06 });
    }
  },

  /** Quill-on-parchment loop while the reading is being typed. */
  scribbleStart() {
    const ac = audio();
    if (!ac || !master || scribble) return;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 1.2);
    src.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2600;
    filter.Q.value = 0.9;
    const g = ac.createGain();
    g.gain.value = 0.014;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 9;
    const lfoGain = ac.createGain();
    lfoGain.gain.value = 0.008;
    lfo.connect(lfoGain).connect(g.gain);
    src.connect(filter).connect(g).connect(master);
    src.start();
    lfo.start();
    scribble = { src, gain: g };
  },

  scribbleStop() {
    if (!scribble || !ctx) return;
    const { src, gain } = scribble;
    scribble = null;
    gain.gain.setTargetAtTime(0, ctx.currentTime, 0.06);
    setTimeout(() => src.stop(), 250);
  },
};
