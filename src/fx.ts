/** Particle effects on a lazily-created full-screen canvas: golden sparkle
 * bursts when a card lands, confetti for celebrations. Honors
 * prefers-reduced-motion by doing nothing. */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
  shape: 'dot' | 'star' | 'ribbon';
  rot: number;
  vr: number;
}

const COLORS = ['#e8c268', '#f4dda0', '#a79cd6', '#9d6b9e', '#efeade'];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let raf = 0;

function reducedMotion(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureCanvas(): CanvasRenderingContext2D | null {
  if (ctx) return ctx;
  canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60;';
  document.body.appendChild(canvas);
  const resize = () => {
    if (!canvas) return;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  resize();
  addEventListener('resize', resize);
  ctx = canvas.getContext('2d');
  return ctx;
}

function drawStar(c: CanvasRenderingContext2D, size: number) {
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? size : size * 0.4;
    const a = (i * Math.PI) / 4;
    c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  c.closePath();
  c.fill();
}

function loop() {
  const c = ctx;
  if (!c || !canvas) return;
  c.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((p) => p.life > 0);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.shape === 'ribbon' ? 0.12 : 0.05;
    p.vx *= 0.985;
    p.rot += p.vr;
    p.life -= p.decay;
    c.save();
    c.globalAlpha = Math.max(0, Math.min(1, p.life));
    c.translate(p.x, p.y);
    c.rotate(p.rot);
    c.fillStyle = p.color;
    if (p.shape === 'ribbon') {
      c.fillRect(-p.size / 2, -p.size, p.size, p.size * 2);
    } else if (p.shape === 'star') {
      c.shadowColor = p.color;
      c.shadowBlur = 6;
      drawStar(c, p.size);
    } else {
      c.shadowColor = p.color;
      c.shadowBlur = 4;
      c.beginPath();
      c.arc(0, 0, p.size, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  }
  raf = particles.length > 0 ? requestAnimationFrame(loop) : 0;
}

function push(batch: Particle[]) {
  if (!ensureCanvas()) return;
  particles.push(...batch);
  if (!raf) raf = requestAnimationFrame(loop);
}

/** Golden burst centered on (x, y) in viewport coordinates. */
export function sparkleBurstAt(x: number, y: number, count = 26) {
  if (reducedMotion()) return;
  push(
    Array.from({ length: count }, (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.4;
      const star = Math.random() < 0.35;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        life: 1,
        decay: 0.014 + Math.random() * 0.02,
        size: star ? 2.5 + Math.random() * 3 : 1 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: star ? 'star' : 'dot',
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
      };
    })
  );
}

/** Celebration rain from the top of the screen. `intensity` scales the count. */
export function confetti(intensity = 1) {
  if (reducedMotion()) return;
  const count = Math.round(70 * intensity);
  push(
    Array.from({ length: count }, (): Particle => {
      const ribbon = Math.random() < 0.6;
      return {
        x: innerWidth * (0.15 + Math.random() * 0.7),
        y: -10 - Math.random() * 60,
        vx: (Math.random() - 0.5) * 2.4,
        vy: 1.5 + Math.random() * 2.5,
        life: 1,
        decay: 0.005 + Math.random() * 0.006,
        size: ribbon ? 3 + Math.random() * 3 : 1.5 + Math.random() * 2.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: ribbon ? 'ribbon' : 'star',
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
      };
    })
  );
}
