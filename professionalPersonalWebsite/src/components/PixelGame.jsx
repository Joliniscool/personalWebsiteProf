import { useEffect, useRef, useCallback } from 'react';

// ── constants ──────────────────────────────────────────────────────────────
const P          = 3;          // pixel size multiplier
const CANVAS_H   = 148;
const GROUND     = 116;        // y where character/obstacle bottoms sit
const CHAR_X     = 62;
const CHAR_W     = 8  * P;     // 24
const CHAR_H     = 16 * P;     // 48
const OBS_W      = 10 * P;     // 30
const OBS_H      = 12 * P;     // 36
const JUMP_VEL   = -11;
const GRAVITY    = 0.65;

// ── pixel art drawing ──────────────────────────────────────────────────────

function drawGirl(ctx, charY, frame, isJumping) {
  const p = P;
  const x = CHAR_X;
  const y = charY;

  // hair
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + p,     y,          6 * p, 2 * p); // top hair
  ctx.fillRect(x,         y + p,      8 * p, 2 * p); // side hair band
  ctx.fillRect(x,         y + 3 * p,  p,     3 * p); // left side hair
  ctx.fillRect(x + 7 * p, y + 2 * p,  p,     5 * p); // right long side / ponytail

  // face
  ctx.fillStyle = '#fde8d0';
  ctx.fillRect(x + p, y + 3 * p, 6 * p, 4 * p);

  // eyes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + 2 * p, y + 4 * p, p, p);
  ctx.fillRect(x + 5 * p, y + 4 * p, p, p);

  // blush
  ctx.fillStyle = '#fca5a5';
  ctx.fillRect(x + p,     y + 5 * p, p, p);
  ctx.fillRect(x + 6 * p, y + 5 * p, p, p);

  // shirt (pink hoodie)
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(x + p, y + 7 * p, 6 * p, 4 * p);

  // hoodie pocket detail
  ctx.fillStyle = '#db2777';
  ctx.fillRect(x + 3 * p, y + 9 * p, 2 * p, 2 * p);

  // arms
  ctx.fillStyle = '#ec4899';
  if (isJumping) {
    ctx.fillRect(x,         y + 6 * p, p, 3 * p);
    ctx.fillRect(x + 7 * p, y + 6 * p, p, 3 * p);
  } else if (frame === 0) {
    ctx.fillRect(x,         y + 8 * p, p, 3 * p);
    ctx.fillRect(x + 7 * p, y + 7 * p, p, 3 * p);
  } else {
    ctx.fillRect(x,         y + 7 * p, p, 3 * p);
    ctx.fillRect(x + 7 * p, y + 8 * p, p, 3 * p);
  }

  // pants
  ctx.fillStyle = '#1e293b';
  if (isJumping) {
    ctx.fillRect(x + p,     y + 11 * p, 2 * p, 4 * p);
    ctx.fillRect(x + 5 * p, y + 11 * p, 2 * p, 4 * p);
  } else if (frame === 0) {
    ctx.fillRect(x,         y + 11 * p, 3 * p, 5 * p);
    ctx.fillRect(x + 5 * p, y + 11 * p, 3 * p, 4 * p);
  } else {
    ctx.fillRect(x,         y + 11 * p, 3 * p, 4 * p);
    ctx.fillRect(x + 5 * p, y + 11 * p, 3 * p, 5 * p);
  }

  // shoes
  ctx.fillStyle = '#475569';
  if (isJumping) {
    ctx.fillRect(x + p,     y + 15 * p, 2 * p, p);
    ctx.fillRect(x + 5 * p, y + 15 * p, 2 * p, p);
  } else if (frame === 0) {
    ctx.fillRect(x - p,     y + 16 * p, 4 * p, p); // back foot
    ctx.fillRect(x + 5 * p, y + 15 * p, 4 * p, p); // front foot
  } else {
    ctx.fillRect(x,         y + 15 * p, 4 * p, p);
    ctx.fillRect(x + 5 * p, y + 16 * p, 4 * p, p);
  }
}

function drawComputer(ctx, x, groundY) {
  const p = P;
  const top = groundY - OBS_H;

  // monitor body
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, top, 10 * p, 6 * p);

  // screen
  ctx.fillStyle = '#080c18';
  ctx.fillRect(x + p, top + p, 8 * p, 4 * p);

  // code lines on screen
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(x + 2 * p, top + 2 * p, 3 * p, p);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(x + 2 * p, top + 3 * p, 5 * p, p);
  ctx.fillStyle = '#34d399';
  ctx.fillRect(x + 6 * p, top + 2 * p, 2 * p, p);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x + 4 * p, top + 4 * p, 3 * p, p);

  // monitor bottom trim
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(x, top + 6 * p, 10 * p, p);

  // stand
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 4 * p, top + 7 * p, 2 * p, 2 * p);

  // base
  ctx.fillRect(x + 2 * p, top + 9 * p, 6 * p, p);

  // keyboard
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x + p, top + 10 * p, 8 * p, 2 * p);

  // keys
  ctx.fillStyle = '#1e3a5f';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(x + (2 + i) * p, top + 10 * p + 1, p - 1, p - 1);
  }
}

// ── component ──────────────────────────────────────────────────────────────

const INIT = (highScore = 0) => ({
  started:   false,
  gameOver:  false,
  charY:     GROUND - CHAR_H,
  velY:      0,
  isJumping: false,
  obstacles: [],
  nextSpawn: 110,
  speed:     4,
  score:     0,
  highScore,
  animFrame: 0,
  animTick:  0,
  groundOff: 0,   // scrolling ground offset
  stars:     null,
});

export default function PixelGame() {
  const canvasRef = useRef(null);
  const stateRef  = useRef(INIT());
  const rafRef    = useRef(null);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.gameOver) {
      stateRef.current = INIT(s.highScore);
      stateRef.current.started = true;
      return;
    }
    s.started = true;
    if (!s.isJumping) {
      s.velY      = JUMP_VEL;
      s.isJumping = true;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = CANVAS_H;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleKey = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        if (stateRef.current.started) e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);

    const render = () => {
      const s   = stateRef.current;
      const ctx = canvas.getContext('2d');
      const W   = canvas.width;

      ctx.clearRect(0, 0, W, CANVAS_H);

      // ── stars (generated once) ─────────────────────────────────────────
      if (!s.stars) {
        s.stars = Array.from({ length: 28 }, () => ({
          x:       Math.random() * W,
          y:       Math.random() * (GROUND - 20),
          r:       Math.random() < 0.25 ? 1.5 : 1,
          phase:   Math.random() * Math.PI * 2,
        }));
      }
      s.stars.forEach((st) => {
        st.phase += 0.035;
        const a = 0.15 + Math.sin(st.phase) * 0.08;
        ctx.fillStyle = `rgba(236,72,153,${a})`;
        ctx.fillRect(st.x, st.y, st.r, st.r);
      });

      // ── scrolling ground dashes ────────────────────────────────────────
      ctx.fillStyle = 'rgba(236,72,153,0.18)';
      ctx.fillRect(0, GROUND, W, 1);
      if (s.started && !s.gameOver) s.groundOff = (s.groundOff + s.speed) % 30;
      ctx.fillStyle = 'rgba(236,72,153,0.08)';
      for (let dx = -s.groundOff; dx < W; dx += 30) {
        ctx.fillRect(dx, GROUND + 3, 16, 1);
      }

      // ── prompt / game-over text ────────────────────────────────────────
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';
      if (!s.started) {
        ctx.fillStyle = 'rgba(148,163,184,0.5)';
        ctx.font      = '10px monospace';
        ctx.fillText('space / tap to start', W / 2, 10);
      }
      if (s.gameOver) {
        ctx.fillStyle = 'rgba(236,72,153,0.85)';
        ctx.font      = 'bold 11px monospace';
        ctx.fillText('GAME OVER — space / tap to retry', W / 2, 8);
        ctx.fillStyle = 'rgba(148,163,184,0.55)';
        ctx.font      = '10px monospace';
        ctx.fillText(
          `score: ${Math.floor(s.score / 10)}   best: ${s.highScore}`,
          W / 2, 22
        );
      }

      // ── score (top-right) ──────────────────────────────────────────────
      if (s.started) {
        ctx.fillStyle = 'rgba(236,72,153,0.55)';
        ctx.font      = '10px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(
          String(Math.floor(s.score / 10)).padStart(5, '0'),
          W - 8, 8
        );
      }

      // ── draw standing character (idle) ─────────────────────────────────
      drawGirl(ctx, s.charY, s.animFrame, s.isJumping);

      // ── draw obstacles ─────────────────────────────────────────────────
      s.obstacles.forEach((o) => drawComputer(ctx, o.x, GROUND));

      // ── physics & logic ────────────────────────────────────────────────
      if (!s.started || s.gameOver) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      // gravity
      s.velY  += GRAVITY;
      s.charY += s.velY;
      if (s.charY >= GROUND - CHAR_H) {
        s.charY    = GROUND - CHAR_H;
        s.velY     = 0;
        s.isJumping = false;
      }

      // animation frames
      s.animTick++;
      if (s.animTick % 7 === 0) s.animFrame ^= 1;

      // spawn obstacles
      s.nextSpawn--;
      if (s.nextSpawn <= 0) {
        s.obstacles.push({ x: W + 10 });
        s.nextSpawn = Math.max(
          Math.floor(Math.random() * 45 + 48 - s.speed * 2),
          32
        );
      }
      s.obstacles = s.obstacles.filter((o) => o.x > -OBS_W - 5);
      s.obstacles.forEach((o) => { o.x -= s.speed; });

      // increase speed
      s.score++;
      if (s.score % 350 === 0) s.speed = Math.min(s.speed + 0.5, 10);

      // ── collision (tighter hitbox than visuals) ────────────────────────
      const cx = CHAR_X + 5;
      const cy = s.charY + 5 * P;
      const cw = CHAR_W  - 10;
      const ch = CHAR_H  - 6 * P;

      for (const o of s.obstacles) {
        const ox = o.x + 4;
        const oy = GROUND - OBS_H + 4;
        const ow = OBS_W - 8;
        const oh = OBS_H - 4;
        if (cx < ox + ow && cx + cw > ox && cy < oy + oh && cy + ch > oy) {
          s.gameOver  = true;
          s.highScore = Math.max(s.highScore, Math.floor(s.score / 10));
          rafRef.current = requestAnimationFrame(render);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKey);
    };
  }, [jump]);

  return (
    <div className="mt-10">
      <p className="font-mono text-[10px] text-slate-700 mb-2 select-none">
        // mini game — space or tap to jump
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: CANVAS_H, imageRendering: 'pixelated', display: 'block' }}
        className="w-full rounded-lg border border-white/[0.04] cursor-pointer select-none"
        onClick={jump}
        onTouchStart={(e) => { e.preventDefault(); jump(); }}
      />
    </div>
  );
}
