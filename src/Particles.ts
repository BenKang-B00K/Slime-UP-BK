export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

export class ParticleManager {
    private particles: Particle[] = [];

    private hexToRgba(hex: string): string {
        const c = hex.replace("#", "");
        const full = c.length === 3 ? c.split("").map(x => x + x).join("") : c;
        const r = parseInt(full.slice(0, 2), 16);
        const g = parseInt(full.slice(2, 4), 16);
        const b = parseInt(full.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b},`;
    }

    // 점프 시 효과 (가볍게 튀는 느낌)
    createJumpEffect(x: number, y: number, color: string = "#55DD55") {
        const c = this.hexToRgba(color);
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: x + Math.random() * 10 - 5,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 1.5 + 0.5,
                life: 0.6,
                color: c,
                size: Math.random() * 2 + 1
            });
        }
    }

    // 착지 시 효과 (살짝 퍼지는 느낌)
    createLandingEffect(x: number, y: number, color: string = "#55DD55") {
        const c = this.hexToRgba(color);
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * -2,
                life: 0.7,
                color: c,
                size: Math.random() * 3 + 1
            });
        }
    }

    // 최고 기록 경신 시 축하 효과 (색상 다양화)
    createCelebrationEffect(x: number, y: number) {
        const colors = ["#FFD700", "#FF4757", "#2ED573", "#54A0FF", "#A55EEA"];
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 2,
                life: 1.0,
                color: this.hexToRgba(colors[Math.floor(Math.random() * colors.length)]),
                size: Math.random() * 4 + 2
            });
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // 중력 적용 (슬라임 조각이 바닥으로 떨어지게)
            p.life -= 0.02;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    clear() {
        this.particles = [];
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.particles.forEach(p => {
            ctx.fillStyle = `${p.color} ${Math.max(0, p.life)})`;
            // 픽셀 느낌을 위해 사각형으로 그림
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        });
    }
}
