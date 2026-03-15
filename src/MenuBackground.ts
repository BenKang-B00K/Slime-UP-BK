import { lightenHex, darkenHex } from "./ColorUtils.js";

// 배경 별/파티클 렌더링
export function drawBackgroundParticles(ctx: CanvasRenderingContext2D, W: number, H: number): void {
    const now = Date.now();
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 15; i++) {
        const x = (Math.sin(i * 123 + now * 0.0005) + 1) * 0.5 * W;
        const y = ((i * 456 + now * 0.001) % H);
        const size = (Math.cos(i * 789 + now * 0.002) + 1) * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 메인화면 배경: 깊이감 있는 미니 슬라임 + 발판
export function drawMainMenuBackground(ctx: CanvasRenderingContext2D, W: number, H: number): void {
    const now = Date.now();

    const LAYERS = [
        { scale: 0.32, alpha: 0.18, sp: 0.45 },
        { scale: 0.55, alpha: 0.34, sp: 0.80 },
        { scale: 0.80, alpha: 0.52, sp: 1.20 },
    ];

    const platTopColors  = ["#2d5e2d", "#3a5f8a", "#3a7a3a"];
    const platBodyColors = ["#3b2a1a", "#1e3a5f", "#2a4a1a"];
    for (let i = 0; i < 6; i++) {
        const li = Math.floor(i / 2);
        const lyr = LAYERS[li];
        const seed = i * 971.3;

        const pw = (38 + (seed % 38)) * lyr.scale;
        const ph = 14 * lyr.scale;
        const px = ((seed * 137) % (W - pw - 10)) + 5;

        const cycle = 4800 + (seed % 3200);
        const elapsed = (now * lyr.sp * 0.09 + seed * 500) % cycle;
        const py = (elapsed / cycle) * (H + ph * 2) - ph;

        ctx.save();
        ctx.globalAlpha = lyr.alpha;
        ctx.fillStyle = platBodyColors[li];
        bgRoundRect(ctx, px, py + ph * 0.35, pw, ph * 0.65, 2 * lyr.scale);
        ctx.fill();
        ctx.fillStyle = platTopColors[li];
        bgRoundRect(ctx, px, py, pw, ph * 0.45, 3 * lyr.scale);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${lyr.alpha * 0.4})`;
        const stripe = pw / 5;
        for (let s = 0; s < 3; s++) {
            ctx.fillRect(px + stripe * s, py, Math.max(1, stripe * 0.4), ph * 0.25);
        }
        ctx.restore();
    }

    const COLORS = [
        "#55DD55","#54A0FF","#ff4757","#A55EEA","#FF9FF3",
        "#ffd32a","#ff6b35","#00d2d3","#ff8fa3","#e6a817",
        "#2ed573","#70a1ff","#eccc68","#ff6b81","#a29bfe",
    ];
    const GROUND_Y = [H * 0.60, H * 0.72, H * 0.84];

    for (let i = 0; i < 15; i++) {
        const li = Math.floor(i / 5);
        const lyr = LAYERS[li];
        const seed = i * 1373.7;
        const sz = 8 * lyr.scale;
        const color = COLORS[i % COLORS.length];

        const dir = (i % 2 === 0) ? 1 : -1;
        const hSpd = (0.016 + (seed % 0.014)) * lyr.sp * dir;
        const xStart = ((seed * 57) % W);
        const x = ((xStart + now * hSpd) % W + W) % W;

        const freq = (0.55 + (seed % 0.55)) * lyr.sp;
        const bPhase = now * 0.001 * freq + seed * 0.37;
        const bVal = Math.abs(Math.sin(bPhase));
        const jumpH = 32 * lyr.scale;
        const gY = GROUND_Y[li] + Math.sin(seed * 2.3) * 30;
        const y = gY - bVal * jumpH;

        const nearGround = bVal < 0.14;
        const atPeak     = bVal > 0.78;
        const sX = nearGround ? 1.35 : (atPeak ? 0.80 : 1.0);
        const sY = nearGround ? 0.70 : (atPeak ? 1.20 : 1.0);

        const eyeDir = dir;

        ctx.save();
        ctx.globalAlpha = lyr.alpha;
        ctx.translate(x + sz / 2, y + sz);
        ctx.scale(sX, sY);
        ctx.translate(-sz / 2, -sz);
        drawBgSlime(ctx, 0, 0, sz, color, eyeDir);
        ctx.restore();
    }
}

function drawBgSlime(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string, eyeDir: number): void {
    ctx.save();
    ctx.globalAlpha *= 0.45;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x + s / 2, y + s + 1, s * 0.42, s * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    drawBgGumdrop(ctx, x, y, s);

    const grd = ctx.createRadialGradient(x + s * 0.35, y + s * 0.3, 0, x + s / 2, y + s / 2, s * 0.65);
    grd.addColorStop(0, lightenHex(color, 60));
    grd.addColorStop(0.5, color);
    grd.addColorStop(1, darkenHex(color, 25));
    ctx.fillStyle = grd;
    drawBgGumdrop(ctx, x + s * 0.1, y + s * 0.1, s * 0.8);

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.ellipse(x + s * 0.28, y + s * 0.25, s * 0.18, s * 0.11, -0.5, 0, Math.PI * 2);
    ctx.fill();

    const ew = Math.max(1, Math.round(s * 0.15));
    const eh = Math.max(1, Math.round(s * 0.21));
    const eyeOff = eyeDir * s * 0.06;
    ctx.fillStyle = "rgba(0,0,0,0.88)";
    ctx.fillRect(Math.round(x + s * 0.20 + eyeOff), Math.round(y + s * 0.46), ew, eh);
    ctx.fillRect(Math.round(x + s * 0.56 + eyeOff), Math.round(y + s * 0.46), ew, eh);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(Math.round(x + s * 0.20 + eyeOff), Math.round(y + s * 0.46), Math.max(1, ew - 1), Math.max(1, eh - 1));
    ctx.fillRect(Math.round(x + s * 0.56 + eyeOff), Math.round(y + s * 0.46), Math.max(1, ew - 1), Math.max(1, eh - 1));
    ctx.fillStyle = "rgba(0,0,0,0.88)";
    ctx.fillRect(Math.round(x + s * 0.21 + eyeOff + (eyeDir > 0 ? 1 : 0)), Math.round(y + s * 0.47), Math.max(1, ew - 1), Math.max(1, eh - 1));
    ctx.fillRect(Math.round(x + s * 0.57 + eyeOff + (eyeDir > 0 ? 1 : 0)), Math.round(y + s * 0.47), Math.max(1, ew - 1), Math.max(1, eh - 1));
}

function drawBgGumdrop(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
    const r = s / 2;
    const b = s * 0.1;
    ctx.beginPath();
    ctx.moveTo(x, y + s - b);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x + s, y, x + s, y + s - b);
    ctx.quadraticCurveTo(x + s, y + s, x + s - b, y + s);
    ctx.lineTo(x + b, y + s);
    ctx.quadraticCurveTo(x, y + s, x, y + s - b);
    ctx.closePath();
    ctx.fill();
}

function bgRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
