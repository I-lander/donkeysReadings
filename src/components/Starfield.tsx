import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  life: number;
}

/**
 * Night-sky background: twinkling stars + an occasional golden shooting star.
 * Replaces CanvasBlock.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let shoot: ShootingStar | null = null;
    let nextShoot = Date.now() + 4000;
    let animationFrameId = 0;

    const seed = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      stars = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.9,
      }));
    };
    seed();
    addEventListener('resize', seed);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() / 1000;
      for (const s of stars) {
        const alpha = 0.18 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.speed * 2 + s.phase));
        ctx.fillStyle = `rgba(238,232,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!shoot && Date.now() > nextShoot) {
        shoot = {
          x: Math.random() * canvas.width * 0.7 + canvas.width * 0.2,
          y: Math.random() * canvas.height * 0.25 + 20,
          life: 1,
        };
        nextShoot = Date.now() + 5000 + Math.random() * 5000;
      }
      if (shoot) {
        shoot.x -= 7;
        shoot.y += 3.7;
        shoot.life -= 0.022;
        if (shoot.life <= 0) {
          shoot = null;
        } else {
          const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x + 46, shoot.y - 24);
          g.addColorStop(0, `rgba(232,194,104,${shoot.life * 0.9})`);
          g.addColorStop(1, 'rgba(232,194,104,0)');
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(shoot.x, shoot.y);
          ctx.lineTo(shoot.x + 46, shoot.y - 24);
          ctx.stroke();
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      removeEventListener('resize', seed);
    };
  }, []);

  return <canvas className="starfield" ref={canvasRef} />;
}
