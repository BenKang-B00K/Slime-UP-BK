import { GameObject, GameSettings } from "./types.js";

export class Lava implements GameObject {
    x: number = 0;
    y: number;
    width: number;
    height: number;
    speed: number;

    constructor(canvasWidth: number, canvasHeight: number, settings: GameSettings) {
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.y = canvasHeight - 20; // 시작 위치
        this.speed = settings.LAVA_SPEED;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const now = Date.now();
        const y = Math.floor(this.y);
        const w = this.width;
        const h = this.height;

        ctx.save();

        // 1. 일렁이는 열기 글로우 (Pulsing Glow)
        const pulse = Math.sin(now * 0.003) * 5 + 15;
        ctx.shadowBlur = pulse;
        ctx.shadowColor = "rgba(255, 50, 0, 0.9)";

        // 2. 이중 물결 (Complex Wave) 합성
        ctx.beginPath();
        ctx.moveTo(0, y);

        const wave1Speed = now * 0.004;
        const wave2Speed = now * 0.007;

        for (let x = 0; x <= w; x += 5) {
            // 두 개의 사인파를 섞어 더 불규칙한 물결 생성
            const s1 = Math.sin(x * 0.015 + wave1Speed) * 8;
            const s2 = Math.sin(x * 0.03 + wave2Speed) * 4;
            const waveY = y + s1 + s2;
            ctx.lineTo(x, waveY);
        }

        ctx.lineTo(w, y + h);
        ctx.lineTo(0, y + h);
        ctx.closePath();

        // 3. 본체 그라데이션 (마그마 코어)
        const grad = ctx.createLinearGradient(0, y - 10, 0, y + 80);
        grad.addColorStop(0, "#FFD700"); // 맨 위: 아주 뜨거운 금색/노랑
        grad.addColorStop(0.1, "#FF4500"); // 오렌지 레드
        grad.addColorStop(0.4, "#B22222"); // 크림슨
        grad.addColorStop(1, "#3E2723");   // 바닥: 식어서 어두워진 갈색
        ctx.fillStyle = grad;
        ctx.fill();

        // 5. 강렬한 열기 하이라이트 (White-Hot Edges)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255, 255, 200, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // 6. 끓어오르는 기포와 연기 (Bubbles & Heat Haze)
        for (let i = 0; i < 12; i++) {
            const bX = (i * 47 + now * 0.05) % w;
            const bOffset = Math.sin(now * 0.005 + i) * 15;
            const bY = y + bOffset;

            // 기포
            ctx.fillStyle = `rgba(255, 200, 0, ${Math.max(0, 0.6 - Math.abs(bOffset)/15)})`;
            ctx.beginPath();
            ctx.arc(bX, bY, 2 + (i % 3), 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    update(): void {
        this.y -= this.speed; // 위로 차오름
    }

    checkCollision(player: GameObject): boolean {
        // 플레이어의 아래쪽이 용암 표면보다 아래에 있는지 체크
        return player.y + player.height > this.y;
    }
}
