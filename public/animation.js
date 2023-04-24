import React, { useRef, useEffect } from "react";

let canvas;

export function CanvasComponent() {
  const canvasRef = useRef(null);

  useEffect(() => {
    canvas = canvasRef.current;
    canvas.width = innerWidth
    canvas.height = innerHeight
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const animate = () => {
      const timestamp = Date.now()
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
          const particleX = Math.random() * canvas.width
          particles.push(new Particle(particleX, canvas.height, Math.random()*10, "back"));
        }
      }
    
      particles.forEach((particle) => {
        particle.update(ctx, canvas);
      });
    
      requestAnimationFrame(animate);
      return;
    }
    
    animate(ctx);

    // Clean up by canceling the animation frame when the component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas className="canvas" ref={canvasRef}/>;
}

class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = 2;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.radius, this.radius);
    ctx.restore();
  }

  update(ctx, canvas) {
    this.draw(ctx);
    this.y -= this.speed * delta;
    if(this.y < 0){
      this.y = canvas.height
      this.x = Math.random() * canvas.width
      this.radius = Math.random() * 10
    }
  }
}

const particles = [];
const maxParticles = 200;
let delta = 0;
let lastFrameTimeMs = 0;
let lastTextFrameTimeMs = 0;
let maxFPS = 90;
let deltaFactor = 10;

function animate(ctx) {
  const timestamp = Date.now()
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
      particles.push(new Particle(100, 100, 0, "back"));
    }
  }

  particles.forEach((particle) => {
    console.log("x");
    particle.draw(ctx);
  });

  requestAnimationFrame(animate);
  return;
}
