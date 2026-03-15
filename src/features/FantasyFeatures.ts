import { FeatureCtx, makeGumdropPath, drawRoundedRect, drawPixelRect } from "./FeatureContext.js";

export function tryFantasyFeatures(fc: FeatureCtx): boolean {
    const { ctx, ox, oy, w, h, center, top, moveDir, colors } = fc;
    let matched = true;
    switch (fc.feature) {
            // ── Fantasy skins ──────────────────────────────────────────────
            case "knight_helm": {
                // Outer shell
                ctx.fillStyle = colors.outline;
                drawRoundedRect(ctx, center-14, top-4, 28, 22, 10);
                ctx.fillStyle = colors.main;
                drawRoundedRect(ctx, center-12, top-3, 24, 19, 9);
                // Visor
                ctx.fillStyle = "rgba(0,0,0,0.75)";
                ctx.fillRect(center-8, top+6, 16, 5);
                ctx.fillStyle = "rgba(255,255,255,0.18)";
                ctx.fillRect(center-7, top+6, 6, 2);
                // Cheek guards
                ctx.fillStyle = colors.outline;
                ctx.fillRect(center-14, top+11, 4, 7);
                ctx.fillRect(center+10, top+11, 4, 7);
                // Edge shine
                ctx.fillStyle = colors.highlight;
                ctx.fillRect(center-11, top-1, 2, 14);
                break;
            }
            case "dragon_horns": {
                // Horn outlines (dark)
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-8,top+2); ctx.bezierCurveTo(center-16,top-6,center-20,top-18,center-13,top-26); ctx.bezierCurveTo(center-17,top-15,center-13,top-6,center-5,top+2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+8,top+2);  ctx.bezierCurveTo(center+16,top-6,center+20,top-18,center+13,top-26); ctx.bezierCurveTo(center+17,top-15,center+13,top-6,center+5,top+2);  ctx.closePath(); ctx.fill();
                // Horn body
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-7,top+2); ctx.bezierCurveTo(center-14,top-5,center-17,top-16,center-13,top-22); ctx.bezierCurveTo(center-15,top-12,center-11,top-5,center-5,top+2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+7,top+2);  ctx.bezierCurveTo(center+14,top-5,center+17,top-16,center+13,top-22); ctx.bezierCurveTo(center+15,top-12,center+11,top-5,center+5,top+2);  ctx.closePath(); ctx.fill();
                // Tiny flame breath
                ctx.save(); ctx.globalAlpha = 0.75;
                ctx.fillStyle = "#ff6b00";
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.58); ctx.bezierCurveTo(center+22,oy+h*0.48,center+26,oy+h*0.62,center+18,oy+h*0.7); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#ffd700";
                ctx.beginPath(); ctx.moveTo(center+13,oy+h*0.60); ctx.bezierCurveTo(center+19,oy+h*0.52,center+22,oy+h*0.63,center+17,oy+h*0.68); ctx.closePath(); ctx.fill();
                ctx.restore();
                break;
            }
            case "elf_ears": {
                // Left ear
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-12,top+8); ctx.bezierCurveTo(center-16,top+6,center-26,top+4,center-24,top+10); ctx.bezierCurveTo(center-22,top+16,center-14,top+14,center-12,top+12); ctx.closePath(); ctx.fill();
                // Right ear
                ctx.beginPath(); ctx.moveTo(center+12,top+8); ctx.bezierCurveTo(center+16,top+6,center+26,top+4,center+24,top+10); ctx.bezierCurveTo(center+22,top+16,center+14,top+14,center+12,top+12); ctx.closePath(); ctx.fill();
                // Inner ear pink
                ctx.fillStyle = "#ffb7c5";
                ctx.beginPath(); ctx.moveTo(center-13,top+9); ctx.bezierCurveTo(center-16,top+7,center-23,top+6,center-21,top+10); ctx.bezierCurveTo(center-19,top+14,center-14,top+13,center-13,top+11); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+13,top+9); ctx.bezierCurveTo(center+16,top+7,center+23,top+6,center+21,top+10); ctx.bezierCurveTo(center+19,top+14,center+14,top+13,center+13,top+11); ctx.closePath(); ctx.fill();
                break;
            }
            case "vampire_fangs": {
                // Red eye glow over existing eyes
                ctx.save(); ctx.globalAlpha = 0.5;
                ctx.fillStyle = "#ff0000";
                ctx.beginPath(); ctx.ellipse(center-4,oy+h*0.52+3,4.5,5,0,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+4,oy+h*0.52+3,4.5,5,0,0,Math.PI*2); ctx.fill();
                ctx.restore();
                // Fangs
                ctx.fillStyle = "#fff8f0";
                ctx.beginPath(); ctx.moveTo(center-4,oy+h*0.62); ctx.lineTo(center-6,oy+h*0.79); ctx.lineTo(center-2,oy+h*0.68); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+4,oy+h*0.62); ctx.lineTo(center+6,oy+h*0.79); ctx.lineTo(center+2,oy+h*0.68); ctx.closePath(); ctx.fill();
                // Blood tips
                ctx.fillStyle = "#ff4060";
                ctx.beginPath(); ctx.arc(center-6,oy+h*0.79,1.5,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+6,oy+h*0.79,1.5,0,Math.PI*2); ctx.fill();
                break;
            }
            case "ghost_face": {
                // Translucent wispy overlay
                ctx.save(); ctx.globalAlpha = 0.32;
                ctx.fillStyle = "#e8f0ff";
                makeGumdropPath(ctx, 0, 0, w, h); ctx.fill();
                // Wiggly bottom fringe
                ctx.fillStyle = "#d0e0ff";
                ctx.beginPath(); ctx.moveTo(0, oy+h*0.78);
                for (let i = 0; i <= w; i += 4) ctx.lineTo(i, oy+h*0.78 + (i%8 < 4 ? 3 : -3));
                ctx.lineTo(w, oy+h); ctx.lineTo(0, oy+h); ctx.closePath(); ctx.fill();
                ctx.restore();
                // Hollow dark eyes (drawn over overlay)
                ctx.fillStyle = "rgba(20,30,60,0.88)";
                ctx.beginPath(); ctx.ellipse(center-5,oy+h*0.45,4,5,0,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+5,oy+h*0.45,4,5,0,0,Math.PI*2); ctx.fill();
                break;
            }
            case "witch_brim": {
                ctx.fillStyle = colors.outline;
                // Wide brim
                ctx.beginPath(); ctx.ellipse(center, top+6, 19, 5, 0, 0, Math.PI*2); ctx.fill();
                // Cone hat
                ctx.beginPath(); ctx.moveTo(center-11,top+5); ctx.lineTo(center-3,top-22); ctx.lineTo(center+3,top-22); ctx.lineTo(center+11,top+5); ctx.closePath(); ctx.fill();
                // Brim highlight strip
                ctx.fillStyle = colors.main;
                ctx.fillRect(center-11, top+2, 22, 4);
                // Crescent moon charm
                ctx.fillStyle = "#ffd700";
                ctx.beginPath(); ctx.arc(center+1, top-14, 3.5, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center+3, top-15.5, 3, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "angel_halo": {
                // Soft feather wing nubs (drawn behind body feel)
                ctx.save(); ctx.globalAlpha = 0.45;
                ctx.fillStyle = "#fff8e0";
                ctx.beginPath(); ctx.ellipse(center-18, oy+h*0.38, 12, 8, -0.3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+18, oy+h*0.38, 12, 8,  0.3, 0, Math.PI*2); ctx.fill();
                ctx.restore();
                // Glowing golden halo ring
                ctx.save();
                ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 12;
                ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.ellipse(center, top-6, 13, 4, 0, 0, Math.PI*2); ctx.stroke();
                ctx.shadowBlur = 0; ctx.restore();
                break;
            }
            case "demon_horns": {
                // Horn outlines
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-5,top+2); ctx.bezierCurveTo(center-12,top-4,center-8,top-18,center-3,top-22); ctx.bezierCurveTo(center-10,top-14,center-14,top-4,center-8,top+2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+5,top+2);  ctx.bezierCurveTo(center+12,top-4,center+8,top-18,center+3,top-22); ctx.bezierCurveTo(center+10,top-14,center+14,top-4,center+8,top+2);  ctx.closePath(); ctx.fill();
                // Horn bodies
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-5,top+2); ctx.bezierCurveTo(center-10,top-3,center-6,top-14,center-3,top-18); ctx.bezierCurveTo(center-8,top-10,center-11,top-3,center-7,top+2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+5,top+2);  ctx.bezierCurveTo(center+10,top-3,center+6,top-14,center+3,top-18); ctx.bezierCurveTo(center+8,top-10,center+11,top-3,center+7,top+2);  ctx.closePath(); ctx.fill();
                // Arrow-tip tail
                ctx.strokeStyle = colors.main; ctx.lineWidth = 3; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+14,oy+h-4); ctx.bezierCurveTo(center+22,oy+h+4,center+20,oy+h-8,center+16,oy+h+4); ctx.stroke();
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center+15,oy+h+4); ctx.lineTo(center+18,oy+h+8); ctx.lineTo(center+13,oy+h+7); ctx.closePath(); ctx.fill();
                break;
            }
            case "mermaid_fin": {
                // Tail outline
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-10,oy+h); ctx.bezierCurveTo(center-14,oy+h+10,center-16,oy+h+22,center,oy+h+28); ctx.bezierCurveTo(center+16,oy+h+22,center+14,oy+h+10,center+10,oy+h); ctx.closePath(); ctx.fill();
                // Tail body
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-8,oy+h); ctx.bezierCurveTo(center-12,oy+h+8,center-14,oy+h+20,center,oy+h+25); ctx.bezierCurveTo(center+14,oy+h+20,center+12,oy+h+8,center+8,oy+h); ctx.closePath(); ctx.fill();
                // Fin tips
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center-2,oy+h+24); ctx.lineTo(center-13,oy+h+32); ctx.lineTo(center-4,oy+h+26); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+2,oy+h+24); ctx.lineTo(center+13,oy+h+32); ctx.lineTo(center+4,oy+h+26); ctx.closePath(); ctx.fill();
                // Scale arches
                ctx.fillStyle = "rgba(255,255,255,0.22)";
                for (let sy = 0; sy < 3; sy++) for (let sx = 0; sx < 3; sx++) {
                    ctx.beginPath(); ctx.arc(center-5+sx*5, oy+h+5+sy*7, 3, 0, Math.PI, true); ctx.fill();
                }
                break;
            }
            case "unicorn_horn": {
                // Spiral horn
                ctx.save(); ctx.translate(center, top);
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(-4,2); ctx.lineTo(-1,-22); ctx.lineTo(1,-22); ctx.lineTo(4,2); ctx.closePath(); ctx.fill();
                const hornGrd = ctx.createLinearGradient(-4,2,4,2);
                hornGrd.addColorStop(0, colors.main); hornGrd.addColorStop(1, colors.highlight);
                ctx.fillStyle = hornGrd;
                ctx.beginPath(); ctx.moveTo(-3,2); ctx.lineTo(-0.8,-20); ctx.lineTo(0.8,-20); ctx.lineTo(3,2); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 0.8;
                for (let i = 0; i < 4; i++) {
                    const y1 = 2 - i * 5.5;
                    ctx.beginPath(); ctx.moveTo(-1.5,y1); ctx.quadraticCurveTo(2.5,y1-2,0.5,y1-4); ctx.stroke();
                }
                ctx.restore();
                // Orbiting sparkles
                const uniT = Date.now() * 0.003;
                ctx.fillStyle = "#ffd700";
                for (let i = 0; i < 4; i++) {
                    const sx = center + Math.cos(uniT + i*1.57)*12;
                    const sy = top - 10 + Math.sin(uniT*1.3 + i*1.57)*7;
                    ctx.beginPath(); ctx.arc(sx, sy, Math.abs(Math.sin(uniT+i))*2.5+0.5, 0, Math.PI*2); ctx.fill();
                }
                break;
            }
            case "phoenix_crest": {
                const phT = Date.now() * 0.004;
                const phColors = ["#ff2d00","#ff6b00","#ffd700","#ff4500","#ff8c00"];
                const phHeights = [14,20,26,20,14];
                for (let i = 0; i < 5; i++) {
                    const fx = center - 8 + i * 4;
                    const fh = phHeights[i] + Math.sin(phT + i*0.8)*4;
                    ctx.save(); ctx.globalAlpha = 0.88;
                    const fGrd = ctx.createLinearGradient(fx, top+2, fx, top-fh);
                    fGrd.addColorStop(0, "rgba(255,80,0,0.9)");
                    fGrd.addColorStop(0.6, phColors[i]);
                    fGrd.addColorStop(1, "rgba(255,220,0,0)");
                    ctx.fillStyle = fGrd;
                    const fw = 4.5 - i * 0.2;
                    ctx.beginPath(); ctx.moveTo(fx-fw,top+2); ctx.bezierCurveTo(fx-fw*2,top-fh*0.4,fx+Math.sin(phT+i)*2,top-fh,fx,top-fh); ctx.bezierCurveTo(fx-Math.sin(phT+i)*2,top-fh,fx+fw*2,top-fh*0.4,fx+fw,top+2); ctx.closePath(); ctx.fill();
                    ctx.restore();
                }
                break;
            }
            case "fairy_dust": {
                // Dragonfly-style wings
                ctx.save(); ctx.globalAlpha = 0.68;
                ctx.fillStyle = "rgba(220,200,255,0.55)";
                ctx.strokeStyle = "rgba(180,150,255,0.5)"; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.ellipse(center-18, oy+h*0.28, 13, 8, -0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.ellipse(center-16, oy+h*0.54, 9,  6, -0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.ellipse(center+18, oy+h*0.28, 13, 8,  0.4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.ellipse(center+16, oy+h*0.54, 9,  6,  0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.restore();
                // Orbiting sparkle dust
                const fdT = Date.now() * 0.003;
                for (let i = 0; i < 5; i++) {
                    const sx = center + Math.cos(fdT*0.7 + i*1.26)*18;
                    const sy = oy+h*0.5 + Math.sin(fdT + i*1.26)*14;
                    ctx.save(); ctx.globalAlpha = Math.abs(Math.sin(fdT*1.2+i))*0.8+0.2;
                    ctx.fillStyle = i%2===0 ? "#ffd700" : "#ff90ff";
                    ctx.beginPath(); ctx.arc(sx, sy, Math.abs(Math.sin(fdT*1.5+i))*2.5+0.5, 0, Math.PI*2); ctx.fill();
                    ctx.restore();
                }
                break;
            }
            case "skull_mask": {
                ctx.save(); ctx.globalAlpha = 0.9;
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.42, 11, 12, 0, 0, Math.PI*2); ctx.fill();
                // Eye sockets
                ctx.fillStyle = "#1a1a1a";
                ctx.beginPath(); ctx.ellipse(center-5, oy+h*0.38, 4, 4.5, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+5, oy+h*0.38, 4, 4.5, 0, 0, Math.PI*2); ctx.fill();
                // Nose cavity
                ctx.beginPath(); ctx.moveTo(center-2, oy+h*0.54); ctx.lineTo(center, oy+h*0.61); ctx.lineTo(center+2, oy+h*0.54); ctx.closePath(); ctx.fill();
                // Teeth gaps
                ctx.fillStyle = "#1a1a1a";
                ctx.fillRect(center-7, oy+h*0.66, 14, 3);
                ctx.fillStyle = colors.highlight;
                for (let t = 0; t < 4; t++) ctx.fillRect(center-6+t*4, oy+h*0.66, 2.5, 6);
                ctx.restore();
                break;
            }
            case "crystal_crown": {
                const cryColors = ["#a8d8ff","#74b9ff","#d4f0ff","#4a90d9","#c8e8ff"];
                const cryH = [12,18,24,18,12];
                for (let i = 0; i < 5; i++) {
                    const cx2 = center - 10 + i * 5;
                    ctx.fillStyle = cryColors[i % cryColors.length];
                    ctx.beginPath(); ctx.moveTo(cx2-2,top+2); ctx.lineTo(cx2,top-cryH[i]); ctx.lineTo(cx2+2,top+2); ctx.closePath(); ctx.fill();
                    ctx.fillStyle = "rgba(255,255,255,0.4)";
                    ctx.beginPath(); ctx.moveTo(cx2-1,top+2); ctx.lineTo(cx2-0.4,top-cryH[i]+5); ctx.lineTo(cx2+1,top+2); ctx.closePath(); ctx.fill();
                }
                // Crown band
                ctx.fillStyle = "#2980b9";
                ctx.fillRect(center-12, top+0, 24, 4);
                ctx.fillStyle = "rgba(255,255,255,0.28)";
                ctx.fillRect(center-12, top+0, 24, 1.5);
                // Animated glint on tallest crystal
                const glint = (Math.sin(Date.now()*0.005)+1)*0.4+0.2;
                ctx.fillStyle = `rgba(255,255,255,${glint})`;
                ctx.beginPath(); ctx.arc(center, top-22, 2, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "dark_orb": {
                const orbT = Date.now() * 0.002;
                const orbX = center + 16 + Math.sin(orbT)*3;
                const orbY = oy + h*0.3 + Math.cos(orbT*0.7)*4;
                ctx.save();
                ctx.shadowColor = "#8b00ff"; ctx.shadowBlur = 15;
                const orbGrd = ctx.createRadialGradient(orbX-2,orbY-2,0,orbX,orbY,8);
                orbGrd.addColorStop(0, "#c060ff"); orbGrd.addColorStop(0.5, colors.main); orbGrd.addColorStop(1, "rgba(30,0,60,0)");
                ctx.fillStyle = orbGrd;
                ctx.beginPath(); ctx.arc(orbX, orbY, 9, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;
                // Dashed chain
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1.5;
                ctx.setLineDash([2,2]);
                ctx.beginPath(); ctx.moveTo(center+12, oy+h*0.35); ctx.lineTo(orbX, orbY); ctx.stroke();
                ctx.setLineDash([]);
                // Inner specular dot
                ctx.fillStyle = "rgba(255,255,255,0.8)";
                ctx.beginPath(); ctx.arc(orbX-3, orbY-3, 2, 0, Math.PI*2); ctx.fill();
                ctx.restore();
                break;
            }
            case "leaf_wreath": {
                // 7 leaves arranged in a crown arc
                const leafDx = [-14,-10,-5,0,5,10,14];
                const leafDy = [6,1,-4,-6,-4,1,6];
                const leafRot = [-0.8,-0.5,-0.2,0,0.2,0.5,0.8];
                const leafCols = ["#27ae60","#2ecc71","#1abc9c","#27ae60","#1abc9c","#2ecc71","#145a32"];
                for (let i = 0; i < 7; i++) {
                    ctx.save();
                    ctx.translate(center + leafDx[i], top + leafDy[i]);
                    ctx.rotate(leafRot[i] + Math.PI/2);
                    ctx.fillStyle = leafCols[i];
                    ctx.beginPath(); ctx.moveTo(0,-7); ctx.bezierCurveTo(5,-2,5,3,0,6); ctx.bezierCurveTo(-5,3,-5,-2,0,-7); ctx.closePath(); ctx.fill();
                    ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 0.8;
                    ctx.beginPath(); ctx.moveTo(0,-5); ctx.lineTo(0,4); ctx.stroke();
                    ctx.restore();
                }
                // Small decorative flowers
                ctx.fillStyle = "#ffd700";
                ctx.beginPath(); ctx.arc(center-9, top-2, 2.5, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+9, top-2, 2.5, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.beginPath(); ctx.arc(center, top-7, 2.5, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "stone_rune": {
                // Crack lines clipped to body
                ctx.save();
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                ctx.strokeStyle = "rgba(0,0,0,0.32)"; ctx.lineWidth = 1.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center-8,top+4); ctx.lineTo(center-4,top+12); ctx.lineTo(center-6,top+20); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+6,top+6);  ctx.lineTo(center+10,top+14); ctx.lineTo(center+8,top+24); ctx.stroke();
                ctx.restore();
                // Pulsing rune symbol (ᚱ-like)
                const runeAlpha = (Math.sin(Date.now()*0.002)+1)*0.35+0.3;
                ctx.save(); ctx.globalAlpha = runeAlpha;
                ctx.shadowColor = "#00aaff"; ctx.shadowBlur = 10;
                ctx.strokeStyle = "#88ccff"; ctx.lineWidth = 1.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center-2,oy+h*0.34); ctx.lineTo(center-2,oy+h*0.66); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center-2,oy+h*0.34); ctx.bezierCurveTo(center+8,oy+h*0.34,center+8,oy+h*0.5,center-2,oy+h*0.5); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center-2,oy+h*0.5); ctx.lineTo(center+7,oy+h*0.66); ctx.stroke();
                ctx.shadowBlur = 0; ctx.restore();
                break;
            }
            case "shell_crown": {
                const shColors = [colors.main, colors.highlight, colors.outline];
                const shX = [center-8, center, center+8];
                const shY = [top+0, top-6, top+0];
                for (let i = 0; i < 3; i++) {
                    ctx.fillStyle = shColors[i % shColors.length];
                    ctx.beginPath(); ctx.moveTo(shX[i], shY[i]+6);
                    for (let r = 0; r <= Math.PI; r += Math.PI/5)
                        ctx.lineTo(shX[i] + Math.cos(r - Math.PI/2)*8, shY[i] + Math.sin(r - Math.PI/2)*8);
                    ctx.closePath(); ctx.fill();
                    ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 0.8;
                    for (let r = Math.PI/6; r < Math.PI; r += Math.PI/5) {
                        ctx.beginPath(); ctx.moveTo(shX[i],shY[i]+6); ctx.lineTo(shX[i]+Math.cos(r-Math.PI/2)*7,shY[i]+Math.sin(r-Math.PI/2)*7); ctx.stroke();
                    }
                }
                // Pearl gems
                ctx.fillStyle = "#fff0f8";
                ctx.beginPath(); ctx.arc(center-8, top+4, 2.5, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center,   top-2, 2.5, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+8, top+4, 2.5, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "hourglass_charm": {
                const hgX = center + 16, hgY = oy + h * 0.22;
                // Dangling chain
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1.5;
                ctx.setLineDash([2,2]);
                ctx.beginPath(); ctx.moveTo(center+11, oy+h*0.18); ctx.lineTo(hgX, hgY); ctx.stroke();
                ctx.setLineDash([]);
                // Top and bottom caps
                ctx.fillStyle = colors.outline;
                ctx.fillRect(hgX-5, hgY,    10, 3);
                ctx.fillRect(hgX-5, hgY+13, 10, 3);
                // Glass body
                ctx.fillStyle = "rgba(255,248,200,0.6)";
                ctx.beginPath(); ctx.moveTo(hgX-5,hgY+3); ctx.lineTo(hgX+5,hgY+3); ctx.lineTo(hgX+2,hgY+8); ctx.lineTo(hgX+5,hgY+13); ctx.lineTo(hgX-5,hgY+13); ctx.lineTo(hgX-2,hgY+8); ctx.closePath(); ctx.fill();
                // Animated sand (fills bottom half over a cycle)
                const sandFill = ((Date.now() % 5000) / 5000);
                ctx.fillStyle = colors.main;
                const sandW = 3 * sandFill;
                ctx.beginPath(); ctx.moveTo(hgX-sandW,hgY+8); ctx.lineTo(hgX-5+sandFill*2,hgY+13); ctx.lineTo(hgX+5-sandFill*2,hgY+13); ctx.lineTo(hgX+sandW,hgY+8); ctx.closePath(); ctx.fill();
                // Falling grain
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.arc(hgX, hgY+8, 1.2, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "shadow_cloak": {
                // Dark hood overlay
                ctx.save(); ctx.globalAlpha = 0.82;
                const shadowGrd = ctx.createLinearGradient(center, top-8, center, oy+h*0.65);
                shadowGrd.addColorStop(0, "rgba(10,10,20,0.95)");
                shadowGrd.addColorStop(0.55, colors.outline);
                shadowGrd.addColorStop(1, "rgba(10,10,20,0)");
                ctx.fillStyle = shadowGrd;
                ctx.beginPath(); ctx.moveTo(center-16,top+20); ctx.bezierCurveTo(center-14,top-5,center-10,top-12,center,top-14); ctx.bezierCurveTo(center+10,top-12,center+14,top-5,center+16,top+20); ctx.closePath(); ctx.fill();
                // Side cloak panels hanging down
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-13,top+6); ctx.bezierCurveTo(center-20,top+14,center-22,top+26,center-17,oy+h+6); ctx.lineTo(center-13,oy+h+3); ctx.bezierCurveTo(center-15,top+24,center-14,top+15,center-10,top+6); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+13,top+6);  ctx.bezierCurveTo(center+20,top+14,center+22,top+26,center+17,oy+h+6); ctx.lineTo(center+13,oy+h+3); ctx.bezierCurveTo(center+15,top+24,center+14,top+15,center+10,top+6);  ctx.closePath(); ctx.fill();
                ctx.restore();
                // Glowing eyes in shadow
                ctx.save(); ctx.globalAlpha = 0.9;
                ctx.shadowColor = colors.highlight; ctx.shadowBlur = 8;
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.ellipse(center-5, oy+h*0.4, 3, 2.5, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+5, oy+h*0.4, 3, 2.5, 0, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0; ctx.restore();
                break;
            }

        default:
            matched = false;
    }
    return matched;
}
