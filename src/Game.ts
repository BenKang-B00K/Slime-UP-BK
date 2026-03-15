import { Player } from "./Player.js";
import { Platform } from "./Platform.js";
import { Lava } from "./Lava.js";
import { GameSettings, PlatformType, Biome, SkinData, SceneType } from "./types.js";
import { ParticleManager } from "./Particles.js";
import { AudioManager } from "./AudioManager.js";
import { SceneManager } from "./SceneManager.js";
import { lerpColor } from "./ColorUtils.js";
import { drawBackgroundParticles, drawMainMenuBackground } from "./MenuBackground.js";
// @ts-ignore
import skinsData from "./skins.json";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private player: Player;
    private platforms: Platform[] = [];
    private lava: Lava;
    private particles: ParticleManager = new ParticleManager();
    private audio: AudioManager = new AudioManager();
    private sceneManager: SceneManager = new SceneManager();
    
    private skins: SkinData[] = skinsData;
    private currentSkinIndex: number = 0;
    private unlockedSkins: Set<string> = new Set(["green", "blue", "red", "purple", "pink"]);

    private static readonly FREE_SKINS = new Set(["green", "blue", "red", "purple", "pink"]);

    private distance: number = 0; 
    private maxDistance: number = 0; 
    private highScore: number = 0; 
    private startY: number = 0;

    private gold: number = 0;
    private lastGoldMilestone: number = 0;
    private goldEarnedThisRun: number = 0;
    
    private frameCount: number = 0;
    private wasJumping: boolean = false;

    private hasReachedSky: boolean = false;
    private hasReachedSpace: boolean = false;
    private hasBrokenRecord: boolean = false;
    private isFogActive: boolean = false; 
    private notificationText: string = "";
    private notificationTimer: number = 0;

    private shakeIntensity: number = 0;
    private shakeDuration: number = 0;

    // UI elements
    private uiDistance: HTMLElement;
    private uiHighScore: HTMLElement;
    private uiFinalDistance: HTMLElement;
    private uiSkinLabel: HTMLElement;
    private uiGameoverBest: HTMLElement | null = null;
    private uiHudGold: HTMLElement | null = null;
    private uiMenuGold: HTMLElement | null = null;
    private uiShopGold: HTMLElement | null = null;
    private uiGameoverGoldEarned: HTMLElement | null = null;

    private settings: GameSettings = {
        GRAVITY: 0.8,
        JUMP_STRENGTH: -12,
        PLAYER_SPEED: 5,
        PLATFORM_SPEED: 2.8,
        PLATFORM_SPAWN_INTERVAL: 45, 
        LAVA_SPEED: 0,
        LAVA_DELAY_FRAMES: 0,
        PLATFORM_SPRING_STRENGTH: -18
    };


    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;
        this.canvas.width = 400;
        this.canvas.height = 600;

        this.uiDistance = document.getElementById("distance")!;
        this.uiHighScore = document.getElementById("best-score")!;
        this.uiFinalDistance = document.getElementById("final-distance")!;
        this.uiSkinLabel = document.getElementById("current-skin-name-label")!;
        this.uiGameoverBest = document.getElementById("gameover-best-value");
        this.uiHudGold = document.getElementById("hud-gold");
        this.uiMenuGold = document.getElementById("menu-gold");
        this.uiShopGold = document.getElementById("shop-gold");
        this.uiGameoverGoldEarned = document.getElementById("gameover-gold-earned");

        const savedBest = localStorage.getItem("slime_best_distance");
        this.highScore = savedBest ? parseFloat(savedBest) : 0;
        this.updateBestScoreUI();

        this.gold = parseInt(localStorage.getItem("slime_gold") || "0");
        this.updateGoldUI();

        // Load unlocked skins
        const savedUnlocked = localStorage.getItem("slime_unlocked_skins");
        if (savedUnlocked) {
            const ids: string[] = JSON.parse(savedUnlocked);
            ids.forEach(id => this.unlockedSkins.add(id));
        }
        // Always ensure free skins are unlocked
        Game.FREE_SKINS.forEach(id => this.unlockedSkins.add(id));

        // 메인 화면 기본 위치 조정: 왼쪽 10px, 위쪽 30px 추가 이동
        // 기준: width/2-16 -> width/2-26, height/2-40 -> height/2-70
        this.startY = this.canvas.height / 2 - 70; 
        this.player = new Player(this.canvas.width / 2 - 13, this.startY, this.settings);
        this.lava = new Lava(this.canvas.width, this.canvas.height, this.settings);
        
        const savedSkinId = localStorage.getItem("slime_selected_skin_id");
        if (savedSkinId) {
            const index = this.skins.findIndex(s => s.id === savedSkinId);
            if (index !== -1 && this.unlockedSkins.has(savedSkinId)) this.currentSkinIndex = index;
        }
        this.applyCurrentSkin();
        this.mainMenuLoop();
    }

    private updateBestScoreUI(): void {
        const text = `BEST: ${this.highScore.toFixed(1)}m`;
        if (this.uiHighScore) this.uiHighScore.innerText = text;
    }

    private updateGoldUI(): void {
        const g = this.gold;
        if (this.uiHudGold) this.uiHudGold.innerText = `🪙 ${g}`;
        if (this.uiMenuGold) this.uiMenuGold.innerText = `${g}`;
        if (this.uiShopGold) this.uiShopGold.innerText = `🪙 ${g}`;
    }

    private saveUnlockedSkins(): void {
        localStorage.setItem("slime_unlocked_skins", JSON.stringify([...this.unlockedSkins]));
    }

    private tryUnlockSkin(index: number): boolean {
        const skin = this.skins[index];
        if (this.unlockedSkins.has(skin.id)) return true;
        const cost = (skin as any).unlockCost ?? 50;
        if (this.gold < cost) {
            this.showNotification("NOT ENOUGH GOLD!");
            return false;
        }
        this.gold -= cost;
        localStorage.setItem("slime_gold", this.gold.toString());
        this.unlockedSkins.add(skin.id);
        this.saveUnlockedSkins();
        this.updateGoldUI();
        this.showNotification(`UNLOCKED: ${skin.name}!`);
        return true;
    }

    public get isStarted(): boolean { return !this.sceneManager.is(SceneType.START) && !this.sceneManager.is(SceneType.SHOP); }
    public get isGameOver(): boolean { return this.sceneManager.is(SceneType.GAMEOVER); }

    private applyCurrentSkin(): void {
        const skin = this.skins[this.currentSkinIndex];
        this.player.setSkin(skin.colors, skin.id, skin.feature);
        if (this.uiSkinLabel) this.uiSkinLabel.innerText = skin.name;
    }

    public nextSkin(): void {
        this.currentSkinIndex = (this.currentSkinIndex + 1) % this.skins.length;
        this.applyCurrentSkin();
    }

    public prevSkin(): void {
        this.currentSkinIndex = (this.currentSkinIndex - 1 + this.skins.length) % this.skins.length;
        this.applyCurrentSkin();
    }

    private showNotification(text: string): void {
        this.notificationText = text;
        this.notificationTimer = 120;
    }

    public goToMainMenu(): void {
        this.sceneManager.changeScene(SceneType.START);
        this.isFogActive = false;
        this.distance = 0;
        this.maxDistance = 0;
        this.frameCount = 0;
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        
        // 메인 메뉴 복귀 시 동일하게 보정된 위치 적용
        this.player = new Player(this.canvas.width / 2 - 13, this.canvas.height / 2 - 70, this.settings);
        this.player.isJumping = false;
        this.player.vx = 0;
        this.player.vy = 0;
        
        this.applyCurrentSkin();
        this.mainMenuLoop();
    }

    private mainMenuLoop(): void {
        if (!this.sceneManager.is(SceneType.START) && !this.sceneManager.is(SceneType.SHOP)) return;
        this.draw();
        requestAnimationFrame(() => this.mainMenuLoop());
    }

    public reset(): void {
        this.sceneManager.changeScene(SceneType.PLAYING);
        this.distance = 0;
        this.maxDistance = 0;
        this.isFogActive = false;
        this.frameCount = 0;
        this.wasJumping = false;
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.hasReachedSky = false;
        this.hasReachedSpace = false;
        this.hasBrokenRecord = false;
        this.notificationText = "";
        this.notificationTimer = 0;
        this.settings.PLATFORM_SPEED = 2.8;
        this.lastGoldMilestone = 0;
        this.goldEarnedThisRun = 0;
        
        // 게임 시작 시에는 원래 중앙 위치로 리셋
        this.player = new Player(this.canvas.width / 2 - 16, this.canvas.height / 2 - 50, this.settings);
        this.lava = new Lava(this.canvas.width, this.canvas.height, this.settings);
        this.platforms = [];
        this.spawnInitialPlatforms();
        this.particles.clear();
        if (this.uiDistance) this.uiDistance.innerText = "0.0m";
        this.applyCurrentSkin();
        this.loop();
    }

    private spawnInitialPlatforms(): void {
        const centerY = this.canvas.height / 2;
        this.platforms.push(new Platform(this.canvas.width / 2 - 40, centerY, 80, this.settings, PlatformType.NORMAL, Biome.FOREST));
        let upY = centerY;
        for (let i = 0; i < 6; i++) {
            upY -= 100;
            this.spawnPlatform(upY);
        }
    }

    private spawnPlatform(y: number = -20): void {
        const width = 40 + Math.random() * 30;
        const lastPlatform = this.platforms[this.platforms.length - 1];
        let minX = 0, maxX = this.canvas.width - width;
        if (lastPlatform) {
            const maxJumpDistance = 140; 
            minX = Math.max(0, lastPlatform.x - maxJumpDistance);
            maxX = Math.min(this.canvas.width - width, lastPlatform.x + lastPlatform.width + maxJumpDistance - width);
            if (minX > maxX) { const center = (minX + maxX) / 2; minX = center - 5; maxX = center + 5; }
        }
        let currentBiome = Biome.FOREST;
        if (this.maxDistance >= 150) currentBiome = Biome.SPACE;
        else if (this.maxDistance >= 50) currentBiome = Biome.SKY;
        const progress = Math.min(1.0, this.maxDistance / 100); 
        let type = PlatformType.NORMAL;
        const rand = Math.random();
        const fogProb = this.maxDistance > 30 ? Math.min(0.12, (this.maxDistance - 30) * 0.002) : 0;
        const springProb = progress * 0.10, fragileProb = progress * 0.15, movingProb = progress * 0.25;
        if (rand < fogProb) type = PlatformType.FOG;
        else if (rand < fogProb + springProb) type = PlatformType.SPRING;
        else if (rand < fogProb + springProb + fragileProb) type = PlatformType.FRAGILE;
        else if (rand < fogProb + springProb + fragileProb + movingProb) type = PlatformType.MOVING;
        this.platforms.push(new Platform(minX + Math.random() * (maxX - minX), y, width, this.settings, type, currentBiome));
        const newPlatform = this.platforms[this.platforms.length - 1];
        if (Math.random() < 0.04) newPlatform.hasEnvelope = true;
    }

    public openShop(): void {
        this.sceneManager.changeScene(SceneType.SHOP);
        const countLabel = document.getElementById("total-skins-count");
        if (countLabel) countLabel.innerText = `${this.unlockedSkins.size} / ${this.skins.length} SKINS`;
        this.renderShopCards();
    }

    public closeShop(): void {
        this.sceneManager.changeScene(SceneType.START);
        this.applyCurrentSkin();
        this.mainMenuLoop();
    }

    private renderShopCards(): void {
        const grid = document.getElementById("shop-grid");
        if (!grid) return;
        grid.innerHTML = "";
        const countLabel = document.getElementById("total-skins-count");
        if (countLabel) countLabel.innerText = `${this.unlockedSkins.size} / ${this.skins.length} SKINS`;

        // 해금된 스킨 먼저, 잠긴 스킨 나중 (원본 인덱스 보존)
        const sorted = this.skins
            .map((skin, index) => ({ skin, index }))
            .sort((a, b) => {
                const au = this.unlockedSkins.has(a.skin.id) ? 0 : 1;
                const bu = this.unlockedSkins.has(b.skin.id) ? 0 : 1;
                return au - bu;
            });

        sorted.forEach(({ skin, index }) => {
            const isUnlocked = this.unlockedSkins.has(skin.id);
            const isSelected = this.currentSkinIndex === index;
            const cost = (skin as any).unlockCost ?? 50;
            const isFree = cost === 0;
            const card = document.createElement("div");
            card.className = `skin-card ${isSelected ? "selected" : ""} ${!isUnlocked ? "locked" : ""}`;

            let actionBtn = "";
            if (isSelected) {
                actionBtn = `<button class="card-btn btn-equipped" disabled>✓ EQUIPPED</button>`;
            } else if (isUnlocked) {
                actionBtn = `<button class="card-btn btn-equip">EQUIP</button>`;
            } else {
                actionBtn = `<button class="card-btn btn-unlock">🔒 ${cost}G</button>`;
            }

            card.innerHTML = `
                <canvas class="card-preview-canvas" width="64" height="64"></canvas>
                <div class="card-info">
                    <div class="card-name">${skin.name}</div>
                    <div class="card-lore">${skin.lore}</div>
                    ${actionBtn}
                </div>
            `;

            const canvas = card.querySelector("canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d")!;
            const tempPlayer = new Player(16, 16, this.settings);
            tempPlayer.setSkin(skin.colors, skin.id, skin.feature);
            if (!isUnlocked) {
                ctx.globalAlpha = 0.35; tempPlayer.draw(ctx); ctx.globalAlpha = 1.0;
                ctx.font = "22px Arial"; ctx.textAlign = "center"; ctx.fillText("🔒", 32, 40);
            } else {
                tempPlayer.draw(ctx);
            }

            const btn = card.querySelector("button");
            if (btn && !btn.disabled) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    if (isUnlocked) {
                        this.currentSkinIndex = index;
                        localStorage.setItem("slime_selected_skin_id", skin.id);
                        this.applyCurrentSkin();
                        this.renderShopCards();
                    } else {
                        if (this.tryUnlockSkin(index)) {
                            this.currentSkinIndex = index;
                            localStorage.setItem("slime_selected_skin_id", skin.id);
                            this.applyCurrentSkin();
                            this.renderShopCards();
                        } else {
                            this.renderShopCards();
                        }
                    }
                };
            }
            grid.appendChild(card);
        });
    }

    public start(): void {
        if (this.sceneManager.is(SceneType.START)) {
            this.reset(); 
        }
    }

    public togglePause(): void {
        if (this.sceneManager.is(SceneType.GAMEOVER) || this.sceneManager.is(SceneType.START)) return;
        if (this.sceneManager.is(SceneType.PAUSE)) { this.sceneManager.changeScene(SceneType.PLAYING); this.loop(); }
        else if (this.sceneManager.is(SceneType.PLAYING)) { this.sceneManager.changeScene(SceneType.PAUSE); }
    }

    public shake(intensity: number, duration: number): void { this.shakeIntensity = intensity; this.shakeDuration = duration; }

    private loop(): void {
        if (!this.sceneManager.is(SceneType.PLAYING)) return;
        this.update(); this.draw();
        requestAnimationFrame(() => this.loop());
    }

    private update(): void {
        this.frameCount++;
        if (this.shakeDuration > 0) this.shakeDuration--; else this.shakeIntensity = 0;
        if (this.notificationTimer > 0) this.notificationTimer--;
        const currentIsJumping = this.player.isJumping;
        if (currentIsJumping && !this.wasJumping && this.player.vy < 0) {
            this.particles.createJumpEffect(this.player.x + this.player.width / 2, this.player.y + this.player.height, this.player.mainColor);
            this.audio.playJump();
        }
        this.wasJumping = currentIsJumping;
        this.player.update(this.canvas.width);
        this.particles.update();
        this.distance += (this.settings.PLATFORM_SPEED / 100); 
        if (this.distance > this.maxDistance) {
            this.maxDistance = this.distance;
            // Gold milestone: +20 gold per 50m (runs first so biome messages take priority)
            const newMilestone = Math.floor(this.maxDistance / 50);
            if (newMilestone > this.lastGoldMilestone) {
                const earned = (newMilestone - this.lastGoldMilestone) * 20;
                this.gold += earned;
                this.goldEarnedThisRun += earned;
                this.lastGoldMilestone = newMilestone;
                localStorage.setItem("slime_gold", this.gold.toString());
                this.updateGoldUI();
                this.showNotification(`+${earned} GOLD!`);
            }
            if (this.maxDistance >= 50 && !this.hasReachedSky) {
                this.hasReachedSky = true; this.showNotification("ENTERING SKY");
                this.shake(5, 20); this.particles.createCelebrationEffect(this.canvas.width / 2, this.canvas.height / 2);
            } else if (this.maxDistance >= 150 && !this.hasReachedSpace) {
                this.hasReachedSpace = true; this.showNotification("REACHED SPACE");
                this.shake(8, 30); this.particles.createCelebrationEffect(this.canvas.width / 2, this.canvas.height / 2);
            }
            if (this.highScore > 5 && this.maxDistance > this.highScore && !this.hasBrokenRecord) {
                this.hasBrokenRecord = true; this.showNotification("NEW BEST!");
                this.particles.createCelebrationEffect(this.player.x + this.player.width / 2, this.player.y);
            }
            if (this.uiDistance) this.uiDistance.innerText = `${this.maxDistance.toFixed(1)}m`;
            if (this.maxDistance > this.highScore) {
                this.highScore = this.maxDistance;
                localStorage.setItem("slime_best_distance", this.highScore.toString());
                this.updateBestScoreUI();
            }
        }
        this.platforms.forEach(p => p.update(this.canvas.width));
        this.platforms = this.platforms.filter(p => !p.isOffScreen(this.canvas.height));
        if (this.platforms.length > 0) {
            const highestY = Math.min(...this.platforms.map(p => p.y));
            if (highestY > -100) this.spawnPlatform(highestY - 100);
        }
        this.checkCollisions();
        if (this.lava.checkCollision(this.player) || this.player.y > this.canvas.height) {
            const isNewRecord = this.maxDistance > this.highScore;
            if (isNewRecord) {
                this.highScore = this.maxDistance;
                localStorage.setItem("slime_best_distance", this.highScore.toString());
                this.updateBestScoreUI();
            }
            this.sceneManager.changeScene(SceneType.GAMEOVER);
            this.shake(10, 20); this.audio.playGameOver();
            this.uiFinalDistance.innerText = `${this.maxDistance.toFixed(1)}m`;
            if (this.uiGameoverBest) this.uiGameoverBest.innerText = `${this.highScore.toFixed(1)}m`;
            if (this.uiGameoverGoldEarned) this.uiGameoverGoldEarned.innerText = `+${this.goldEarnedThisRun} GOLD`;
            const badge = document.getElementById("new-record-badge");
            if (badge) {
                badge.classList.toggle("show-badge", isNewRecord);
                if (isNewRecord) { badge.classList.remove("show-badge"); badge.offsetWidth; badge.classList.add("show-badge"); }
            }
        }
    }

    private checkCollisions(): void {
        if (this.player.vy > 0) {
            for (const platform of this.platforms) {
                if (platform.type === PlatformType.FRAGILE && (platform as any).isBroken) continue;
                if (this.player.x < platform.x + platform.width && this.player.x + this.player.width > platform.x &&
                    this.player.y + this.player.height > platform.y && this.player.y + this.player.height < platform.y + platform.height + this.player.vy) {
                    if (this.player.isJumping) { this.particles.createLandingEffect(this.player.x + this.player.width / 2, platform.y, this.player.mainColor); this.audio.playLand(); }
                    platform.onStepped();
                    if (platform.type === PlatformType.FOG) { this.isFogActive = true; this.showNotification("FOGGY..."); } else { this.isFogActive = false; }
                    if (platform.type === PlatformType.SPRING) {
                        this.player.y = platform.y - this.player.height; this.player.vy = this.settings.PLATFORM_SPRING_STRENGTH;
                        this.player.isJumping = true; this.particles.createJumpEffect(this.player.x + this.player.width / 2, platform.y, this.player.mainColor);
                        this.audio.playSpring(); this.shake(5, 10);
                    } else { this.player.y = platform.y - this.player.height; this.player.vy = this.settings.PLATFORM_SPEED; this.player.isJumping = false; }
                    break;
                }
            }
        }

        // 돈봉투 픽업 감지 (플레이어가 닿으면 즉시 수집)
        for (const platform of this.platforms) {
            if (!platform.hasEnvelope || platform.envelopeCollected) continue;
            const ex = platform.x + platform.width / 2 - 9;
            const ey = platform.y - 28;
            const ew = 18, eh = 20;
            if (this.player.x < ex + ew && this.player.x + this.player.width > ex &&
                this.player.y < ey + eh && this.player.y + this.player.height > ey) {
                platform.envelopeCollected = true;
                this.gold += 1;
                this.goldEarnedThisRun += 1;
                localStorage.setItem("slime_gold", this.gold.toString());
                this.updateGoldUI();
                this.particles.createLandingEffect(ex + 9, ey + 6, "#FFD700");
            }
        }
    }

    private draw(): void {
        const ctx = this.ctx, canvas = this.canvas;
        ctx.save();
        if (this.shakeDuration > 0) ctx.translate((Math.random() - 0.5) * this.shakeIntensity, (Math.random() - 0.5) * this.shakeIntensity);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let colorTop = "#87ceeb", colorBottom = "#2d5a27";
        if (this.distance < 50) {
            const t = this.distance / 50; colorTop = lerpColor("#87ceeb", "#4a90e2", t); colorBottom = lerpColor("#2d5a27", "#1a1a2e", t);
        } else if (this.distance < 150) {
            const t = (this.distance - 50) / 100; colorTop = lerpColor("#4a90e2", "#0b0d17", t); colorBottom = lerpColor("#1a1a2e", "#0b0d17", t);
        } else {
            const t = Math.min(1, (this.distance - 150) / 100); colorTop = lerpColor("#0b0d17", "#000000", t); colorBottom = lerpColor("#0b0d17", "#050508", t);
        }
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, colorTop); grad.addColorStop(1, colorBottom);
        ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawBackgroundParticles(ctx, canvas.width, canvas.height);

        if (this.sceneManager.is(SceneType.START) || this.sceneManager.is(SceneType.SHOP)) {
            drawMainMenuBackground(ctx, canvas.width, canvas.height);
            ctx.save();
            const idleWave = Math.sin(Date.now() * 0.003) * 15; 
            const centerX = this.player.x + this.player.width / 2 + 3;
            const centerY = this.player.y + this.player.height / 2 + idleWave + 30;
            
            // 1. 슬라임 렌더링 (2배 확대)
            ctx.translate(centerX, centerY);
            ctx.scale(2.0, 2.0); 
            ctx.translate(-centerX, -centerY);
            this.player.draw(ctx);
            ctx.restore();
        } else {
            ctx.save();
            if (this.isFogActive) ctx.globalAlpha = 0.01;
            this.platforms.forEach(p => p.draw(ctx));
            ctx.restore();
            this.lava.draw(ctx);
            this.player.draw(ctx);
            this.particles.draw(ctx);
            this.drawControlGuides(ctx);
        }

        if (this.notificationTimer > 0 && this.notificationText) {
            ctx.save(); ctx.font = '20px "Press Start 2P"'; ctx.textAlign = "center";
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, this.notificationTimer / 30)})`;
            ctx.shadowColor = "black"; ctx.shadowBlur = 4; ctx.fillText(this.notificationText, canvas.width / 2, canvas.height / 3);
            ctx.restore();
        }
        ctx.restore();
    }


    private drawControlGuides(ctx: CanvasRenderingContext2D): void {
        const cw = this.canvas.width, ch = this.canvas.height;
        const isTouchingLeft = this.player.isTouching && this.player.touchX !== null && this.player.touchX < window.innerWidth / 2;
        const isTouchingRight = this.player.isTouching && this.player.touchX !== null && this.player.touchX >= window.innerWidth / 2;
        ctx.save(); ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
        const leftAlpha = isTouchingLeft ? 0.8 : 0.15; ctx.strokeStyle = `rgba(255, 255, 255, ${leftAlpha})`;
        this.drawArrow(ctx, cw * 0.15, ch * 0.7, -Math.PI * 0.75, 25);
        const rightAlpha = isTouchingRight ? 0.8 : 0.15; ctx.strokeStyle = `rgba(255, 255, 255, ${rightAlpha})`;
        this.drawArrow(ctx, cw * 0.85, ch * 0.7, -Math.PI * 0.25, 25);
        ctx.restore();
    }

    private drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number): void {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size, 0); ctx.lineTo(size - 10, -10); ctx.moveTo(size, 0); ctx.lineTo(size - 10, 10); ctx.stroke(); ctx.restore();
    }
}
