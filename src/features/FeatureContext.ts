import type { SkinColors } from "../types.js";

export interface FeatureCtx {
    ctx: CanvasRenderingContext2D;
    feature: string;
    ox: number; oy: number; w: number; h: number;
    center: number; top: number;
    moveDir: number;
    colors: SkinColors;
}

export function makeGumdropPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
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

export function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
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
    ctx.fill();
}

export function drawPixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, p: number): void {
    ctx.fillRect(x, y, w * p, h * p);
}
