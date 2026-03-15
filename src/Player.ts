import { GameObject, GameSettings, SkinColors } from "./types.js";
import type { FeatureCtx } from "./features/FeatureContext.js";
import { tryOriginalFeatures } from "./features/OriginalFeatures.js";
import { tryFantasyFeatures } from "./features/FantasyFeatures.js";
import { trySpaceFeatures } from "./features/SpaceFeatures.js";
import { tryMonsterFeatures } from "./features/MonsterFeatures.js";
import { tryMythFeatures } from "./features/MythFeatures.js";

export class Player implements GameObject {
    x: number;
    y: number;
    width: number = 32;
    height: number = 32;
    vx: number = 0;
    vy: number = 0;
    isJumping: boolean = false;
    
    private colors: SkinColors = { main: "#55DD55", outline: "#228822", highlight: "#AAFFAA" };
    private currentFeature: string | undefined = undefined;

    get mainColor(): string { return this.colors.main; }

    private keys: { [key: string]: boolean } = {};
    public touchX: number | null = null;
    public isTouching: boolean = false;
    private settings: GameSettings;

    constructor(x: number, y: number, settings: GameSettings) {
        this.x = x;
        this.y = y;
        this.settings = settings;

        window.addEventListener("keydown", (e) => {
            if (e.code === "Space" && e.repeat) return;
            this.keys[e.code] = true;
        });
        window.addEventListener("keyup", (e) => (this.keys[e.code] = false));

        window.addEventListener("touchstart", (e) => {
            this.isTouching = true;
            this.touchX = e.touches[0].clientX;
            if (!this.isJumping) {
                this.vy = this.settings.JUMP_STRENGTH;
                this.isJumping = true;
            }
        });
        window.addEventListener("touchmove", (e) => {
            this.touchX = e.touches[0].clientX;
        });
        window.addEventListener("touchend", () => {
            this.isTouching = false;
            this.touchX = null;
        });
    }

    setSkin(colors: SkinColors, id: string, feature?: string): void {
        this.colors = colors;
        this.currentFeature = feature;
        localStorage.setItem("slime_selected_skin_id", id);
    }

    public isWinking: boolean = false;
    private winkTimer: number = 0;

    public wink(): void {
        if (!this.isWinking) {
            this.isWinking = true;
            this.winkTimer = 30; // 0.5초 동안 유지
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const ox = Math.floor(this.x);
        const oy = Math.floor(this.y);
        const w = this.width;
        const h = this.height;
        const colors = this.colors;

        const isJumpingUp = this.vy < -1;
        const isFalling = this.vy > 1;
        const moveDir = this.vx > 0.5 ? 1 : (this.vx < -0.5 ? -1 : 0);
        const t = Date.now();

        if (this.winkTimer > 0) {
            this.winkTimer--;
            if (this.winkTimer <= 0) this.isWinking = false;
        }

        ctx.save();

        // --- Squash & Stretch with organic multi-frequency wobble ---
        let stretchX = 1.0;
        let stretchY = 1.0;

        if (this.isJumping) {
            stretchX = 0.82;
            stretchY = 1.18;
        } else if (Math.abs(this.vx) > 0.5) {
            // 두 주파수 중첩으로 유기적인 젤리 흔들림
            const wave = Math.sin(t * 0.01) * 0.055 + Math.sin(t * 0.023) * 0.02;
            stretchX = 1.0 + wave;
            stretchY = 1.0 - wave;
        } else {
            // 정지 시 미세 숨쉬기 애니메이션
            const idle = Math.sin(t * 0.0025) * 0.018;
            stretchX = 1.0 + idle;
            stretchY = 1.0 - idle;
        }

        // --- 바닥 그림자 (body transform 이전에 월드 좌표로 그림) ---
        const shadowW = w * 0.46 * (this.isJumping ? 0.65 : stretchX);
        const shadowGrad = ctx.createRadialGradient(ox + w / 2, oy + h + 2, 1, ox + w / 2, oy + h + 2, shadowW + 5);
        shadowGrad.addColorStop(0, "rgba(0,0,0,0.28)");
        shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(ox + w / 2, oy + h + 2, shadowW, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(ox + w / 2, oy + h);
        ctx.scale(stretchX, stretchY);
        ctx.translate(-w / 2, -h);

        const cx = w / 2;

        // --- 1. 외곽선 ---
        ctx.fillStyle = colors.outline;
        this.drawGumdropShape(ctx, 0, 0, w, h);

        // --- 2. 방사형 그라디언트 바디 (하이라이트→메인→아웃라인 3단 깊이) ---
        const bodyGrad = ctx.createRadialGradient(
            cx - w * 0.12, h * 0.28, w * 0.04,
            cx, h * 0.5, w * 0.62
        );
        bodyGrad.addColorStop(0, colors.highlight);
        bodyGrad.addColorStop(0.42, colors.main);
        bodyGrad.addColorStop(1, colors.outline);
        ctx.fillStyle = bodyGrad;
        this.drawGumdropShape(ctx, 2, 2, w - 4, h - 4);

        // --- 3. 내부 에지 비네팅 (반투명 젤리 깊이감) ---
        const vigGrad = ctx.createRadialGradient(cx, h * 0.44, w * 0.14, cx, h * 0.5, w * 0.53);
        vigGrad.addColorStop(0, "rgba(0,0,0,0)");
        vigGrad.addColorStop(0.62, "rgba(0,0,0,0)");
        vigGrad.addColorStop(1, "rgba(0,0,0,0.22)");
        ctx.fillStyle = vigGrad;
        this.drawGumdropShape(ctx, 2, 2, w - 4, h - 4);

        // --- 4. 1차 스펙큘러 하이라이트 (광택 메인) ---
        const hlGrad = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w * 0.3, h * 0.25, w * 0.2);
        hlGrad.addColorStop(0, "rgba(255,255,255,0.92)");
        hlGrad.addColorStop(0.48, "rgba(255,255,255,0.42)");
        hlGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = hlGrad;
        ctx.beginPath();
        ctx.ellipse(w * 0.3, h * 0.22, w * 0.17, h * 0.1, -Math.PI / 5, 0, Math.PI * 2);
        ctx.fill();

        // --- 5. 2차 미세 하이라이트 ---
        ctx.fillStyle = "rgba(255,255,255,0.48)";
        ctx.beginPath();
        ctx.ellipse(w * 0.58, h * 0.38, w * 0.05, h * 0.036, Math.PI / 5, 0, Math.PI * 2);
        ctx.fill();

        // --- 6. 내부 공기방울 (젤리 질감) ---
        const bubbleY = h * 0.63 + Math.sin(t * 0.0016) * 2.5;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx - 4, bubbleY, 2.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.fill();

        // --- 7. 눈 (둥근 동공 + 광택) ---
        const eyeXBase = cx + (moveDir * 4);
        const eyeYBase = h * 0.52 + (isJumpingUp ? -2 : (isFalling ? 2 : 0));

        if (this.isWinking) {
            ctx.strokeStyle = "rgba(0,0,0,0.85)";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(eyeXBase - 8, eyeYBase);
            ctx.lineTo(eyeXBase - 4, eyeYBase + 3);
            ctx.lineTo(eyeXBase - 8, eyeYBase + 6);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(eyeXBase + 8, eyeYBase);
            ctx.lineTo(eyeXBase + 4, eyeYBase + 3);
            ctx.lineTo(eyeXBase + 8, eyeYBase + 6);
            ctx.stroke();
        } else {
            // 둥근 동공
            ctx.fillStyle = "rgba(0,0,0,0.88)";
            ctx.beginPath();
            ctx.ellipse(eyeXBase - 4, eyeYBase + 3, 3, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(eyeXBase + 4, eyeYBase + 3, 3, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // 눈 광택
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.beginPath();
            ctx.ellipse(eyeXBase - 5.5, eyeYBase + 1.5, 1.3, 1.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(eyeXBase + 2.5, eyeYBase + 1.5, 1.3, 1.3, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- 8. 특징 ---
        if (this.currentFeature) {
            this.drawFeatureArtisan(ctx, this.currentFeature, 0, 0, w, h, moveDir);
        }

        ctx.restore();
    }

    private makeGumdropPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        const r = w / 2;
        ctx.beginPath();
        ctx.moveTo(x, y + h - 4);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + h - 4);
        ctx.quadraticCurveTo(x + w, y + h, x + w - 4, y + h);
        ctx.lineTo(x + 4, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - 4);
        ctx.closePath();
    }

    private drawGumdropShape(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        this.makeGumdropPath(ctx, x, y, w, h);
        ctx.fill();
    }

    private drawFeatureArtisan(ctx: CanvasRenderingContext2D, feature: string, ox: number, oy: number, w: number, h: number, moveDir: number): void {
        const center = ox + w / 2;
        const top = oy;
        ctx.save();
        const fc: FeatureCtx = { ctx, feature, ox, oy, w, h, center, top, moveDir, colors: this.colors };
        tryOriginalFeatures(fc) ||
        tryFantasyFeatures(fc) ||
        trySpaceFeatures(fc) ||
        tryMonsterFeatures(fc) ||
        tryMythFeatures(fc);
        ctx.restore();
    }

    update(canvasWidth: number): void {
        const moveLeft = this.keys["ArrowLeft"] || (this.isTouching && this.touchX !== null && this.touchX < window.innerWidth / 2);
        const moveRight = this.keys["ArrowRight"] || (this.isTouching && this.touchX !== null && this.touchX >= window.innerWidth / 2);

        if (moveLeft) {
            this.vx = -this.settings.PLAYER_SPEED;
        } else if (moveRight) {
            this.vx = this.settings.PLAYER_SPEED;
        } else {
            this.vx *= 0.8;
        }

        if (this.keys["Space"] && !this.isJumping) {
            this.vy = this.settings.JUMP_STRENGTH;
            this.isJumping = true;
            this.keys["Space"] = false; 
        }

        this.vy += this.settings.GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
    }

    jump(strength: number): void {
        this.vy = strength;
        this.isJumping = true;
    }
}
