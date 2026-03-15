import { FeatureCtx, makeGumdropPath, drawRoundedRect, drawPixelRect } from "./FeatureContext.js";

export function tryMythFeatures(fc: FeatureCtx): boolean {
    const { ctx, ox, oy, w, h, center, top, moveDir, colors } = fc;
    let matched = true;
    switch (fc.feature) {
            // ── Mythology Hero skins ───────────────────────────────────────
            case "zeus_bolts": {
                // Thundercloud halo
                ctx.save(); ctx.globalAlpha = 0.45;
                ctx.fillStyle = "#d0d8e8";
                ctx.beginPath(); ctx.arc(center-8,top-8,8,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center,top-10,10,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+8,top-8,7,0,Math.PI*2); ctx.fill();
                ctx.restore();
                // Lightning bolt crown
                ctx.fillStyle = "#ffd700";
                for (const bx of [-8,-4,0,4,8]) {
                    ctx.beginPath(); ctx.moveTo(center+bx,top+2); ctx.lineTo(center+bx-3,top-6); ctx.lineTo(center+bx-1,top-6); ctx.lineTo(center+bx-4,top-16); ctx.lineTo(center+bx+1,top-9); ctx.lineTo(center+bx-1,top-9); ctx.lineTo(center+bx+3,top+2); ctx.closePath(); ctx.fill();
                }
                ctx.fillStyle = colors.outline; ctx.fillRect(center-13,top-1,26,4);
                // Orbiting sparks
                const zsT = Date.now()*0.004;
                for (let i = 0; i < 6; i++) {
                    const sx=center+Math.cos(zsT+i*1.05)*22, sy=oy+h*0.5+Math.sin(zsT*0.8+i*1.05)*15;
                    ctx.save(); ctx.globalAlpha = Math.abs(Math.sin(zsT*2+i))*0.8;
                    ctx.fillStyle = i%2===0 ? "#ffd700" : "#ffffff";
                    ctx.beginPath(); ctx.arc(sx,sy,1.5,0,Math.PI*2); ctx.fill();
                    ctx.restore();
                }
                break;
            }
            case "athena_helm": {
                // Corinthian helmet
                ctx.fillStyle = colors.outline; ctx.beginPath(); ctx.arc(center,top+7,15,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;    ctx.beginPath(); ctx.arc(center,top+7,13,0,Math.PI*2); ctx.fill();
                // Nose guard
                ctx.fillStyle = colors.outline; ctx.fillRect(center-1.5,top+5,3,12);
                ctx.fillStyle = colors.main;    ctx.fillRect(center-0.5,top+6,1,10);
                // Cheek pieces
                ctx.fillStyle = colors.outline; ctx.fillRect(center-15,top+10,5,10); ctx.fillRect(center+10,top+10,5,10);
                // Plume
                ctx.fillStyle = "#6a3010"; ctx.fillRect(center-2,top-4,4,6);
                ctx.fillStyle = "#c02010";
                ctx.beginPath(); ctx.moveTo(center-3,top-3); ctx.bezierCurveTo(center-10,top-14,center-12,top-28,center,top-30); ctx.bezierCurveTo(center+12,top-28,center+10,top-14,center+3,top-3); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#ff4030";
                ctx.beginPath(); ctx.moveTo(center-1,top-3); ctx.bezierCurveTo(center-6,top-12,center-8,top-24,center,top-26); ctx.bezierCurveTo(center+8,top-24,center+6,top-12,center+1,top-3); ctx.closePath(); ctx.fill();
                // Owl eye on cheek piece
                ctx.fillStyle = "rgba(255,255,255,0.65)"; ctx.beginPath(); ctx.arc(center-12,top+15,3,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.outline;    ctx.beginPath(); ctx.arc(center-12,top+15,1.5,0,Math.PI*2); ctx.fill();
                break;
            }
            case "ares_shield": {
                // War helmet
                ctx.fillStyle = colors.outline; ctx.beginPath(); ctx.arc(center,top+7,15,Math.PI,0); ctx.fill();
                ctx.fillStyle = colors.main;    ctx.beginPath(); ctx.arc(center,top+7,13,Math.PI,0); ctx.fill();
                // Gold crest strip
                ctx.fillStyle = "#d0a000"; ctx.fillRect(center-2,top-6,4,14);
                ctx.fillStyle = "#f0c020"; ctx.fillRect(center-1,top-6,2,14);
                // Visor
                ctx.fillStyle = "rgba(0,0,0,0.68)"; ctx.fillRect(center-10,top+7,20,4);
                // Shield
                ctx.fillStyle = "#c02020";
                ctx.beginPath(); ctx.moveTo(center-18,oy+h*0.3); ctx.bezierCurveTo(center-22,oy+h*0.5,center-22,oy+h*0.65,center-18,oy+h*0.8); ctx.bezierCurveTo(center-14,oy+h*0.9,center-12,oy+h*0.9,center-12,oy+h*0.8); ctx.bezierCurveTo(center-8,oy+h*0.65,center-8,oy+h*0.5,center-12,oy+h*0.3); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(center-15,oy+h*0.45); ctx.lineTo(center-15,oy+h*0.65); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center-20,oy+h*0.55); ctx.lineTo(center-10,oy+h*0.55); ctx.stroke();
                // Spear
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center+14,top-8); ctx.lineTo(center+12,top+4); ctx.lineTo(center+16,top+4); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 2; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+14,top+4); ctx.lineTo(center+14,oy+h+4); ctx.stroke();
                break;
            }
            case "poseidon_trident": {
                // Trident handle
                ctx.strokeStyle = "#8a6020"; ctx.lineWidth = 3; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+16,oy+h*0.2); ctx.lineTo(center+16,oy+h+6); ctx.stroke();
                // Trident head prongs
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center+14,oy+h*0.2); ctx.lineTo(center+16,oy+h*0.2-12); ctx.lineTo(center+18,oy+h*0.2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+10,oy+h*0.2); ctx.lineTo(center+11,oy+h*0.2-9); ctx.lineTo(center+13,oy+h*0.2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+19,oy+h*0.2); ctx.lineTo(center+21,oy+h*0.2-9); ctx.lineTo(center+22,oy+h*0.2); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = colors.highlight; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(center+10,oy+h*0.2); ctx.lineTo(center+22,oy+h*0.2); ctx.stroke();
                // Rising water bubbles
                const posT = Date.now()*0.002;
                for (let i = 0; i < 5; i++) {
                    const bx=center-14+Math.sin(posT+i*1.3)*4;
                    const by=oy+h*0.3+i*5 - ((posT*20+i*30)%50);
                    ctx.save(); ctx.globalAlpha = 0.55;
                    ctx.strokeStyle = colors.highlight; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.arc(bx,by,2+i*0.4,0,Math.PI*2); ctx.stroke();
                    ctx.restore();
                }
                break;
            }
            case "apollo_lyre": {
                // Sun ray crown
                const apoT = Date.now()*0.002;
                for (let r = 0; r < 8; r++) {
                    const angle = (r/8)*Math.PI - Math.PI + apoT*0.3;
                    const len = 12+Math.sin(apoT*2+r)*3;
                    ctx.save(); ctx.globalAlpha = 0.85;
                    ctx.strokeStyle = r%2===0 ? "#ffd700" : "#ffa020"; ctx.lineWidth = 2.5-r%2; ctx.lineCap = "round";
                    ctx.beginPath(); ctx.moveTo(center+Math.cos(angle)*10,top+5+Math.sin(angle)*8); ctx.lineTo(center+Math.cos(angle)*(10+len),top+5+Math.sin(angle)*(8+len*0.6)); ctx.stroke();
                    ctx.restore();
                }
                ctx.fillStyle = "#c07000"; ctx.fillRect(center-12,top+2,24,4);
                ctx.fillStyle = "#ffd700"; ctx.fillRect(center-12,top+2,24,1.5);
                // Floating lyre
                const lyX=center-18, lyY=oy+h*0.4;
                ctx.strokeStyle = "#c07000"; ctx.lineWidth = 2; ctx.lineCap = "round";
                ctx.beginPath(); ctx.arc(lyX,lyY+4,5,0,Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(lyX-5,lyY+4); ctx.lineTo(lyX-6,lyY-6); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(lyX+5,lyY+4); ctx.lineTo(lyX+6,lyY-6); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(lyX-6,lyY-5); ctx.lineTo(lyX+6,lyY-5); ctx.stroke();
                ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 0.8;
                for (let s = 0; s < 4; s++) { ctx.beginPath(); ctx.moveTo(lyX-3+s*2,lyY-5); ctx.lineTo(lyX-2.5+s*2,lyY+2); ctx.stroke(); }
                break;
            }
            case "artemis_bow": {
                // Crescent moon above
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.arc(center,top-10,8,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.arc(center+5,top-12,7,0,Math.PI*2); ctx.fill();
                // Bow
                ctx.strokeStyle = "#8a6020"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.arc(center-20,oy+h*0.5,12,-Math.PI*0.4,Math.PI*0.4); ctx.stroke();
                ctx.strokeStyle = "#d0c0a0"; ctx.lineWidth = 0.8;
                const bsx=center-20+Math.cos(-Math.PI*0.4)*12, bsy=oy+h*0.5+Math.sin(-Math.PI*0.4)*12;
                const bex=center-20+Math.cos(Math.PI*0.4)*12, bey=oy+h*0.5+Math.sin(Math.PI*0.4)*12;
                ctx.beginPath(); ctx.moveTo(bsx,bsy); ctx.lineTo(bex,bey); ctx.stroke();
                // Quiver
                ctx.fillStyle = "#6a3010"; ctx.fillRect(center+11,oy+h*0.25,6,18);
                ctx.strokeStyle = "#8a5030"; ctx.lineWidth = 1; ctx.strokeRect(center+11,oy+h*0.25,6,18);
                // Arrows
                for (let a = 0; a < 3; a++) {
                    ctx.strokeStyle = "#c09050"; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(center+12+a*2,oy+h*0.26); ctx.lineTo(center+12+a*2,oy+h*0.1); ctx.stroke();
                    ctx.fillStyle = "#c03020";
                    ctx.beginPath(); ctx.moveTo(center+11+a*2,oy+h*0.1); ctx.lineTo(center+13+a*2,oy+h*0.1); ctx.lineTo(center+12+a*2,oy); ctx.closePath(); ctx.fill();
                }
                break;
            }
            case "hermes_wings": {
                // Winged cap
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.ellipse(center,top+4,14,6,0,Math.PI,0); ctx.fill();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(center,top+4,14,Math.PI,0); ctx.stroke();
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center-13,top+4); ctx.bezierCurveTo(center-22,top-4,center-26,top+4,center-18,top+8); ctx.bezierCurveTo(center-22,top+4,center-18,top+2,center-14,top+5); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+13,top+4); ctx.bezierCurveTo(center+22,top-4,center+26,top+4,center+18,top+8); ctx.bezierCurveTo(center+22,top+4,center+18,top+2,center+14,top+5); ctx.closePath(); ctx.fill();
                // Caduceus
                ctx.strokeStyle = "#c0a000"; ctx.lineWidth = 2; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+16,oy+h*0.15); ctx.lineTo(center+16,oy+h+4); ctx.stroke();
                // Two coiling snakes
                const cadT = Date.now()*0.002;
                for (const side of [-1,1]) {
                    ctx.strokeStyle = colors.main; ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    for (let pt = 0; pt < 8; pt++) {
                        const py=oy+h*0.2+pt*3.8, px=center+16+side*Math.sin(cadT+pt*0.8+side)*3.5;
                        if (pt===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
                    }
                    ctx.stroke();
                }
                // Staff wing tips
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center+14,oy+h*0.15); ctx.bezierCurveTo(center+8,oy+h*0.08,center+8,oy+h*0.22,center+14,oy+h*0.18); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+18,oy+h*0.15); ctx.bezierCurveTo(center+24,oy+h*0.08,center+24,oy+h*0.22,center+18,oy+h*0.18); ctx.closePath(); ctx.fill();
                break;
            }
            case "hades_helm": {
                // Shadow smoke wisps
                const hadesT = Date.now()*0.002;
                for (let i = 0; i < 5; i++) {
                    const wy = top - 4 - ((hadesT*30+i*20)%40);
                    ctx.save(); ctx.globalAlpha = 0.3;
                    ctx.fillStyle = colors.highlight;
                    ctx.beginPath(); ctx.ellipse(center-8+i*4,wy,3+i*0.4,5,Math.sin(hadesT+i)*0.3,0,Math.PI*2); ctx.fill();
                    ctx.restore();
                }
                // Dark helm
                ctx.save(); ctx.globalAlpha = 0.88;
                ctx.fillStyle = "#0a0418"; ctx.beginPath(); ctx.arc(center,top+7,15,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "rgba(80,40,120,0.55)"; ctx.beginPath(); ctx.arc(center,top+7,13,0,Math.PI*2); ctx.fill();
                ctx.globalAlpha = 0.5; ctx.strokeStyle = colors.highlight; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(center,top+7,14,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
                ctx.restore();
                // Skull motif
                ctx.save(); ctx.globalAlpha = 0.72;
                ctx.fillStyle = "#b0a0c0"; ctx.beginPath(); ctx.ellipse(center,top+8,5,6,0,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#0a0418";
                ctx.beginPath(); ctx.ellipse(center-2,top+6.5,1.5,2,0,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+2,top+6.5,1.5,2,0,0,Math.PI*2); ctx.fill();
                ctx.fillRect(center-2,top+10,4,1.5);
                ctx.restore();
                break;
            }
            case "hercules_club": {
                // Lion pelt draping
                ctx.fillStyle = "#c08030";
                ctx.beginPath(); ctx.moveTo(center-12,top+2); ctx.bezierCurveTo(center-22,top+10,center-24,oy+h*0.6,center-16,oy+h*0.8); ctx.bezierCurveTo(center-20,oy+h*0.6,center-18,top+14,center-10,top+4); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+12,top+2); ctx.bezierCurveTo(center+22,top+10,center+24,oy+h*0.6,center+16,oy+h*0.8); ctx.bezierCurveTo(center+20,oy+h*0.6,center+18,top+14,center+10,top+4); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#a06020";
                for (let i = 0; i < 8; i++) { const a=(i/8)*Math.PI*2; ctx.beginPath(); ctx.arc(center+Math.cos(a)*14,top+6+Math.sin(a)*10,5,0,Math.PI*2); ctx.fill(); }
                // Club
                ctx.strokeStyle = "#6a3010"; ctx.lineWidth = 5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+14,oy+h*0.5); ctx.lineTo(center+24,oy); ctx.stroke();
                ctx.fillStyle = "#6a3010"; ctx.beginPath(); ctx.arc(center+26,oy-2,8,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#8a5020"; ctx.beginPath(); ctx.arc(center+26,oy-2,6,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(center+26+Math.cos(k*1.57)*4,oy-2+Math.sin(k*1.57)*4,2,0,Math.PI*2); ctx.fill(); }
                break;
            }
            case "achilles_armor": {
                // Gleaming breastplate
                ctx.save(); makeGumdropPath(ctx,1,1,w-2,h-2); ctx.clip();
                const armorGrd = ctx.createLinearGradient(0,oy,w,oy+h);
                armorGrd.addColorStop(0,colors.highlight); armorGrd.addColorStop(0.4,colors.main); armorGrd.addColorStop(1,colors.outline);
                ctx.fillStyle = armorGrd; ctx.fillRect(ox,oy+h*0.25,w,h*0.55);
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(ox,oy+h*0.55); ctx.lineTo(ox+w,oy+h*0.55); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ox,oy+h*0.45); ctx.lineTo(ox+w,oy+h*0.45); ctx.stroke();
                ctx.strokeStyle = colors.highlight; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(center,oy+h*0.28); ctx.lineTo(center,oy+h*0.54); ctx.stroke();
                ctx.restore();
                // Corinthian helmet
                ctx.fillStyle = colors.outline; ctx.beginPath(); ctx.arc(center,top+6,14,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;    ctx.beginPath(); ctx.arc(center,top+6,12,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(center-9,top+7,18,4);
                ctx.fillStyle = colors.highlight; ctx.fillRect(center-9,top+0,5,2);
                // Spear
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 2.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+16,oy+h); ctx.lineTo(center+16,oy); ctx.stroke();
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center+13,oy); ctx.lineTo(center+16,oy-10); ctx.lineTo(center+19,oy); ctx.closePath(); ctx.fill();
                break;
            }
            case "odysseus_helm": {
                // Boar-tusk helmet
                ctx.fillStyle = colors.outline; ctx.beginPath(); ctx.arc(center,top+7,14,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;    ctx.beginPath(); ctx.arc(center,top+7,12,0,Math.PI*2); ctx.fill();
                const tuskCols = ["#f0e8d0","#e0d8c0"];
                for (let row = 0; row < 3; row++) {
                    for (let t = 0; t < 6; t++) { ctx.fillStyle = tuskCols[(row+t)%2]; ctx.fillRect(center-12+t*4,top+2+row*4,3.5,3.5); }
                }
                ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(center-9,top+9,18,4);
                // Wooden horse charm
                const hx=center+14, hy=oy+h*0.55;
                ctx.fillStyle = "#8a5020";
                ctx.fillRect(hx-4,hy-4,8,5); ctx.fillRect(hx-1,hy-7,2,4); ctx.fillRect(hx-2,hy-9,4,3);
                ctx.fillRect(hx-5,hy+1,2,4); ctx.fillRect(hx+3,hy+1,2,4);
                ctx.strokeStyle = "#6a3010"; ctx.lineWidth = 0.8; ctx.strokeRect(hx-4,hy-4,8,5);
                ctx.setLineDash([1.5,1.5]);
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(center+11,oy+h*0.5); ctx.lineTo(hx-4,hy); ctx.stroke();
                ctx.setLineDash([]);
                break;
            }
            case "perseus_shield": {
                // Winged helmet
                ctx.fillStyle = colors.outline; ctx.beginPath(); ctx.arc(center,top+7,14,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;    ctx.beginPath(); ctx.arc(center,top+7,12,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center-13,top+8); ctx.bezierCurveTo(center-22,top+2,center-26,top+12,center-18,top+16); ctx.bezierCurveTo(center-22,top+10,center-18,top+8,center-14,top+10); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+13,top+8); ctx.bezierCurveTo(center+22,top+2,center+26,top+12,center+18,top+16); ctx.bezierCurveTo(center+22,top+10,center+18,top+8,center+14,top+10); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(center-9,top+7,18,4);
                // Mirror shield
                ctx.fillStyle = "#c8d0d8"; ctx.beginPath(); ctx.arc(center-17,oy+h*0.5,9,0,Math.PI*2); ctx.fill();
                const shGrd = ctx.createRadialGradient(center-19,oy+h*0.45,0,center-17,oy+h*0.5,9);
                shGrd.addColorStop(0,"rgba(255,255,255,0.72)"); shGrd.addColorStop(0.5,"rgba(200,210,220,0.28)"); shGrd.addColorStop(1,"rgba(100,120,140,0)");
                ctx.fillStyle = shGrd; ctx.beginPath(); ctx.arc(center-17,oy+h*0.5,9,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#9090a8"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(center-17,oy+h*0.5,9,0,Math.PI*2); ctx.stroke();
                ctx.save(); ctx.globalAlpha = 0.55;
                ctx.fillStyle = "#a06040"; ctx.beginPath(); ctx.ellipse(center-17,oy+h*0.5,5,5.5,0,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#1a0a00";
                ctx.beginPath(); ctx.ellipse(center-19,oy+h*0.48,1.5,2,0,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center-15,oy+h*0.48,1.5,2,0,0,Math.PI*2); ctx.fill();
                ctx.restore();
                break;
            }
            case "thor_hammer": {
                // Viking helm with horns
                ctx.fillStyle = colors.outline; ctx.beginPath(); ctx.arc(center,top+7,14,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;    ctx.beginPath(); ctx.arc(center,top+7,12,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-13,top+8); ctx.bezierCurveTo(center-20,top+4,center-26,top-6,center-20,top-14); ctx.bezierCurveTo(center-22,top-4,center-18,top+2,center-12,top+8); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+13,top+8); ctx.bezierCurveTo(center+20,top+4,center+26,top-6,center+20,top-14); ctx.bezierCurveTo(center+22,top-4,center+18,top+2,center+12,top+8); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center-13,top+8); ctx.bezierCurveTo(center-19,top+4,center-24,top-4,center-19,top-11); ctx.bezierCurveTo(center-21,top-3,center-17,top+2,center-12,top+7); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+13,top+8); ctx.bezierCurveTo(center+19,top+4,center+24,top-4,center+19,top-11); ctx.bezierCurveTo(center+21,top-3,center+17,top+2,center+12,top+7); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.outline; ctx.fillRect(center-1.5,top+6,3,12);
                ctx.fillStyle = colors.highlight; ctx.fillRect(center-0.5,top+7,1,10);
                // Mjolnir floating
                const thorT = Date.now()*0.003;
                const mjX=center+16, mjY=oy+h*0.28+Math.sin(thorT)*3;
                ctx.fillStyle = colors.main; ctx.fillRect(mjX-5,mjY-3,10,8);
                ctx.strokeStyle = colors.highlight; ctx.lineWidth = 1; ctx.strokeRect(mjX-5,mjY-3,10,8);
                ctx.fillStyle = colors.outline; ctx.fillRect(mjX-1.5,mjY+5,3,8);
                // Lightning
                ctx.save(); ctx.globalAlpha = 0.75; ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 1.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(mjX,mjY+8); ctx.lineTo(mjX-3,mjY+14); ctx.lineTo(mjX+2,mjY+14); ctx.lineTo(mjX-1,mjY+20); ctx.stroke();
                ctx.restore();
                break;
            }
            case "odin_ravens": {
                // Wide-brim Odin hat
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.ellipse(center,top+4,18,5,0,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center-10,top+4); ctx.lineTo(center-4,top-20); ctx.lineTo(center+4,top-20); ctx.lineTo(center+10,top+4); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main; ctx.fillRect(center-8,top+1,16,4);
                // Eye patch (Odin's missing eye)
                ctx.fillStyle = "#1a0a0a"; ctx.beginPath(); ctx.ellipse(center+3,oy+h*0.48,4.5,5,0.3,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#3a1a1a"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(center+3,oy+h*0.48,4.5,0,Math.PI*2); ctx.stroke();
                // Raven silhouettes
                ctx.fillStyle = "#1a1a2a";
                ctx.beginPath(); ctx.moveTo(center-16,oy+h*0.3); ctx.bezierCurveTo(center-22,oy+h*0.2,center-26,oy+h*0.38,center-20,oy+h*0.42); ctx.bezierCurveTo(center-24,oy+h*0.38,center-22,oy+h*0.3,center-16,oy+h*0.32); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center-20,oy+h*0.42); ctx.lineTo(center-24,oy+h*0.55); ctx.lineTo(center-16,oy+h*0.5); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+16,oy+h*0.3); ctx.bezierCurveTo(center+22,oy+h*0.2,center+26,oy+h*0.38,center+20,oy+h*0.42); ctx.bezierCurveTo(center+24,oy+h*0.38,center+22,oy+h*0.3,center+16,oy+h*0.32); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+20,oy+h*0.42); ctx.lineTo(center+24,oy+h*0.55); ctx.lineTo(center+16,oy+h*0.5); ctx.closePath(); ctx.fill();
                // Rune staff
                ctx.strokeStyle = "#6a4010"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+14,oy+h*0.2); ctx.lineTo(center+14,oy+h+4); ctx.stroke();
                ctx.strokeStyle = colors.highlight; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(center+11,oy+h*0.3); ctx.lineTo(center+14,oy+h*0.3); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+11,oy+h*0.4); ctx.lineTo(center+17,oy+h*0.4); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+11,oy+h*0.5); ctx.lineTo(center+14,oy+h*0.5); ctx.stroke();
                break;
            }
            case "loki_horns": {
                // Wide curved Loki horns
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-8,top+2); ctx.bezierCurveTo(center-16,top-4,center-22,top-10,center-20,top-20); ctx.bezierCurveTo(center-16,top-12,center-10,top-4,center-6,top+2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+8,top+2); ctx.bezierCurveTo(center+16,top-4,center+22,top-10,center+20,top-20); ctx.bezierCurveTo(center+16,top-12,center+10,top-4,center+6,top+2); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center-7,top+2); ctx.bezierCurveTo(center-14,top-3,center-19,top-8,center-18,top-16); ctx.bezierCurveTo(center-14,top-9,center-9,top-3,center-5,top+2); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+7,top+2); ctx.bezierCurveTo(center+14,top-3,center+19,top-8,center+18,top-16); ctx.bezierCurveTo(center+14,top-9,center+9,top-3,center+5,top+2); ctx.closePath(); ctx.fill();
                // Trickster wide grin
                ctx.fillStyle = "rgba(0,0,0,0.7)";
                ctx.beginPath(); ctx.arc(center,oy+h*0.63,9,0,Math.PI); ctx.fill();
                ctx.fillStyle = "#fff8f0";
                for (let t = 0; t < 5; t++) { ctx.beginPath(); ctx.moveTo(center-8+t*4,oy+h*0.63); ctx.lineTo(center-7+t*4,oy+h*0.70); ctx.lineTo(center-6+t*4,oy+h*0.63); ctx.closePath(); ctx.fill(); }
                // Snake coiling on body
                const lokiT = Date.now()*0.002;
                ctx.strokeStyle = "#2a5030"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
                ctx.beginPath();
                for (let pt = 0; pt < 8; pt++) {
                    const py=oy+h*0.25+pt*3.5, px=center+Math.sin(lokiT+pt*0.9)*7;
                    if (pt===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
                }
                ctx.stroke();
                break;
            }
            case "ra_crown": {
                // Solar disk with glow
                ctx.save(); ctx.shadowColor = "#ffa020"; ctx.shadowBlur = 14;
                ctx.fillStyle = "#d08020"; ctx.beginPath(); ctx.arc(center,top-10,10,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#ffd060"; ctx.beginPath(); ctx.arc(center,top-10,8,0,Math.PI*2); ctx.fill();
                ctx.shadowBlur=0; ctx.restore();
                // Uraeus cobra
                ctx.strokeStyle = "#c0a000"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center,top+2); ctx.bezierCurveTo(center-2,top-4,center+4,top-10,center,top-18); ctx.stroke();
                ctx.fillStyle = "#c0a000"; ctx.beginPath(); ctx.ellipse(center-1,top-19,3.5,4,-0.3,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(center-1,top-19,3,0,Math.PI*2); ctx.stroke();
                // Red & white crown band
                ctx.fillStyle = "#c02020"; ctx.fillRect(center-12,top+0,24,4);
                ctx.fillStyle = "#f8f8f8"; ctx.fillRect(center-12,top+0,24,1.5);
                // Ankh charm
                const ankX=center+16, ankY=oy+h*0.4;
                ctx.setLineDash([1.5,1.5]); ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.35); ctx.lineTo(ankX,ankY-7); ctx.stroke();
                ctx.setLineDash([]);
                ctx.strokeStyle = "#c0a000"; ctx.lineWidth = 2; ctx.lineCap = "round";
                ctx.beginPath(); ctx.arc(ankX,ankY-5,3,0,Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ankX,ankY-2); ctx.lineTo(ankX,ankY+5); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ankX-3,ankY); ctx.lineTo(ankX+3,ankY); ctx.stroke();
                break;
            }
            case "anubis_ears": {
                // Tall jackal ears
                ctx.fillStyle = "#1a1a2a";
                ctx.beginPath(); ctx.moveTo(center-10,top+4); ctx.lineTo(center-16,top-24); ctx.lineTo(center-4,top+0); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+10,top+4); ctx.lineTo(center+16,top-24); ctx.lineTo(center+4,top+0); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#6060a0";
                ctx.beginPath(); ctx.moveTo(center-9,top+3); ctx.lineTo(center-14,top-20); ctx.lineTo(center-5,top+0); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+9,top+3); ctx.lineTo(center+14,top-20); ctx.lineTo(center+5,top+0); ctx.closePath(); ctx.fill();
                // Kohl eye lines
                ctx.strokeStyle = "#1a1a2a"; ctx.lineWidth = 1.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center-7,oy+h*0.46); ctx.lineTo(center-12,oy+h*0.44); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+7,oy+h*0.46); ctx.lineTo(center+12,oy+h*0.44); ctx.stroke();
                ctx.fillStyle = "#ffd700";
                ctx.beginPath(); ctx.arc(center-11.5,oy+h*0.44,1.5,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+11.5,oy+h*0.44,1.5,0,Math.PI*2); ctx.fill();
                // Scale of Ma'at
                const scX=center+14, scY=oy+h*0.5;
                ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 1.5; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(scX,scY-8); ctx.lineTo(scX,scY+2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(scX-6,scY-5); ctx.lineTo(scX+6,scY-5); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(scX-6,scY-5); ctx.lineTo(scX-7,scY+2); ctx.stroke();
                ctx.beginPath(); ctx.arc(scX-7,scY+2,3,0,Math.PI); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(scX+6,scY-5); ctx.lineTo(scX+7,scY+2); ctx.stroke();
                ctx.beginPath(); ctx.arc(scX+7,scY+2,3,0,Math.PI); ctx.stroke();
                break;
            }
            case "gilgamesh_crown": {
                // Mesopotamian cylinder crown
                ctx.fillStyle = colors.outline; ctx.fillRect(center-11,top-18,22,20);
                ctx.fillStyle = colors.main;    ctx.fillRect(center-10,top-17,20,18);
                ctx.fillStyle = colors.highlight;
                ctx.fillRect(center-11,top-18,22,3); ctx.fillRect(center-11,top-10,22,2); ctx.fillRect(center-11,top-3,22,2);
                // Zigzag engraving
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 0.8;
                for (let z = 0; z < 6; z++) {
                    const zx=center-9+z*3.5;
                    ctx.beginPath(); ctx.moveTo(zx,top-16); ctx.lineTo(zx+1.75,top-12); ctx.lineTo(zx+3.5,top-16); ctx.stroke();
                }
                // Lion head emblem
                ctx.save(); makeGumdropPath(ctx,1,1,w-2,h-2); ctx.clip();
                ctx.fillStyle = colors.highlight; ctx.beginPath(); ctx.arc(center,oy+h*0.55,6,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(center,oy+h*0.55,8,0,Math.PI*2); ctx.stroke();
                ctx.fillStyle = "#1a0a00";
                ctx.beginPath(); ctx.arc(center-2,oy+h*0.53,1.5,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+2,oy+h*0.53,1.5,0,Math.PI*2); ctx.fill();
                ctx.restore();
                break;
            }
            case "wukong_staff": {
                // Golden headband
                ctx.fillStyle = "#c08000"; ctx.fillRect(center-13,top+3,26,5);
                ctx.fillStyle = "#ffd700"; ctx.fillRect(center-13,top+3,26,1.5); ctx.fillRect(center-13,top+7,26,1.5);
                ctx.fillStyle = "#c08000"; ctx.beginPath(); ctx.arc(center,top+5.5,3,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#ffe860"; ctx.beginPath(); ctx.arc(center,top+5.5,1.8,0,Math.PI*2); ctx.fill();
                // Ruyi Jingu Bang staff
                ctx.strokeStyle = "#c08000"; ctx.lineWidth = 3; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+14,oy); ctx.lineTo(center+14,oy+h+6); ctx.stroke();
                ctx.fillStyle = "#c08000";
                ctx.beginPath(); ctx.arc(center+14,oy,5,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+14,oy+h+6,5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#ffd700";
                ctx.beginPath(); ctx.arc(center+14,oy,3.5,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+14,oy+h+6,3.5,0,Math.PI*2); ctx.fill();
                // Cloud curl (Nimbus)
                const cloudT = Date.now()*0.002;
                ctx.save(); ctx.globalAlpha = 0.72;
                ctx.fillStyle = "#fff8f0";
                ctx.beginPath(); ctx.arc(center-16+Math.sin(cloudT)*2,oy+h*0.6,5,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center-12+Math.sin(cloudT+0.5)*2,oy+h*0.56,4,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center-20+Math.sin(cloudT+1)*2,oy+h*0.62,3.5,0,Math.PI*2); ctx.fill();
                ctx.restore();
                break;
            }
            case "beowulf_scale": {
                // Dragon scale armor on body
                ctx.save(); makeGumdropPath(ctx,1,1,w-2,h-2); ctx.clip();
                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 4; col++) {
                        const scx=ox+1+col*8-(row%2)*4, scy=oy+2+row*7;
                        ctx.fillStyle = row%2===0 ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.09)";
                        ctx.beginPath(); ctx.moveTo(scx+4,scy); ctx.bezierCurveTo(scx+8,scy,scx+8,scy+6,scx+4,scy+7); ctx.bezierCurveTo(scx,scy+6,scx,scy,scx+4,scy); ctx.closePath(); ctx.fill();
                    }
                }
                ctx.restore();
                // Great sword
                ctx.strokeStyle = "#a0b0b8"; ctx.lineWidth = 4; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center+14,oy+h+6); ctx.lineTo(center+14,oy-8); ctx.stroke();
                ctx.fillStyle = "#d0d8e0";
                ctx.beginPath(); ctx.moveTo(center+11,oy-8); ctx.lineTo(center+14,oy-18); ctx.lineTo(center+17,oy-8); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = "#a0a8b0"; ctx.lineWidth = 1; ctx.stroke();
                ctx.fillStyle = "#c0a030"; ctx.fillRect(center+9,oy+h*0.3,10,3);
                ctx.fillStyle = "#ffd700"; ctx.fillRect(center+9,oy+h*0.3,10,1);
                // Battle helm
                ctx.fillStyle = colors.outline; ctx.beginPath(); ctx.arc(center,top+7,14,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;    ctx.beginPath(); ctx.arc(center,top+7,12,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(center-9,top+7,18,4);
                ctx.fillStyle = colors.outline; ctx.fillRect(center-1,top+6,2,11);
                break;
            }

        default:
            matched = false;
    }
    return matched;
}
