import { useEffect, useRef } from 'react';

const MAX_PARTICLES = 200;
const MAX_FPS = 90;
const DELTA_FACTOR = 10;

class Particle {
  x: number;
  y: number;
  maxRadius = 2;
  radius: number;
  opacity: number;
  color: string;
  speedFactor = 0.5;
  speed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * this.maxRadius;
    this.opacity = Math.random();
    this.color = `hsla(1, 0%, 100%, ${this.opacity})`;
    this.speed = Math.random() * this.speedFactor;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.draw(ctx);
    this.y -= this.speed;
    if (this.y < 0) {
      this.x = Math.random() * canvas.width;
      this.radius = Math.random() * this.maxRadius;
      this.y = canvas.height + this.radius;
      this.speed = Math.random() * this.speedFactor;
    }
  }
}

export function CanvasBlock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    let particles: Particle[] = [];
    let delta = 0;
    let lastFrameTimeMs = 0;
    let animationFrameId = 0;

    const onResize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      particles = [];
    };
    addEventListener('resize', onResize);

    const animate = () => {
      const timestamp = Date.now();

      if (timestamp < lastFrameTimeMs + 1000 / MAX_FPS) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      delta = (timestamp - lastFrameTimeMs) / DELTA_FACTOR;
      void delta;
      lastFrameTimeMs = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length < MAX_PARTICLES) {
        for (let i = 0; i < MAX_PARTICLES; i++) {
          const particleX = Math.random() * canvas.width;
          const particleY = Math.random() * canvas.height;
          particles.push(new Particle(particleX, particleY));
        }
      }

      particles.forEach((particle) => {
        particle.update(ctx, canvas);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas className="canvas" ref={canvasRef} />;
}
