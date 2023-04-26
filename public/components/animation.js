import React, { useRef, useEffect } from "react";

let canvas;
let particles = [];
const maxParticles = 200;
let delta = 0;
let lastFrameTimeMs = 0;
let lastTextFrameTimeMs = 0;
let maxFPS = 90;
let deltaFactor = 10;

export function CanvasComponent() {
  const canvasRef = useRef(null);

  useEffect(() => {
    canvas = canvasRef.current;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    addEventListener("resize", (event) => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      particles = [];
    });

    const animate = () => {
      const timestamp = Date.now();
      lastTextFrameTimeMs = timestamp;

      if (timestamp < lastFrameTimeMs + 1000 / maxFPS) {
        requestAnimationFrame(animate);
        return;
      }

      delta = (timestamp - lastFrameTimeMs) / deltaFactor;
      lastFrameTimeMs = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length < maxParticles) {
        for (let i = 0; i < maxParticles; i++) {
          const particleX = Math.random() * canvas.width;
          const particleY = Math.random() * canvas.height;
          particles.push(new Particle(particleX, particleY));
        }
      }

      particles.forEach((particle) => {
        particle.update(ctx, canvas);
      });

      requestAnimationFrame(animate);
      return;
    };

    animate(ctx);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas className="canvas" ref={canvasRef} />;
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.maxRadius = 2;
    this.radius = Math.random() * this.maxRadius;
    this.opacity = Math.random();
    this.color = `hsla(1, 0%, 100%, ${this.opacity})`;
    this.speedFactor = 0.5;
    this.speed = Math.random() * this.speedFactor;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  update(ctx, canvas) {
    this.draw(ctx);
    this.y -= this.speed;
    if (this.y < 0) {
      this.x = Math.random() * canvas.width;
      this.radius = Math.random() * this.maxRadius;
      this.y = canvas.height + this.radius;
      this.hue = Math.random();
      this.speed = Math.random() * this.speedFactor;
    }
  }
}
