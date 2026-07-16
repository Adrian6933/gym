import React from "react";

export default function PRConfetti({ trigger }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#84cc16", "#06b6d4", "#f43f5e", "#f59e0b", "#a855f7", "#f97316"];
    const particles = Array.from({ length: 80 }).map(() => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 80,
      y: canvas.height * 0.85,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 16 - 6,
      radius: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        active = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.alpha -= p.decay;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      if (active) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [trigger]);

  if (!trigger) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}