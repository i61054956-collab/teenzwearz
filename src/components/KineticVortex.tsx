import React, { useEffect, useRef } from 'react';

export function KineticVortex() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse positioning
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particle class simulating orbital micro-motors (e.g., watch gears & starlight filaments)
    interface Particle {
      x: number;
      y: number;
      originalX: number;
      originalY: number;
      angle: number;
      speed: number;
      radius: number;
      distance: number;
      color: string;
      pulseSpeed: number;
      seed: number;
    }

    const particles: Particle[] = [];
    const particleCount = 220;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * Math.min(width, height) * 0.45;
      const x = width / 2 + Math.cos(angle) * distance;
      const y = height / 2 + Math.sin(angle) * distance;
      
      // Gorgeous premium glowing color palette (forest green, mint green, and luxury gold strings)
      const colors = [
        'rgba(89, 122, 88, 0.45)',  // Forest
        'rgba(164, 255, 162, 0.6)',  // Mint
        'rgba(212, 175, 55, 0.5)',   // Metallic Gold Accord
        'rgba(27, 61, 31, 0.35)',    // Deep Emerald
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push({
        x,
        y,
        originalX: x,
        originalY: y,
        angle,
        speed: 0.002 + Math.random() * 0.006,
        radius: 1.0 + Math.random() * 2.2,
        distance,
        color,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        seed: Math.random() * 100,
      });
    }

    // Ribbon lines that form beautiful geometric networks connecting particles
    let time = 0;

    const renderLoop = () => {
      time += 0.01;
      
      // Slightly fade previous frames to create long aesthetic light streaks
      ctx.fillStyle = 'rgba(7, 13, 8, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Lerp mouse coordinates to make movement look smooth
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw beautiful structural concentric neon orbits
      ctx.strokeStyle = 'rgba(89, 122, 88, 0.06)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * 140, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw gorgeous central glowing ambient nebula core (representing the black-hole gravity well!)
      const nebulaGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 380);
      nebulaGrad.addColorStop(0, 'rgba(18, 46, 24, 0.35)');
      nebulaGrad.addColorStop(0.3, 'rgba(8, 26, 12, 0.15)');
      nebulaGrad.addColorStop(0.6, 'rgba(5, 11, 6, 0.05)');
      nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 380, 0, Math.PI * 2);
      ctx.fill();

      // Draw an inner dense glowing high-energy event horizon core
      const eventHorizon = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 70);
      eventHorizon.addColorStop(0, 'rgba(164, 255, 162, 0.45)');
      eventHorizon.addColorStop(0.15, 'rgba(212, 175, 55, 0.25)');
      eventHorizon.addColorStop(0.5, 'rgba(89, 122, 88, 0.1)');
      eventHorizon.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = eventHorizon;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 70, 0, Math.PI * 2);
      ctx.fill();

      // Add screening composite mode for gorgeous glowing additive overlaps
      ctx.globalCompositeOperation = 'screen';

      particles.forEach((p, idx) => {
        // Orbit motion
        p.angle += p.speed;
        
        let targetX = centerX + Math.cos(p.angle) * p.distance;
        let targetY = centerY + Math.sin(p.angle) * p.distance;

        // Interactive mouse gravity warp (Video effect #2!)
        let dX, dY;
        if (mouse.isHovered) {
          dX = mouse.x - p.x;
          dY = mouse.y - p.y;
        } else {
          // If no mouse interaction, warp slightly around center to simulate a dynamic core
          const pulsX = centerX + Math.cos(time * 0.5) * 80;
          const pulsY = centerY + Math.sin(time * 0.5) * 80;
          dX = pulsX - p.x;
          dY = pulsY - p.y;
        }

        const distToWarp = Math.sqrt(dX * dX + dY * dY);
        if (distToWarp < 250) {
          const force = (250 - distToWarp) / 250;
          targetX += (dX / distToWarp) * force * 110;
          targetY += (dY / distToWarp) * force * 110;
        }

        // Apply noise oscillation
        const noiseX = Math.sin(time * 1.5 + p.seed) * 5;
        const noiseY = Math.cos(time * 1.5 + p.seed) * 5;

        p.x += (targetX + noiseX - p.x) * 0.06;
        p.y += (targetY + noiseY - p.y) * 0.06;

        // Pulse the size
        const activeRadius = p.radius * (1.0 + Math.sin(time * p.pulseSpeed + p.seed) * 0.35);

        // Draw particle dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, activeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw geometric connections to nearby particles
        if (idx % 6 === 0) {
          for (let j = 0; j < particles.length; j += 15) {
            if (idx === j) continue;
            const other = particles[j];
            const connX = other.x - p.x;
            const connY = other.y - p.y;
            const distanceBetween = Math.sqrt(connX * connX + connY * connY);

            if (distanceBetween < 110) {
              const alpha = (110 - distanceBetween) / 110 * 0.12;
              ctx.strokeStyle = `rgba(164, 255, 162, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }
      });

      ctx.globalCompositeOperation = 'source-over';
      animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 pointer-events-auto"
      id="kinetic-particle-vortex"
    />
  );
}
