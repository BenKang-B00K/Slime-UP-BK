import { GameObject, GameSettings, PlatformType, Biome } from "./types.js";

export class Platform implements GameObject {
    x: number;
    y: number;
    width: number;
    height: number = 20;
    type: PlatformType;
    biome: Biome;
    private settings: GameSettings;
    
    // 움직이는 발판용 변수
    private moveDirection: number = 1;
    private moveSpeed: number = 1.5;

    // 일회용 발판용 변수
    isBroken: boolean = false;
    private breakTimer: number = 0;

    // 돈봉투 픽업
    hasEnvelope: boolean = false;
    envelopeCollected: boolean = false;
    private envTimer: number = 0;

    constructor(x: number, y: number, width: number, settings: GameSettings, type: PlatformType = PlatformType.NORMAL, biome: Biome = Biome.FOREST) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.settings = settings;
        this.type = type;
        this.biome = biome;

        if (this.type === PlatformType.MOVING) {
            this.moveDirection = Math.random() > 0.5 ? 1 : -1;
            this.moveSpeed = 1 + Math.random() * 1.5;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.isBroken && this.type === PlatformType.FRAGILE) return;

        const x = Math.floor(this.x);
        const y = Math.floor(this.y);
        const w = Math.floor(this.width);
        const h = Math.floor(this.height);
        const now = Date.now();

        ctx.save();

        if (this.type === PlatformType.NORMAL) {
            this.drawNormalPlatform(ctx, x, y, w, h);
        } else {
            this.drawSpecialPlatform(ctx, x, y, w, h, now);
        }

        ctx.restore();

        if (this.hasEnvelope && !this.envelopeCollected) this.drawEnvelope(ctx);
    }

    private drawEnvelope(ctx: CanvasRenderingContext2D): void {
        const bob = Math.sin(this.envTimer * 0.07) * 3;
        const ex = Math.floor(this.x + this.width / 2 - 9);
        const ey = Math.floor(this.y - 24 + bob);
        const ew = 18, eh = 13;

        ctx.save();
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 10;

        // 봉투 몸통 (빨간색)
        ctx.fillStyle = "#E53935";
        ctx.beginPath();
        ctx.roundRect(ex, ey, ew, eh, 2);
        ctx.fill();

        // 봉투 V 라인
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ex + 1, ey + 1);
        ctx.lineTo(ex + ew / 2, ey + eh * 0.55);
        ctx.lineTo(ex + ew - 1, ey + 1);
        ctx.stroke();

        // 금색 테두리
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(ex + 0.5, ey + 0.5, ew - 1, eh - 1, 2);
        ctx.stroke();

        // 중앙 "G" 텍스트
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 7px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("G", ex + ew / 2, ey + eh * 0.72);

        ctx.restore();
    }

    private rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
        r = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.arcTo(x + w, y,     x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x,     y + h, r);
        ctx.arcTo(x,     y + h, x,     y,     r);
        ctx.arcTo(x,     y,     x + w, y,     r);
        ctx.closePath();
    }

    private drawNormalPlatform(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
        if (this.biome === Biome.FOREST) {
            // ── Dirt body ──────────────────────────────────────────────────
            const dirtGrad = ctx.createLinearGradient(0, y + 6, 0, y + h);
            dirtGrad.addColorStop(0, "#795548");
            dirtGrad.addColorStop(1, "#4E342E");
            ctx.fillStyle = dirtGrad;
            this.rr(ctx, x, y + 5, w, h - 5, 4);
            ctx.fill();
            // dirt pebble texture
            ctx.fillStyle = "rgba(0,0,0,0.18)";
            for (let i = 5; i < w - 4; i += 7) ctx.fillRect(x + i, y + 11, 3, 2);

            // ── Grass layers ───────────────────────────────────────────────
            ctx.fillStyle = "#2E7D32";
            this.rr(ctx, x, y, w, 9, 4); ctx.fill();
            ctx.fillStyle = "#43A047";
            this.rr(ctx, x + 1, y, w - 2, 7, 3); ctx.fill();

            // ── Grass blades ───────────────────────────────────────────────
            ctx.strokeStyle = "#81C784"; ctx.lineWidth = 1.5; ctx.lineCap = "round";
            for (let i = 4; i < w - 4; i += 6) {
                const tilt = (i % 12 < 6) ? -2 : 2;
                ctx.beginPath(); ctx.moveTo(x + i, y); ctx.lineTo(x + i + tilt, y - 5); ctx.stroke();
            }

            // ── Top highlight ──────────────────────────────────────────────
            ctx.fillStyle = "rgba(255,255,255,0.22)";
            ctx.fillRect(x + 3, y, w - 6, 2);

        } else if (this.biome === Biome.SKY) {
            // ── Cloud bumps on top ──────────────────────────────────────────
            ctx.fillStyle = "#F5F5F5";
            const bumpCount = Math.max(2, Math.floor(w / 16));
            const bumpSpacing = w / (bumpCount + 1);
            for (let i = 1; i <= bumpCount; i++) {
                const bx = x + bumpSpacing * i;
                const br = 5 + (i % 3) * 2;
                ctx.beginPath(); ctx.arc(bx, y + 1, br, Math.PI, 0); ctx.fill();
            }

            // ── Cloud body ─────────────────────────────────────────────────
            const cloudGrad = ctx.createLinearGradient(0, y, 0, y + h);
            cloudGrad.addColorStop(0, "#FFFFFF");
            cloudGrad.addColorStop(0.5, "#F0F8FF");
            cloudGrad.addColorStop(1, "#BBDEFB");
            ctx.fillStyle = cloudGrad;
            this.rr(ctx, x, y, w, h, 6); ctx.fill();

            // ── Bottom shadow ──────────────────────────────────────────────
            ctx.fillStyle = "rgba(144,202,249,0.55)";
            this.rr(ctx, x + 2, y + h - 4, w - 4, 4, 2); ctx.fill();

            // ── Top gloss ──────────────────────────────────────────────────
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.fillRect(x + 4, y + 2, w - 8, 3);

            // ── Sparkle dots ───────────────────────────────────────────────
            ctx.fillStyle = "rgba(100,181,246,0.8)";
            for (let i = 0; i < 3; i++) {
                const sx = x + 8 + (i * (w - 16) / 2);
                ctx.fillRect(sx, y + h / 2, 2, 2);
            }

        } else {
            // ── SPACE — metallic panel ─────────────────────────────────────
            const metalGrad = ctx.createLinearGradient(0, y, 0, y + h);
            metalGrad.addColorStop(0, "#455A64");
            metalGrad.addColorStop(0.4, "#263238");
            metalGrad.addColorStop(1, "#37474F");
            ctx.fillStyle = metalGrad;
            ctx.fillRect(x, y, w, h);

            // top glow bar
            const topGrad = ctx.createLinearGradient(x, 0, x + w, 0);
            topGrad.addColorStop(0,   "rgba(0,229,255,0)");
            topGrad.addColorStop(0.3, "#00E5FF");
            topGrad.addColorStop(0.7, "#00E5FF");
            topGrad.addColorStop(1,   "rgba(0,229,255,0)");
            ctx.fillStyle = topGrad; ctx.fillRect(x, y, w, 2);

            // rivets
            ctx.fillStyle = "#546E7A";
            for (let i = 8; i < w - 6; i += 12) {
                ctx.beginPath(); ctx.arc(x + i, y + h / 2, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#78909C"; ctx.beginPath(); ctx.arc(x + i - 0.5, y + h / 2 - 0.5, 1, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#546E7A";
            }

            // corner brackets
            ctx.strokeStyle = "#00B0FF"; ctx.lineWidth = 1.5;
            const bl = 5;
            ctx.beginPath();
            ctx.moveTo(x, y + bl); ctx.lineTo(x, y); ctx.lineTo(x + bl, y);
            ctx.moveTo(x + w - bl, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + bl);
            ctx.stroke();

            // subtle grid lines
            ctx.strokeStyle = "rgba(0,229,255,0.08)"; ctx.lineWidth = 1;
            for (let i = 14; i < w - 10; i += 14) {
                ctx.beginPath(); ctx.moveTo(x + i, y + 2); ctx.lineTo(x + i, y + h - 2); ctx.stroke();
            }
        }
    }

    private drawSpecialPlatform(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, now: number): void {
        switch (this.type) {
            case PlatformType.MOVING:
                if (this.biome === Biome.FOREST) {
                    // ── Log platform (cross-section wood) ─────────────────
                    const logGrad = ctx.createLinearGradient(0, y, 0, y + h);
                    logGrad.addColorStop(0, "#8D6E63");
                    logGrad.addColorStop(1, "#5D4037");
                    ctx.fillStyle = logGrad;
                    this.rr(ctx, x, y, w, h, 5); ctx.fill();
                    // wood grain rings
                    ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.lineWidth = 1;
                    for (let i = 0; i < 3; i++) {
                        ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, (i + 1) * 4, 0, Math.PI * 2); ctx.stroke();
                    }
                    // bark texture lines
                    ctx.strokeStyle = "#6D4C41"; ctx.lineWidth = 1.5;
                    for (let i = 6; i < w - 4; i += 10) {
                        ctx.beginPath(); ctx.moveTo(x + i, y + 2); ctx.lineTo(x + i + 2, y + h - 2); ctx.stroke();
                    }
                    // direction arrows
                    ctx.fillStyle = "rgba(255,255,255,0.5)";
                    const arrowDir = this.moveDirection;
                    const ax = arrowDir > 0 ? x + w - 8 : x + 8;
                    ctx.beginPath();
                    if (arrowDir > 0) { ctx.moveTo(ax, y + h / 2); ctx.lineTo(ax - 6, y + 2); ctx.lineTo(ax - 6, y + h - 2); }
                    else             { ctx.moveTo(ax, y + h / 2); ctx.lineTo(ax + 6, y + 2); ctx.lineTo(ax + 6, y + h - 2); }
                    ctx.fill();

                } else if (this.biome === Biome.SKY) {
                    // ── Winged cloud ───────────────────────────────────────
                    const wingA = Math.sin(now * 0.006) * 0.3;
                    ctx.fillStyle = "#E3F2FD";
                    // left wing
                    ctx.save(); ctx.translate(x, y + h / 2); ctx.rotate(-wingA);
                    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-14, -6); ctx.lineTo(-10, 4); ctx.fill();
                    ctx.restore();
                    // right wing
                    ctx.save(); ctx.translate(x + w, y + h / 2); ctx.rotate(wingA);
                    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(14, -6); ctx.lineTo(10, 4); ctx.fill();
                    ctx.restore();
                    // cloud body
                    ctx.fillStyle = "#FFFFFF";
                    this.rr(ctx, x, y, w, h, 6); ctx.fill();
                    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fillRect(x + 3, y + 2, w - 6, 3);
                    ctx.fillStyle = "rgba(144,202,249,0.4)";
                    this.rr(ctx, x + 2, y + h - 4, w - 4, 4, 2); ctx.fill();

                } else {
                    // ── Hover thruster platform ────────────────────────────
                    ctx.fillStyle = "#37474F"; this.rr(ctx, x, y, w, h - 5, 4); ctx.fill();
                    ctx.fillStyle = "#546E7A"; ctx.fillRect(x + 2, y + 2, w - 4, 3);

                    const glow = Math.abs(Math.sin(now * 0.012)) * 8 + 4;
                    ctx.shadowBlur = glow; ctx.shadowColor = "#00E5FF";
                    ctx.fillStyle = "#00E5FF";
                    // thruster nozzles
                    ctx.fillRect(x + 4, y + h - 5, 10, 5);
                    ctx.fillRect(x + w - 14, y + h - 5, 10, 5);
                    // thruster flame gradient
                    ctx.shadowBlur = 0;
                    const flameH = (Math.abs(Math.sin(now * 0.015)) * 6 + 3) | 0;
                    const flameGrad = ctx.createLinearGradient(0, y + h, 0, y + h + flameH);
                    flameGrad.addColorStop(0, "rgba(0,229,255,0.9)");
                    flameGrad.addColorStop(1, "rgba(0,229,255,0)");
                    ctx.fillStyle = flameGrad;
                    ctx.fillRect(x + 4, y + h, 10, flameH);
                    ctx.fillRect(x + w - 14, y + h, 10, flameH);
                }
                break;

            case PlatformType.FRAGILE: {
                const crumble = this.breakTimer > 0;
                if (this.biome === Biome.FOREST) {
                    // ── Cracked stone ──────────────────────────────────────
                    ctx.fillStyle = crumble ? "#9E9E9E" : "#78909C";
                    this.rr(ctx, x, y, w, h, 4); ctx.fill();
                    ctx.fillStyle = "rgba(0,0,0,0.2)";
                    for (let i = 6; i < w - 4; i += 9) ctx.fillRect(x + i, y + 5, 3, 8);
                    // crack lines
                    ctx.strokeStyle = crumble ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.35)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x + w * 0.3, y); ctx.lineTo(x + w * 0.2, y + h / 2); ctx.lineTo(x + w * 0.4, y + h);
                    ctx.moveTo(x + w * 0.7, y + 2); ctx.lineTo(x + w * 0.65, y + h * 0.7);
                    ctx.stroke();
                    // moss accent top
                    if (!crumble) { ctx.fillStyle = "#81C784"; ctx.fillRect(x + 2, y, w - 4, 3); }

                } else if (this.biome === Biome.SKY) {
                    // ── Ice shard ──────────────────────────────────────────
                    const alpha = crumble ? 0.4 : 0.75;
                    ctx.fillStyle = `rgba(178,235,242,${alpha})`;
                    this.rr(ctx, x, y, w, h, 5); ctx.fill();
                    ctx.strokeStyle = `rgba(77,208,225,${alpha})`; ctx.lineWidth = 1.5;
                    this.rr(ctx, x, y, w, h, 5); ctx.stroke();
                    // ice shatter lines
                    ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.8})`; ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x + w * 0.4, y); ctx.lineTo(x + w * 0.25, y + h);
                    ctx.moveTo(x + w * 0.6, y + 2); ctx.lineTo(x + w * 0.75, y + h);
                    ctx.stroke();
                    // gloss
                    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
                    ctx.fillRect(x + 4, y + 2, w - 8, 3);

                } else {
                    // ── Holographic scan ───────────────────────────────────
                    const scan = (now % 1200) / 1200;
                    const flickerAlpha = crumble ? 0.35 + Math.sin(now * 0.08) * 0.15 : 0.55;
                    ctx.fillStyle = `rgba(0,176,255,${flickerAlpha * 0.35})`; ctx.fillRect(x, y, w, h);
                    // scan line
                    ctx.fillStyle = `rgba(0,229,255,${flickerAlpha * 0.9})`;
                    ctx.fillRect(x, y + scan * h, w, 2);
                    // border glow
                    ctx.shadowBlur = 6; ctx.shadowColor = "#00E5FF";
                    ctx.strokeStyle = `rgba(0,229,255,${flickerAlpha})`; ctx.lineWidth = 1;
                    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
                    ctx.shadowBlur = 0;
                }
                if (crumble) {
                    // shake offset applied via transform
                    const shakeX = (Math.random() - 0.5) * 2;
                    ctx.translate(shakeX, 0);
                    // white flash overlay
                    ctx.fillStyle = `rgba(255,255,255,${this.breakTimer / 20 * 0.45})`;
                    ctx.fillRect(x, y, w, h);
                }
                break;
            }

            case PlatformType.SPRING:
                if (this.biome === Biome.FOREST) {
                    // ── Spring coil ────────────────────────────────────────
                    ctx.fillStyle = "#37474F"; ctx.fillRect(x, y + h - 6, w, 6);
                    ctx.strokeStyle = "#FF5252"; ctx.lineWidth = 3; ctx.lineCap = "round";
                    const coils = 4;
                    const coilW = w * 0.6;
                    const coilX = x + w * 0.2;
                    ctx.beginPath();
                    for (let i = 0; i <= coils * 2; i++) {
                        const cx2 = coilX + (i / (coils * 2)) * coilW;
                        const cy = y + h - 6 - (i % 2 === 0 ? 0 : h - 6);
                        if (i === 0) ctx.moveTo(cx2, cy); else ctx.lineTo(cx2, cy);
                    }
                    ctx.stroke();
                    // spring cap
                    ctx.fillStyle = "#FFCDD2";
                    this.rr(ctx, x + w * 0.15, y - 2, w * 0.7, 6, 3); ctx.fill();

                } else if (this.biome === Biome.SKY) {
                    // ── Star bounce ────────────────────────────────────────
                    const bounce = Math.abs(Math.sin(now * 0.005)) * 4;
                    const starGrad = ctx.createLinearGradient(0, y - bounce, 0, y + h);
                    starGrad.addColorStop(0, "#FFF176");
                    starGrad.addColorStop(1, "#FFD54F");
                    ctx.fillStyle = starGrad;
                    this.rr(ctx, x, y - bounce, w, h, 5); ctx.fill();
                    ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(x + 3, y - bounce + 2, w - 6, 3);
                    // energy lines
                    ctx.strokeStyle = "#FF6F00"; ctx.lineWidth = 1.5;
                    for (let i = 0; i < 3; i++) {
                        const ly = y - bounce - 6 - i * 4;
                        ctx.globalAlpha = 1 - i * 0.3;
                        ctx.beginPath(); ctx.moveTo(x + 6, ly); ctx.lineTo(x + w - 6, ly); ctx.stroke();
                    }
                    ctx.globalAlpha = 1;

                } else {
                    // ── Gravity pad ────────────────────────────────────────
                    ctx.fillStyle = "#37474F"; this.rr(ctx, x, y, w, h, 4); ctx.fill();
                    const pulse = (Math.sin(now * 0.01) + 1) * 0.5;
                    ctx.shadowBlur = 8 + pulse * 8; ctx.shadowColor = "#9575CD";
                    ctx.fillStyle = "#7E57C2";
                    this.rr(ctx, x + w * 0.2, y + 3, w * 0.6, h - 6, 3); ctx.fill();
                    ctx.shadowBlur = 0;
                    // concentric rings
                    ctx.strokeStyle = `rgba(209,196,233,${0.4 + pulse * 0.4})`; ctx.lineWidth = 1;
                    for (let r = 4; r < w * 0.3; r += 4) {
                        ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2); ctx.stroke();
                    }
                }
                break;

            case PlatformType.FOG: {
                // ── Mystical fog ───────────────────────────────────────────
                const fogGrad = ctx.createLinearGradient(0, y, 0, y + h);
                fogGrad.addColorStop(0, "#6A1B9A");
                fogGrad.addColorStop(1, "#4A148C");
                ctx.fillStyle = fogGrad;
                this.rr(ctx, x, y, w, h, 4); ctx.fill();

                // swirling mist
                const t = (now * 0.001) % (Math.PI * 2);
                ctx.fillStyle = "#9C27B0";
                for (let i = 0; i < 3; i++) {
                    const phase = t + (i * Math.PI * 2 / 3);
                    const mx = x + w * 0.5 + Math.sin(phase) * w * 0.35;
                    const my = y + h / 2 + Math.cos(phase * 0.7) * h * 0.25;
                    ctx.globalAlpha = 0.4;
                    ctx.beginPath(); ctx.arc(mx, my, 5, 0, Math.PI * 2); ctx.fill();
                }
                ctx.globalAlpha = 1;

                // glowing border
                ctx.shadowBlur = 8; ctx.shadowColor = "#CE93D8";
                ctx.strokeStyle = "#CE93D8"; ctx.lineWidth = 1.5;
                this.rr(ctx, x, y, w, h, 4); ctx.stroke();
                ctx.shadowBlur = 0;
                break;
            }
        }
    }

    update(canvasWidth: number = 400): void {
        this.y += this.settings.PLATFORM_SPEED;

        if (this.type === PlatformType.MOVING) {
            this.x += this.moveDirection * this.moveSpeed;
            if (this.x <= 0 || this.x + this.width >= canvasWidth) {
                this.moveDirection *= -1;
            }
        }

        if (this.type === PlatformType.FRAGILE && this.breakTimer > 0) {
            this.breakTimer--;
            if (this.breakTimer <= 0) {
                this.isBroken = true;
            }
        }

        if (this.hasEnvelope && !this.envelopeCollected) this.envTimer++;
    }

    onStepped(): void {
        if (this.type === PlatformType.FRAGILE && this.breakTimer === 0) {
            this.breakTimer = 20;
        }
    }

    isOffScreen(canvasHeight: number): boolean {
        return this.y > canvasHeight;
    }
}
