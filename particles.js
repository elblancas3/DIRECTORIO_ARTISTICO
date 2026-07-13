/**
 * particles.js
 * -----------------------------------------------------------------------
 * Fondo genérico e interactivo para el hero: puntos que flotan y se
 * dispersan al acercar el mouse (o el dedo, en táctil), con líneas finas
 * entre puntos cercanos. Sin dependencias externas.
 * -----------------------------------------------------------------------
 */

(function () {
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height, particles;
  const mouse = { x: null, y: null, radius: 130 };

  const COLOR_DOT = "rgba(245,241,234,0.55)";
  const COLOR_DOT_NEAR = "rgba(231,34,46,0.9)";
  const COLOR_LINE = "rgba(245,241,234,0.12)";

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    initParticles();
  }

  function initParticles() {
    const count = Math.min(110, Math.floor((width * height) / 14000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // mover y dibujar puntos
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // repulsión suave con el mouse
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / (dist || 1)) * force * 3.2;
          p.y += (dy / (dist || 1)) * force * 3.2;
        }
      }

      const near = mouse.x !== null && Math.hypot(p.x - mouse.x, p.y - mouse.y) < mouse.radius;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = near ? COLOR_DOT_NEAR : COLOR_DOT;
      ctx.fill();
    });

    // líneas entre puntos cercanos
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = COLOR_LINE;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });
  canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
  }, { passive: true });

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(step);
})();
