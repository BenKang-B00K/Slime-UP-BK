import { FeatureCtx, makeGumdropPath, drawRoundedRect, drawPixelRect } from "./FeatureContext.js";

export function tryMonsterFeatures(fc: FeatureCtx): boolean {
    const { ctx, ox, oy, w, h, center, top, moveDir, colors } = fc;
    let matched = true;
    switch (fc.feature) {
            // ── Monster skins ──────────────────────────────────────────────
            case "zombie_wounds": {
                // Stitches and drip clipped to body
                ctx.save();
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                ctx.strokeStyle = "#1a3a10"; ctx.lineWidth = 1.2; ctx.lineCap = "round";
                const stitchRows = [[8,4,22],[16,6,20],[24,3,18]];
                for (const [sy,sx,slen] of stitchRows) {
                    ctx.beginPath(); ctx.moveTo(ox+sx,oy+sy); ctx.lineTo(ox+sx+slen,oy+sy); ctx.stroke();
                    for (let t = 0; t <= slen; t += 4) { ctx.beginPath(); ctx.moveTo(ox+sx+t,oy+sy-2); ctx.lineTo(ox+sx+t,oy+sy+2); ctx.stroke(); }
                }
                ctx.fillStyle = "rgba(80,160,30,0.5)";
                ctx.beginPath(); ctx.moveTo(ox+5,oy); ctx.bezierCurveTo(ox+5,oy+6,ox+4,oy+13,ox+6,oy+15); ctx.lineTo(ox+9,oy+15); ctx.bezierCurveTo(ox+11,oy+13,ox+10,oy+6,ox+10,oy); ctx.closePath(); ctx.fill();
                ctx.restore();
                // Exposed bone top
                ctx.fillStyle = "#f0e8d0";
                ctx.beginPath(); ctx.moveTo(center-2,top+2); ctx.lineTo(center-3,top-10); ctx.lineTo(center+3,top-10); ctx.lineTo(center+2,top+2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.arc(center, top-12, 4, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#c0b090"; ctx.lineWidth = 1; ctx.stroke();
                // X pupils
                ctx.strokeStyle = "#1a3a10"; ctx.lineWidth = 1.5;
                for (const ex of [center-4, center+4]) {
                    const ey = oy+h*0.5+2;
                    ctx.beginPath(); ctx.moveTo(ex-2.5,ey-2.5); ctx.lineTo(ex+2.5,ey+2.5); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(ex+2.5,ey-2.5); ctx.lineTo(ex-2.5,ey+2.5); ctx.stroke();
                }
                break;
            }
            case "wolf_snout": {
                // Pointed ears
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-12,top+2); ctx.lineTo(center-18,top-16); ctx.lineTo(center-4,top-2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+12,top+2); ctx.lineTo(center+18,top-16); ctx.lineTo(center+4,top-2); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-11,top+2); ctx.lineTo(center-16,top-13); ctx.lineTo(center-5,top-2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+11,top+2); ctx.lineTo(center+16,top-13); ctx.lineTo(center+5,top-2); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#d08060";
                ctx.beginPath(); ctx.moveTo(center-10,top+1); ctx.lineTo(center-14,top-11); ctx.lineTo(center-6,top-1); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+10,top+1); ctx.lineTo(center+14,top-11); ctx.lineTo(center+6,top-1); ctx.closePath(); ctx.fill();
                // Snout
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.62, 8, 5, 0, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1; ctx.stroke();
                ctx.fillStyle = "#1a0a0a";
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.58, 4, 3, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#a04030";
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.57, 2, 1.5, 0, 0, Math.PI*2); ctx.fill();
                // Fangs
                ctx.fillStyle = "#fff8f0";
                ctx.beginPath(); ctx.moveTo(center-4,oy+h*0.67); ctx.lineTo(center-5,oy+h*0.78); ctx.lineTo(center-2,oy+h*0.69); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+4,oy+h*0.67); ctx.lineTo(center+5,oy+h*0.78); ctx.lineTo(center+2,oy+h*0.69); ctx.closePath(); ctx.fill();
                // Claw marks
                ctx.save(); makeGumdropPath(ctx,2,2,w-4,h-4); ctx.clip();
                ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1; ctx.lineCap = "round";
                for (let c = 0; c < 3; c++) { ctx.beginPath(); ctx.moveTo(ox+18+c*2,oy+4); ctx.lineTo(ox+16+c*2,oy+14); ctx.stroke(); }
                ctx.restore();
                break;
            }
            case "bolt_stitches": {
                // Neck bolts
                ctx.fillStyle = "#707070";
                ctx.fillRect(center-16, oy+h*0.45, 5, 8); ctx.fillRect(center+11, oy+h*0.45, 5, 8);
                ctx.fillStyle = "#a0a0a0";
                ctx.fillRect(center-17, oy+h*0.43, 7, 3); ctx.fillRect(center+10, oy+h*0.43, 7, 3);
                ctx.fillStyle = "#d0d0d0";
                ctx.fillRect(center-16, oy+h*0.43, 2, 2); ctx.fillRect(center+10, oy+h*0.43, 2, 2);
                // Stitches
                ctx.save(); makeGumdropPath(ctx,2,2,w-4,h-4); ctx.clip();
                ctx.strokeStyle = "#103020"; ctx.lineWidth = 1.2; ctx.lineCap = "round";
                for (let s = 0; s < 6; s++) { ctx.beginPath(); ctx.moveTo(center-1,oy+s*5+2); ctx.lineTo(center+1,oy+s*5+2); ctx.stroke(); }
                ctx.beginPath(); ctx.moveTo(center+2,oy+8); ctx.lineTo(center+10,oy+14); ctx.stroke();
                for (let s = 0; s < 3; s++) { const px=center+2+s*2.7,py=oy+8+s*2; ctx.beginPath(); ctx.moveTo(px-1.5,py-1.5); ctx.lineTo(px+1.5,py+1.5); ctx.stroke(); }
                ctx.restore();
                // Flat top
                ctx.fillStyle = colors.outline; ctx.fillRect(center-12, top-2, 24, 4);
                ctx.fillStyle = colors.highlight; ctx.fillRect(center-11, top-2, 22, 1.5);
                break;
            }
            case "giant_eye": {
                // Override eye area with single huge eye
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.48, 13, 11, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#fff8f0";
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.48, 12, 10, 0, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1.5; ctx.stroke();
                ctx.fillStyle = "#c06000";
                ctx.beginPath(); ctx.arc(center, oy+h*0.48, 7, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#1a0a00";
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.48, 2.5, 6.5, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.beginPath(); ctx.ellipse(center-4, oy+h*0.42, 3, 2.5, -0.4, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "rgba(255,255,255,0.35)";
                ctx.beginPath(); ctx.arc(center+5, oy+h*0.52, 1.5, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 2; ctx.lineCap = "round";
                ctx.beginPath(); ctx.arc(center, oy+h*0.48, 12, Math.PI*1.15, Math.PI*1.85); ctx.stroke();
                break;
            }
            case "snake_hair": {
                const snkT = Date.now()*0.002;
                const snakeDefs = [{dx:-9,ph:0,col:"#2a7040"},{dx:-4,ph:1.2,col:"#1a5030"},{dx:0,ph:0.6,col:"#3a9050"},{dx:5,ph:1.8,col:"#2a7040"},{dx:10,ph:0.3,col:"#1a5030"}];
                for (const s of snakeDefs) {
                    const wv = Math.sin(snkT+s.ph)*4;
                    ctx.strokeStyle = s.col; ctx.lineWidth = 3; ctx.lineCap = "round";
                    ctx.beginPath(); ctx.moveTo(center+s.dx,top+2); ctx.bezierCurveTo(center+s.dx+wv,top-6,center+s.dx-wv,top-14,center+s.dx+wv*0.5,top-22); ctx.stroke();
                    ctx.fillStyle = s.col;
                    ctx.beginPath(); ctx.ellipse(center+s.dx+wv*0.5, top-23, 2.5, 2, 0, 0, Math.PI*2); ctx.fill();
                    ctx.strokeStyle = "#ff3040"; ctx.lineWidth = 0.8;
                    const tx=center+s.dx+wv*0.5, ty=top-25;
                    ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx-2,ty-3); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx+2,ty-3); ctx.stroke();
                }
                break;
            }
            case "bull_horns_m": {
                // Wide curved bull horns
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-10,top+4); ctx.bezierCurveTo(center-22,top,center-28,top-12,center-22,top-20); ctx.bezierCurveTo(center-26,top-10,center-20,top-2,center-8,top+4); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+10,top+4); ctx.bezierCurveTo(center+22,top,center+28,top-12,center+22,top-20); ctx.bezierCurveTo(center+26,top-10,center+20,top-2,center+8,top+4); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#f0e0c0";
                ctx.beginPath(); ctx.moveTo(center-10,top+4); ctx.bezierCurveTo(center-20,top+1,center-25,top-9,center-20,top-16); ctx.bezierCurveTo(center-23,top-7,center-17,top-1,center-8,top+3); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+10,top+4); ctx.bezierCurveTo(center+20,top+1,center+25,top-9,center+20,top-16); ctx.bezierCurveTo(center+23,top-7,center+17,top-1,center+8,top+3); ctx.closePath(); ctx.fill();
                // Nose ring
                ctx.strokeStyle = "#c0a000"; ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.arc(center, oy+h*0.66, 5, 0, Math.PI*2); ctx.stroke();
                // Nostrils
                ctx.fillStyle = "#3a1000";
                ctx.beginPath(); ctx.ellipse(center-3,oy+h*0.60,2.5,2,-0.2,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+3,oy+h*0.60,2.5,2,0.2,0,Math.PI*2); ctx.fill();
                break;
            }
            case "bandage_wrap": {
                ctx.save(); makeGumdropPath(ctx,0,0,w,h); ctx.clip();
                ctx.fillStyle = "rgba(210,190,140,0.72)";
                ctx.fillRect(ox-2, oy+h*0.08, 36, 6); ctx.fillRect(ox-2, oy+h*0.33, 36, 6); ctx.fillRect(ox-2, oy+h*0.58, 36, 6);
                ctx.fillRect(ox+8, oy, 6, 32);
                ctx.strokeStyle = "rgba(160,130,80,0.4)"; ctx.lineWidth = 0.8;
                ctx.strokeRect(ox-2,oy+h*0.08,36,6); ctx.strokeRect(ox-2,oy+h*0.33,36,6); ctx.strokeRect(ox-2,oy+h*0.58,36,6);
                ctx.restore();
                // Loose hanging strip
                ctx.fillStyle = "rgba(210,190,140,0.88)";
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.6); ctx.bezierCurveTo(center+16,oy+h*0.75,center+14,oy+h+4,center+18,oy+h+9); ctx.lineTo(center+22,oy+h+9); ctx.bezierCurveTo(center+18,oy+h+3,center+20,oy+h*0.75,center+16,oy+h*0.6); ctx.closePath(); ctx.fill();
                // Peering eye
                ctx.fillStyle = "#fff8f0";
                ctx.beginPath(); ctx.ellipse(center-3,oy+h*0.42,4,5,0,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#2a1800";
                ctx.beginPath(); ctx.arc(center-3,oy+h*0.44,2.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "rgba(255,255,255,0.8)";
                ctx.beginPath(); ctx.arc(center-4.5,oy+h*0.42,1.2,0,Math.PI*2); ctx.fill();
                break;
            }
            case "yeti_fur": {
                // Fluffy fur silhouette
                const yetiFurT = Date.now()*0.001;
                ctx.fillStyle = colors.main;
                for (let i = 0; i < 11; i++) {
                    const angle = (i/11)*Math.PI*2;
                    const fr = 14 + Math.sin(yetiFurT+i*0.7)*1.5;
                    ctx.beginPath(); ctx.arc(center+Math.cos(angle)*(16+fr*0.2), oy+h*0.48+Math.sin(angle)*(12+fr*0.2), fr*0.48+2.5, 0, Math.PI*2); ctx.fill();
                }
                // Thick brow
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.32, 14, 4, 0, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = colors.main; ctx.lineWidth = 1.2;
                for (let i = -5; i <= 5; i += 2) { ctx.beginPath(); ctx.moveTo(center+i*2,oy+h*0.32-3); ctx.lineTo(center+i*2+Math.sign(i)*0.5,oy+h*0.32+4); ctx.stroke(); }
                // Claws
                ctx.fillStyle = colors.outline;
                for (let c = 0; c < 3; c++) {
                    ctx.beginPath(); ctx.moveTo(center-16+c*2,oy+h*0.55); ctx.lineTo(center-21+c*2,oy+h*0.68); ctx.lineTo(center-14+c*2,oy+h*0.60); ctx.closePath(); ctx.fill();
                    ctx.beginPath(); ctx.moveTo(center+16-c*2,oy+h*0.55); ctx.lineTo(center+21-c*2,oy+h*0.68); ctx.lineTo(center+14-c*2,oy+h*0.60); ctx.closePath(); ctx.fill();
                }
                break;
            }
            case "imp_wings": {
                // Bat wings
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-12,oy+h*0.35); ctx.bezierCurveTo(center-24,oy+h*0.18,center-30,oy+h*0.5,center-22,oy+h*0.56); ctx.bezierCurveTo(center-28,oy+h*0.45,center-24,oy+h*0.3,center-14,oy+h*0.42); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.35); ctx.bezierCurveTo(center+24,oy+h*0.18,center+30,oy+h*0.5,center+22,oy+h*0.56); ctx.bezierCurveTo(center+28,oy+h*0.45,center+24,oy+h*0.3,center+14,oy+h*0.42); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = "rgba(200,50,30,0.45)"; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.moveTo(center-12,oy+h*0.35); ctx.lineTo(center-26,oy+h*0.38); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center-12,oy+h*0.35); ctx.lineTo(center-22,oy+h*0.5); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.35); ctx.lineTo(center+26,oy+h*0.38); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.35); ctx.lineTo(center+22,oy+h*0.5); ctx.stroke();
                // Horn nubs
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-5,top+2); ctx.lineTo(center-7,top-8); ctx.lineTo(center-3,top-4); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+5,top+2); ctx.lineTo(center+7,top-8); ctx.lineTo(center+3,top-4); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#ff4040";
                ctx.beginPath(); ctx.moveTo(center-5,top+2); ctx.lineTo(center-6,top-6); ctx.lineTo(center-3,top-3); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+5,top+2); ctx.lineTo(center+6,top-6); ctx.lineTo(center+3,top-3); ctx.closePath(); ctx.fill();
                // Forked tail
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 3; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+12,oy+h-4); ctx.bezierCurveTo(center+20,oy+h+2,center+22,oy+h-4,center+18,oy+h+6); ctx.stroke();
                ctx.fillStyle = "#1a0000";
                ctx.beginPath(); ctx.moveTo(center+16,oy+h+6); ctx.lineTo(center+20,oy+h+10); ctx.lineTo(center+13,oy+h+9); ctx.closePath(); ctx.fill();
                break;
            }
            case "wail_scream": {
                // Emanating wail rings
                const wailT = Date.now()*0.003;
                for (let ring = 0; ring < 4; ring++) {
                    const phase = (wailT*0.5 + ring*0.5) % 1;
                    ctx.save(); ctx.globalAlpha = (1-phase)*0.28;
                    ctx.strokeStyle = "#c0d8ff"; ctx.lineWidth = 1.8-ring*0.3;
                    ctx.beginPath(); ctx.ellipse(center, oy+h*0.5, 14+ring*9+phase*6, (14+ring*9+phase*6)*0.65, 0, 0, Math.PI*2); ctx.stroke();
                    ctx.restore();
                }
                // Screaming mouth
                ctx.fillStyle = "#0a0a1a";
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.6, 9, 11, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#3a0020";
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.61, 7, 9, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#e8e0d8";
                for (let t = 0; t < 4; t++) { ctx.beginPath(); ctx.moveTo(center-6+t*4,oy+h*0.52); ctx.lineTo(center-5+t*4,oy+h*0.60); ctx.lineTo(center-4+t*4,oy+h*0.52); ctx.closePath(); ctx.fill(); }
                for (let t = 0; t < 3; t++) { ctx.beginPath(); ctx.moveTo(center-4+t*4,oy+h*0.70); ctx.lineTo(center-3+t*4,oy+h*0.62); ctx.lineTo(center-2+t*4,oy+h*0.70); ctx.closePath(); ctx.fill(); }
                // Hollow eyes
                ctx.fillStyle = "#0a0a1a";
                ctx.beginPath(); ctx.ellipse(center-6,oy+h*0.38,4,4.5,0,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+6,oy+h*0.38,4,4.5,0,0,Math.PI*2); ctx.fill();
                // Wispy hair
                ctx.save(); ctx.globalAlpha = 0.5;
                const wispT = Date.now()*0.002;
                for (let i = -3; i <= 3; i++) {
                    ctx.strokeStyle = colors.highlight; ctx.lineWidth = 1.5; ctx.lineCap = "round";
                    ctx.beginPath(); ctx.moveTo(center+i*4,top+2); ctx.bezierCurveTo(center+i*4+Math.sin(wispT+i)*4,top-6,center+i*4-Math.sin(wispT+i)*3,top-14,center+i*4+Math.sin(wispT*0.7+i)*2,top-20); ctx.stroke();
                }
                ctx.restore();
                break;
            }
            case "troll_nose": {
                // Pointed ears
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-13,top+10); ctx.lineTo(center-20,top+4); ctx.lineTo(center-18,top+14); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+13,top+10); ctx.lineTo(center+20,top+4); ctx.lineTo(center+18,top+14); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#306020";
                ctx.beginPath(); ctx.moveTo(center-14,top+11); ctx.lineTo(center-19,top+6); ctx.lineTo(center-18,top+13); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+14,top+11); ctx.lineTo(center+19,top+6); ctx.lineTo(center+18,top+13); ctx.closePath(); ctx.fill();
                // Bumpy nose
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.57, 9, 7, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.56, 8, 6, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center-2, oy+h*0.54, 2.5, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+2, oy+h*0.52, 2, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#1a2a10";
                ctx.beginPath(); ctx.ellipse(center-3,oy+h*0.59,2.5,2,0.2,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+3,oy+h*0.59,2.5,2,-0.2,0,Math.PI*2); ctx.fill();
                // Mossy patches
                ctx.save(); makeGumdropPath(ctx,2,2,w-4,h-4); ctx.clip();
                ctx.fillStyle = "rgba(30,60,20,0.2)";
                ctx.beginPath(); ctx.ellipse(center-4,oy+8,5,3,0.5,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+6,oy+16,4,2.5,-0.3,0,Math.PI*2); ctx.fill();
                ctx.restore();
                break;
            }
            case "absorb_eyes": {
                // Trapped eyes inside body
                ctx.save(); makeGumdropPath(ctx,1,1,w-2,h-2); ctx.clip();
                const blobEyes: [number,number][] = [[5,8],[20,12],[10,22],[18,5],[7,18],[15,27]];
                for (const [ex,ey] of blobEyes) {
                    ctx.fillStyle = "#fff8f0"; ctx.beginPath(); ctx.arc(ox+ex,oy+ey,4,0,Math.PI*2); ctx.fill();
                    ctx.fillStyle = "#c03020"; ctx.beginPath(); ctx.arc(ox+ex,oy+ey,2.5,0,Math.PI*2); ctx.fill();
                    ctx.fillStyle = "#0a0a0a"; ctx.beginPath(); ctx.arc(ox+ex,oy+ey,1.5,0,Math.PI*2); ctx.fill();
                    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(ox+ex-1,oy+ey-1,1,0,Math.PI*2); ctx.fill();
                }
                ctx.fillStyle = "rgba(0,80,20,0.35)";
                ctx.beginPath(); ctx.moveTo(ox+4,oy+h*0.5); ctx.bezierCurveTo(ox-2,oy+h*0.3,ox+2,oy+h*0.6,ox+8,oy+h*0.55); ctx.closePath(); ctx.fill();
                ctx.restore();
                // Drips
                const blobT = Date.now()*0.002;
                for (let d = 0; d < 3; d++) {
                    const dr = 3+Math.sin(blobT+d*2.1)*1.5;
                    ctx.fillStyle = colors.main;
                    ctx.beginPath(); ctx.arc(center-6+d*6, oy+h+dr, dr, 0, Math.PI*2); ctx.fill();
                }
                break;
            }
            case "chimera_mane": {
                // Lion mane ring
                ctx.fillStyle = colors.outline;
                for (let i = 0; i < 12; i++) { const a=(i/12)*Math.PI*2; ctx.beginPath(); ctx.arc(center+Math.cos(a)*18,oy+h*0.45+Math.sin(a)*13.5,7,0,Math.PI*2); ctx.fill(); }
                ctx.fillStyle = colors.main;
                for (let i = 0; i < 12; i++) { const a=(i/12)*Math.PI*2+0.25; ctx.beginPath(); ctx.arc(center+Math.cos(a)*14,oy+h*0.45+Math.sin(a)*10.5,5.5,0,Math.PI*2); ctx.fill(); }
                // Serpent tail
                ctx.strokeStyle = "#2a5040"; ctx.lineWidth = 5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+12,oy+h-4); ctx.bezierCurveTo(center+22,oy+h+6,center+26,oy+h-2,center+20,oy+h+12); ctx.stroke();
                ctx.fillStyle = "#2a5040";
                ctx.beginPath(); ctx.ellipse(center+20,oy+h+13,4,3,0.4,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#ff3040"; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.moveTo(center+20,oy+h+15); ctx.lineTo(center+18,oy+h+19); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+20,oy+h+15); ctx.lineTo(center+22,oy+h+19); ctx.stroke();
                break;
            }
            case "gremlin_ears": {
                // Large bat-like ears
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-10,top+6); ctx.bezierCurveTo(center-20,top+2,center-28,top-12,center-18,top-20); ctx.bezierCurveTo(center-24,top-8,center-18,top,center-8,top+6); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+10,top+6); ctx.bezierCurveTo(center+20,top+2,center+28,top-12,center+18,top-20); ctx.bezierCurveTo(center+24,top-8,center+18,top,center+8,top+6); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#d060a0";
                ctx.beginPath(); ctx.moveTo(center-10,top+6); ctx.bezierCurveTo(center-18,top+3,center-24,top-9,center-16,top-16); ctx.bezierCurveTo(center-21,top-7,center-16,top+1,center-8,top+5); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+10,top+6); ctx.bezierCurveTo(center+18,top+3,center+24,top-9,center+16,top-16); ctx.bezierCurveTo(center+21,top-7,center+16,top+1,center+8,top+5); ctx.closePath(); ctx.fill();
                // Sharp teeth
                ctx.fillStyle = "#fff8f0";
                for (let t = 0; t < 6; t++) { ctx.beginPath(); ctx.moveTo(center-7+t*2.8,oy+h*0.64); ctx.lineTo(center-6.5+t*2.8,oy+h*0.76); ctx.lineTo(center-6+t*2.8,oy+h*0.64); ctx.closePath(); ctx.fill(); }
                // Goggles
                ctx.strokeStyle = "#c0a000"; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(center-5,oy+h*0.42,5,0,Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.arc(center+5,oy+h*0.42,5,0,Math.PI*2); ctx.stroke();
                ctx.strokeStyle = "#806000"; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(center-0.5,oy+h*0.42); ctx.lineTo(center+0.5,oy+h*0.42); ctx.stroke();
                break;
            }
            case "antler_skull": {
                // Antler branches
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 3; ctx.lineCap = "round";
                const antlerBranches: [number,number,number,number][] = [
                    [center-6,top+2,center-12,top-12],[center-12,top-12,center-18,top-22],[center-12,top-12,center-6,top-20],
                    [center-18,top-22,center-14,top-30],[center-18,top-22,center-24,top-28],
                    [center+6,top+2,center+12,top-12],[center+12,top-12,center+18,top-22],[center+12,top-12,center+6,top-20],
                    [center+18,top-22,center+14,top-30],[center+18,top-22,center+24,top-28]
                ];
                for (const [x1,y1,x2,y2] of antlerBranches) { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
                // Skull face
                ctx.save(); ctx.globalAlpha = 0.85;
                ctx.fillStyle = "#f0e8dc";
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.42, 11, 12, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#0a0808";
                ctx.beginPath(); ctx.ellipse(center-5,oy+h*0.38,4.5,5,0,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+5,oy+h*0.38,4.5,5,0,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#1a1010";
                ctx.beginPath(); ctx.moveTo(center-2,oy+h*0.53); ctx.lineTo(center,oy+h*0.60); ctx.lineTo(center+2,oy+h*0.53); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#e8e0d0";
                for (let t = 0; t < 4; t++) ctx.fillRect(center-7+t*4, oy+h*0.64, 3, 5);
                ctx.fillStyle = "#0a0808"; ctx.fillRect(center-6,oy+h*0.64,14,1.5);
                ctx.restore();
                break;
            }
            case "elder_tentacles": {
                // Face tentacles
                const eldT = Date.now()*0.0015;
                const eldTentacles = [{dx:-10,ph:0},{dx:-6,ph:0.8},{dx:-2,ph:1.6},{dx:2,ph:0.4},{dx:6,ph:1.2},{dx:10,ph:2.0}];
                for (const t of eldTentacles) {
                    const wv = Math.sin(eldT+t.ph)*4;
                    ctx.strokeStyle = colors.main; ctx.lineWidth = 3; ctx.lineCap = "round";
                    ctx.beginPath(); ctx.moveTo(center+t.dx,oy+h*0.65); ctx.bezierCurveTo(center+t.dx+wv,oy+h*0.8,center+t.dx-wv*0.5,oy+h+6,center+t.dx+wv*0.3,oy+h+12); ctx.stroke();
                    ctx.fillStyle = "#0a4030";
                    ctx.beginPath(); ctx.arc(center+t.dx+wv*0.3,oy+h+13,2,0,Math.PI*2); ctx.fill();
                }
                // Vestigial wings
                ctx.save(); ctx.globalAlpha = 0.45;
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-12,oy+h*0.35); ctx.bezierCurveTo(center-24,oy+h*0.15,center-26,oy+h*0.45,center-18,oy+h*0.56); ctx.bezierCurveTo(center-22,oy+h*0.45,center-20,oy+h*0.28,center-14,oy+h*0.4); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.35); ctx.bezierCurveTo(center+24,oy+h*0.15,center+26,oy+h*0.45,center+18,oy+h*0.56); ctx.bezierCurveTo(center+22,oy+h*0.45,center+20,oy+h*0.28,center+14,oy+h*0.4); ctx.closePath(); ctx.fill();
                ctx.restore();
                // Glowing elder sign
                const eldA = (Math.sin(Date.now()*0.002)+1)*0.3+0.4;
                ctx.save(); ctx.globalAlpha = eldA; ctx.shadowColor = colors.highlight; ctx.shadowBlur = 8;
                ctx.strokeStyle = colors.highlight; ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.arc(center,oy+h*0.45,6,0,Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center,oy+h*0.45-6); ctx.lineTo(center,oy+h*0.45+6); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center-6,oy+h*0.45); ctx.lineTo(center+6,oy+h*0.45); ctx.stroke();
                ctx.shadowBlur=0; ctx.restore();
                break;
            }
            case "void_face": {
                // Featureless white oval
                ctx.fillStyle = "#f0f0f0";
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.48, 11, 13, 0, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#d0d0d0"; ctx.lineWidth = 0.8; ctx.stroke();
                // Static flicker
                ctx.save(); makeGumdropPath(ctx,1,1,w-2,h-2); ctx.clip();
                const vfT = Date.now()*0.01;
                for (let i = 0; i < 6; i++) {
                    ctx.fillStyle = `rgba(0,0,0,${(i%3)*0.03+0.02})`;
                    ctx.fillRect(ox+3+((i*7+vfT)%22), oy+2+((i*5)%26), 2, 1);
                }
                ctx.restore();
                // Suit collar
                ctx.strokeStyle = "rgba(0,0,0,0.38)"; ctx.lineWidth = 2; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center-12,oy+h*0.7); ctx.lineTo(center-8,oy+h*0.85); ctx.lineTo(center,oy+h*0.9); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.7); ctx.lineTo(center+8,oy+h*0.85); ctx.lineTo(center,oy+h*0.9); ctx.stroke();
                ctx.fillStyle = "#0a0a0a";
                ctx.beginPath(); ctx.moveTo(center-2,oy+h*0.86); ctx.lineTo(center-3,oy+h); ctx.lineTo(center+3,oy+h); ctx.lineTo(center+2,oy+h*0.86); ctx.closePath(); ctx.fill();
                // Tendrils
                const slenT = Date.now()*0.002;
                ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.lineWidth = 2;
                for (let t = 0; t < 3; t++) {
                    const wv = Math.sin(slenT+t)*3;
                    ctx.beginPath(); ctx.moveTo(center-16+t*16,oy+h*0.4); ctx.bezierCurveTo(center-24+t*16+wv,oy+h*0.2,center-28+t*16,oy+h*0.5,center-22+t*16+wv*0.5,oy+h*0.6); ctx.stroke();
                }
                break;
            }
            case "harpy_wings": {
                // Large feathered wings
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-12,oy+h*0.3); ctx.bezierCurveTo(center-26,oy+h*0.1,center-32,oy+h*0.4,center-24,oy+h*0.65); ctx.bezierCurveTo(center-28,oy+h*0.5,center-24,oy+h*0.3,center-14,oy+h*0.45); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-12,oy+h*0.3); ctx.bezierCurveTo(center-24,oy+h*0.12,center-29,oy+h*0.4,center-22,oy+h*0.62); ctx.bezierCurveTo(center-26,oy+h*0.48,center-22,oy+h*0.3,center-14,oy+h*0.44); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.3); ctx.bezierCurveTo(center+26,oy+h*0.1,center+32,oy+h*0.4,center+24,oy+h*0.65); ctx.bezierCurveTo(center+28,oy+h*0.5,center+24,oy+h*0.3,center+14,oy+h*0.45); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.3); ctx.bezierCurveTo(center+24,oy+h*0.12,center+29,oy+h*0.4,center+22,oy+h*0.62); ctx.bezierCurveTo(center+26,oy+h*0.48,center+22,oy+h*0.3,center+14,oy+h*0.44); ctx.closePath(); ctx.fill();
                // Feather tips (left)
                ctx.fillStyle = colors.highlight;
                for (let f = 0; f < 4; f++) {
                    ctx.beginPath(); ctx.moveTo(center-14+f*3,oy+h*0.44); ctx.bezierCurveTo(center-20+f*2,oy+h*0.5,center-26,oy+h*0.6+f*2,center-24+f,oy+h*0.63+f*2); ctx.bezierCurveTo(center-22+f,oy+h*0.62+f*2,center-18,oy+h*0.5,center-14+f*3,oy+h*0.46); ctx.closePath(); ctx.fill();
                }
                // Talon feet
                ctx.strokeStyle = "#5a2800"; ctx.lineWidth = 2; ctx.lineCap = "round";
                for (let c = -1; c <= 1; c++) {
                    ctx.beginPath(); ctx.moveTo(center-2+c*4,oy+h); ctx.lineTo(center-4+c*4,oy+h+8); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(center-2+c*4,oy+h); ctx.lineTo(center+0+c*4,oy+h+8); ctx.stroke();
                }
                // Feather crest
                ctx.fillStyle = colors.outline;
                for (let i = -2; i <= 2; i++) { const fh=8-Math.abs(i)*2; ctx.beginPath(); ctx.moveTo(center+i*3-1,top+2); ctx.lineTo(center+i*3,top-fh); ctx.lineTo(center+i*3+1,top+2); ctx.closePath(); ctx.fill(); }
                break;
            }
            case "lich_crown": {
                // Necrotic aura orbs
                const lichT = Date.now()*0.002;
                for (let i = 0; i < 5; i++) {
                    const sx=center+Math.cos(lichT+i*1.26)*16, sy=oy+h*0.3+Math.sin(lichT*0.8+i*1.26)*12;
                    ctx.save(); ctx.globalAlpha = Math.abs(Math.sin(lichT+i))*0.3+0.1;
                    ctx.fillStyle = colors.highlight;
                    ctx.beginPath(); ctx.arc(sx,sy,4+Math.abs(Math.sin(lichT*1.2+i))*3,0,Math.PI*2); ctx.fill();
                    ctx.restore();
                }
                // Bone hands
                ctx.strokeStyle = "#d8d0c0"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center-13,oy+h*0.5); ctx.lineTo(center-22,oy+h*0.4); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center-22,oy+h*0.4); ctx.lineTo(center-26,oy+h*0.3); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center-22,oy+h*0.4); ctx.lineTo(center-24,oy+h*0.5); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+13,oy+h*0.5); ctx.lineTo(center+22,oy+h*0.4); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+22,oy+h*0.4); ctx.lineTo(center+26,oy+h*0.3); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+22,oy+h*0.4); ctx.lineTo(center+24,oy+h*0.5); ctx.stroke();
                // Crown base
                ctx.fillStyle = "#1a0a2a"; ctx.fillRect(center-13,top-2,26,5);
                const lichSpikes = [10,14,18,14,10];
                const lichCols = [colors.highlight,"#ffd700",colors.main,"#ffd700",colors.highlight];
                for (let i = 0; i < 5; i++) {
                    const cx2=center-10+i*5;
                    ctx.fillStyle = "#1a0a2a"; ctx.beginPath(); ctx.moveTo(cx2-2,top-2); ctx.lineTo(cx2,top-lichSpikes[i]); ctx.lineTo(cx2+2,top-2); ctx.closePath(); ctx.fill();
                    ctx.fillStyle = lichCols[i]; ctx.beginPath(); ctx.moveTo(cx2-1.5,top-1); ctx.lineTo(cx2,top-lichSpikes[i]+2); ctx.lineTo(cx2+1.5,top-1); ctx.closePath(); ctx.fill();
                    ctx.fillStyle = "#9060d0"; ctx.beginPath(); ctx.arc(cx2,top-2,2,0,Math.PI*2); ctx.fill();
                }
                break;
            }
            case "eye_stalks": {
                // Eye stalks
                const stalkDefs = [{dx:-10,dy:-20,sz:5},{dx:-5,dy:-28,sz:4},{dx:0,dy:-26,sz:6},{dx:5,dy:-28,sz:4},{dx:10,dy:-20,sz:5}];
                for (const s of stalkDefs) {
                    ctx.strokeStyle = colors.outline; ctx.lineWidth = 3; ctx.lineCap = "round";
                    ctx.beginPath(); ctx.moveTo(center+s.dx*0.5,top+2); ctx.bezierCurveTo(center+s.dx*0.7,top+s.dy*0.4,center+s.dx,top+s.dy+6,center+s.dx,top+s.dy+s.sz); ctx.stroke();
                    ctx.strokeStyle = colors.main; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(center+s.dx*0.5,top+2); ctx.bezierCurveTo(center+s.dx*0.7,top+s.dy*0.4,center+s.dx,top+s.dy+6,center+s.dx,top+s.dy+s.sz); ctx.stroke();
                    ctx.fillStyle = "#f0e8d0"; ctx.beginPath(); ctx.arc(center+s.dx,top+s.dy,s.sz,0,Math.PI*2); ctx.fill();
                    ctx.strokeStyle = "#3a3020"; ctx.lineWidth = 0.8; ctx.stroke();
                    ctx.fillStyle = colors.highlight; ctx.beginPath(); ctx.arc(center+s.dx,top+s.dy,s.sz*0.65,0,Math.PI*2); ctx.fill();
                    ctx.fillStyle = "#0a0a0a"; ctx.beginPath(); ctx.arc(center+s.dx,top+s.dy,s.sz*0.32,0,Math.PI*2); ctx.fill();
                    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(center+s.dx-s.sz*0.3,top+s.dy-s.sz*0.3,s.sz*0.2,0,Math.PI*2); ctx.fill();
                }
                // Central large eye
                ctx.fillStyle = "#f8f0e0";
                ctx.beginPath(); ctx.ellipse(center,oy+h*0.48,12,10,0,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1.5; ctx.stroke();
                ctx.fillStyle = colors.highlight; ctx.beginPath(); ctx.arc(center,oy+h*0.48,7,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#1a0a00"; ctx.beginPath(); ctx.ellipse(center,oy+h*0.48,2,6.5,0,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.ellipse(center-3,oy+h*0.42,2.5,2,-0.3,0,Math.PI*2); ctx.fill();
                break;
            }


        default:
            matched = false;
    }
    return matched;
}
