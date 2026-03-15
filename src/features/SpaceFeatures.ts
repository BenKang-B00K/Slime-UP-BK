import { FeatureCtx, makeGumdropPath, drawRoundedRect, drawPixelRect } from "./FeatureContext.js";

export function trySpaceFeatures(fc: FeatureCtx): boolean {
    const { ctx, ox, oy, w, h, center, top, moveDir, colors } = fc;
    let matched = true;
    switch (fc.feature) {
            // ── Space skins ────────────────────────────────────────────────
            case "space_helmet": {
                // Outer helmet shell
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center, top+8, 16, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.arc(center, top+8, 14, 0, Math.PI*2); ctx.fill();
                // Visor
                ctx.fillStyle = "rgba(80,160,255,0.72)";
                ctx.beginPath(); ctx.ellipse(center, top+9, 9, 8, 0, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = "rgba(180,220,255,0.5)"; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(center, top+9, 9, 0, Math.PI*2); ctx.stroke();
                // Visor shine
                ctx.fillStyle = "rgba(255,255,255,0.45)";
                ctx.beginPath(); ctx.ellipse(center-4, top+4, 3.5, 3, -0.4, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "rgba(255,255,255,0.25)";
                ctx.beginPath(); ctx.ellipse(center+4, top+12, 1.5, 1, 0, 0, Math.PI*2); ctx.fill();
                // Collar ring
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(center, top+20, 14, Math.PI*0.1, Math.PI*0.9); ctx.stroke();
                ctx.fillStyle = "rgba(200,220,240,0.4)";
                ctx.beginPath(); ctx.rect(center-8, top+18, 16, 5); ctx.fill();
                break;
            }
            case "alien_eyes": {
                // Antennae
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 2; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center-7,top+2); ctx.quadraticCurveTo(center-14,top-10,center-10,top-18); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+7,top+2); ctx.quadraticCurveTo(center+14,top-10,center+10,top-18); ctx.stroke();
                // Antenna bulbs
                ctx.fillStyle = "#ffd700";
                ctx.beginPath(); ctx.arc(center-10, top-18, 3.5, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+10, top-18, 3.5, 0, Math.PI*2); ctx.fill();
                ctx.save(); ctx.globalAlpha = 0.6;
                ctx.fillStyle = "#fff";
                ctx.beginPath(); ctx.arc(center-11, top-19.5, 1.5, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+9, top-19.5, 1.5, 0, Math.PI*2); ctx.fill();
                ctx.restore();
                // Big alien eyes (horizontal oval, dark slit pupil)
                ctx.fillStyle = "#111";
                ctx.beginPath(); ctx.ellipse(center-5, oy+h*0.48, 6, 4.5, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+5, oy+h*0.48, 6, 4.5, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.ellipse(center-5, oy+h*0.48, 5, 3.5, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+5, oy+h*0.48, 5, 3.5, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#111";
                ctx.beginPath(); ctx.ellipse(center-5, oy+h*0.48, 1.5, 3, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+5, oy+h*0.48, 1.5, 3, 0, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "rocket_fins": {
                // Main fin (left)
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-12, oy+h); ctx.lineTo(center-22, oy+h+14); ctx.lineTo(center-10, oy+h-4); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-12, oy+h); ctx.lineTo(center-20, oy+h+12); ctx.lineTo(center-10, oy+h-2); ctx.closePath(); ctx.fill();
                // Main fin (right)
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center+12, oy+h); ctx.lineTo(center+22, oy+h+14); ctx.lineTo(center+10, oy+h-4); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center+12, oy+h); ctx.lineTo(center+20, oy+h+12); ctx.lineTo(center+10, oy+h-2); ctx.closePath(); ctx.fill();
                // Exhaust flame
                const rftT = Date.now()*0.006;
                ctx.save(); ctx.globalAlpha = 0.85;
                const flameColors = ["#ff4500","#ff8c00","#ffd700"];
                for (let i = 0; i < 3; i++) {
                    const flh = 12 + Math.sin(rftT + i*2.1)*5;
                    ctx.fillStyle = flameColors[i];
                    ctx.beginPath(); ctx.ellipse(center, oy+h+flh/2+2, 4-i, flh/2, 0, 0, Math.PI*2); ctx.fill();
                }
                ctx.restore();
                // Nose cone tip
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center, top-14); ctx.lineTo(center-6, top+2); ctx.lineTo(center+6, top+2); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.moveTo(center, top-12); ctx.lineTo(center-4, top+0); ctx.lineTo(center-2, top+0); ctx.closePath(); ctx.fill();
                break;
            }
            case "planet_ring": {
                // Ring (behind the body feel — drawn in two passes)
                ctx.save(); ctx.globalAlpha = 0.45;
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.55, 22, 6, 0, 0, Math.PI*2); ctx.fill();
                ctx.restore();
                // Front ring half
                ctx.save(); ctx.globalAlpha = 0.82;
                const ringGrd = ctx.createLinearGradient(center-22, oy+h*0.55, center+22, oy+h*0.55);
                ringGrd.addColorStop(0, colors.highlight); ringGrd.addColorStop(0.5, colors.main); ringGrd.addColorStop(1, colors.outline);
                ctx.strokeStyle = ringGrd; ctx.lineWidth = 6;
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.55, 22, 6, 0, 0, Math.PI); ctx.stroke();
                ctx.restore();
                // Small moon
                ctx.fillStyle = "#d0d8e0";
                ctx.beginPath(); ctx.arc(center+26, top+4, 4, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#b0b8c0";
                ctx.beginPath(); ctx.arc(center+25, top+3, 1.5, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "comet_trail": {
                // Icy trail behind
                const cometT = Date.now()*0.004;
                for (let i = 0; i < 6; i++) {
                    const tx = center - 14 - i*6 + Math.sin(cometT+i)*2;
                    const ty = oy + h*0.5 + i*2;
                    ctx.save(); ctx.globalAlpha = (1-i/6)*0.7;
                    ctx.fillStyle = i%2===0 ? "#c8e8ff" : "#ffffff";
                    ctx.beginPath(); ctx.ellipse(tx, ty, 3-i*0.3, 2-i*0.2, 0, 0, Math.PI*2); ctx.fill();
                    ctx.restore();
                }
                // Icy nucleus
                ctx.save();
                ctx.shadowColor = "#a0d8ff"; ctx.shadowBlur = 10;
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.arc(center, oy+h*0.42, 5, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur=0; ctx.restore();
                // Star sparkle
                const cometST = Date.now()*0.003;
                for (let i = 0; i < 4; i++) {
                    const sx = center - 8 + Math.cos(cometST+i*1.57)*16;
                    const sy = oy + h*0.3 + Math.sin(cometST*0.7+i*1.57)*10;
                    ctx.save(); ctx.globalAlpha = Math.abs(Math.sin(cometST+i))*0.9;
                    ctx.fillStyle = "#ffffff";
                    ctx.beginPath(); ctx.arc(sx, sy, 1.2, 0, Math.PI*2); ctx.fill();
                    ctx.restore();
                }
                break;
            }
            case "event_horizon": {
                // Swirling gravitational lens ring
                const bhT = Date.now()*0.002;
                for (let ring = 0; ring < 3; ring++) {
                    ctx.save();
                    ctx.translate(center, oy+h*0.5);
                    ctx.rotate(bhT*(ring%2===0?1:-1)*0.6 + ring*Math.PI/3);
                    ctx.strokeStyle = ring===0 ? "#8040c0" : ring===1 ? "#4000a0" : "#c060ff";
                    ctx.lineWidth = 2.5 - ring*0.6;
                    ctx.globalAlpha = 0.6-ring*0.1;
                    ctx.beginPath(); ctx.ellipse(0, 0, 18-ring*2, 5-ring, 0, 0, Math.PI*2); ctx.stroke();
                    ctx.restore();
                }
                // Central void
                ctx.fillStyle = "#06030f";
                ctx.beginPath(); ctx.arc(center, oy+h*0.5, 9, 0, Math.PI*2); ctx.fill();
                // Accretion glow
                ctx.save();
                ctx.shadowColor = "#8040c0"; ctx.shadowBlur = 16;
                ctx.strokeStyle = "#c060ff"; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(center, oy+h*0.5, 9, 0, Math.PI*2); ctx.stroke();
                ctx.shadowBlur=0; ctx.restore();
                break;
            }
            case "nebula_wisps": {
                // Colorful translucent cloud wisps
                const nebulaColors = [["#ff80ff","rgba(255,128,255,0)"],["#80c0ff","rgba(128,192,255,0)"],["#ff60a0","rgba(255,96,160,0)"],["#a060ff","rgba(160,96,255,0)"]];
                const nbT = Date.now()*0.0008;
                for (let i = 0; i < 4; i++) {
                    const wispX = center + Math.cos(nbT+i*1.57)*14;
                    const wispY = oy+h*0.4 + Math.sin(nbT*0.7+i*1.57)*10;
                    ctx.save(); ctx.globalAlpha = 0.42;
                    const wGrd = ctx.createRadialGradient(wispX,wispY,0,wispX,wispY,12);
                    wGrd.addColorStop(0, nebulaColors[i][0]); wGrd.addColorStop(1, nebulaColors[i][1]);
                    ctx.fillStyle = wGrd;
                    ctx.beginPath(); ctx.arc(wispX, wispY, 12, 0, Math.PI*2); ctx.fill();
                    ctx.restore();
                }
                break;
            }
            case "star_body": {
                // Stars embedded in body — static seed-based positions
                ctx.save();
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                const starSeeds = [[6,8],[14,5],[22,12],[8,18],[20,6],[11,22],[17,16],[5,14],[23,20],[13,10]];
                for (let i = 0; i < 10; i++) {
                    const blink = Math.abs(Math.sin(Date.now()*0.003 + i*0.7));
                    ctx.globalAlpha = blink*0.85+0.15;
                    ctx.fillStyle = i%3===0 ? "#ffd700" : i%3===1 ? "#c0d8ff" : "#ffffff";
                    ctx.beginPath(); ctx.arc(ox+starSeeds[i][0], oy+starSeeds[i][1], 1.2+(blink*0.8), 0, Math.PI*2); ctx.fill();
                }
                ctx.restore();
                // Milky Way streak
                ctx.save();
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                ctx.save(); ctx.globalAlpha = 0.18;
                const mwGrd = ctx.createLinearGradient(0,oy,w,oy+h);
                mwGrd.addColorStop(0,"rgba(180,200,255,0)"); mwGrd.addColorStop(0.5,"rgba(200,220,255,0.9)"); mwGrd.addColorStop(1,"rgba(180,200,255,0)");
                ctx.fillStyle = mwGrd; ctx.fillRect(ox,oy,w,h);
                ctx.restore(); ctx.restore();
                break;
            }
            case "moon_craters": {
                // Crater circles on body surface
                ctx.save();
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                const craters = [[7,10,5],[20,8,4],[14,20,3],[5,22,2.5],[23,18,2]];
                for (const [cx2,cy2,cr] of craters) {
                    ctx.fillStyle = "rgba(0,0,0,0.12)";
                    ctx.beginPath(); ctx.arc(ox+cx2, oy+cy2, cr, 0, Math.PI*2); ctx.fill();
                    ctx.fillStyle = "rgba(255,255,255,0.14)";
                    ctx.beginPath(); ctx.arc(ox+cx2-cr*0.3, oy+cy2-cr*0.3, cr*0.5, 0, Math.PI*2); ctx.fill();
                }
                ctx.restore();
                // Crescent moon accent above
                ctx.fillStyle = colors.highlight;
                ctx.beginPath(); ctx.arc(center, top-8, 7, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center+4, top-10, 6, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "solar_corona": {
                // Pulsing corona rays
                const sunT = Date.now()*0.003;
                for (let ray = 0; ray < 12; ray++) {
                    const angle = (ray/12)*Math.PI*2 + sunT*0.5;
                    const len = 14 + Math.sin(sunT*2+ray*0.9)*4;
                    const gx1 = center + Math.cos(angle)*13;
                    const gy1 = oy+h*0.5 + Math.sin(angle)*10;
                    const gx2 = center + Math.cos(angle)*(13+len);
                    const gy2 = oy+h*0.5 + Math.sin(angle)*(10+len*0.75);
                    ctx.save(); ctx.globalAlpha = 0.55;
                    ctx.strokeStyle = ray%2===0 ? "#ffd700" : "#ff9000";
                    ctx.lineWidth = 2.5-Math.abs(Math.sin(sunT+ray))*1;
                    ctx.lineCap = "round";
                    ctx.beginPath(); ctx.moveTo(gx1,gy1); ctx.lineTo(gx2,gy2); ctx.stroke();
                    ctx.restore();
                }
                // Sunspot dots
                ctx.save();
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                ctx.fillStyle = "rgba(160,50,0,0.5)";
                ctx.beginPath(); ctx.ellipse(center-4, oy+h*0.42, 3, 2, 0.3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+6, oy+h*0.6, 2, 1.5, -0.2, 0, Math.PI*2); ctx.fill();
                ctx.restore();
                break;
            }
            case "sat_panels": {
                // Left solar panel
                ctx.fillStyle = colors.outline;
                ctx.fillRect(center-26, oy+h*0.36-2, 12, 12);
                ctx.fillStyle = colors.main;
                ctx.fillRect(center-25, oy+h*0.36-1, 10, 10);
                // Panel grid lines
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.moveTo(center-22, oy+h*0.36-1); ctx.lineTo(center-22, oy+h*0.36+9); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center-25, oy+h*0.36+4); ctx.lineTo(center-15, oy+h*0.36+4); ctx.stroke();
                // Right solar panel
                ctx.fillStyle = colors.outline;
                ctx.fillRect(center+14, oy+h*0.36-2, 12, 12);
                ctx.fillStyle = colors.main;
                ctx.fillRect(center+15, oy+h*0.36-1, 10, 10);
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.moveTo(center+18, oy+h*0.36-1); ctx.lineTo(center+18, oy+h*0.36+9); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+15, oy+h*0.36+4); ctx.lineTo(center+25, oy+h*0.36+4); ctx.stroke();
                // Panel connecting rods
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(center-14, oy+h*0.36+4); ctx.lineTo(center-12, oy+h*0.36+4); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+12, oy+h*0.36+4); ctx.lineTo(center+14, oy+h*0.36+4); ctx.stroke();
                // Dish antenna
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(center, top+2); ctx.lineTo(center, top-6); ctx.stroke();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.arc(center, top-6, 5, Math.PI, Math.PI*2); ctx.fill();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(center, top-6, 5, Math.PI, Math.PI*2); ctx.stroke();
                break;
            }
            case "ufo_saucer": {
                // Saucer body (top dome)
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.ellipse(center, top-2, 18, 9, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.ellipse(center, top-3, 16, 7, 0, 0, Math.PI*2); ctx.fill();
                // Dome
                ctx.fillStyle = "rgba(160,240,200,0.75)";
                ctx.beginPath(); ctx.ellipse(center, top-5, 9, 6, 0, Math.PI, 0); ctx.fill();
                ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(center, top-5, 9, Math.PI, 0); ctx.stroke();
                // Dome shine
                ctx.fillStyle = "rgba(255,255,255,0.35)";
                ctx.beginPath(); ctx.ellipse(center-3, top-8, 3, 2, -0.3, 0, Math.PI*2); ctx.fill();
                // Tractor beam
                const ufoT = Date.now()*0.003;
                ctx.save(); ctx.globalAlpha = 0.25 + Math.abs(Math.sin(ufoT))*0.2;
                const beamGrd = ctx.createLinearGradient(center, top+5, center, oy+h+20);
                beamGrd.addColorStop(0, "rgba(160,255,200,0.9)"); beamGrd.addColorStop(1, "rgba(160,255,200,0)");
                ctx.fillStyle = beamGrd;
                ctx.beginPath(); ctx.moveTo(center-8,top+5); ctx.lineTo(center-18,oy+h+20); ctx.lineTo(center+18,oy+h+20); ctx.lineTo(center+8,top+5); ctx.closePath(); ctx.fill();
                ctx.restore();
                // Bottom light ring
                const lightCols = ["#ff4040","#40ff40","#4040ff","#ffff40"];
                for (let i = 0; i < 6; i++) {
                    const angle = (i/6)*Math.PI + ufoT*2;
                    ctx.fillStyle = lightCols[i%4];
                    ctx.beginPath(); ctx.arc(center+Math.cos(angle)*13, top-1+Math.sin(angle)*3, 2, 0, Math.PI*2); ctx.fill();
                }
                break;
            }
            case "meteor_crust": {
                // Rocky crust texture on body
                ctx.save();
                makeGumdropPath(ctx, 0, 0, w, h); ctx.clip();
                // Rocky patches
                const rocks = [[3,4,8,6],[18,2,7,5],[1,16,6,8],[20,14,7,6],[8,24,10,5],[12,8,6,5]];
                for (const [rx,ry,rw,rh] of rocks) {
                    ctx.fillStyle = "rgba(80,40,0,0.22)";
                    ctx.beginPath(); ctx.ellipse(ox+rx+rw/2,oy+ry+rh/2,rw/2,rh/2,0,0,Math.PI*2); ctx.fill();
                }
                ctx.restore();
                // Fire trail (animated)
                const metT = Date.now()*0.005;
                for (let i = 0; i < 4; i++) {
                    const tx = center + 10 + i*5 + Math.sin(metT+i)*2;
                    const ty = oy + h*0.3 - i*3 + Math.cos(metT*0.8+i)*2;
                    ctx.save(); ctx.globalAlpha = (1-i/4)*0.75;
                    ctx.fillStyle = i===0?"#ffd700":i===1?"#ff8c00":"#ff4500";
                    ctx.beginPath(); ctx.ellipse(tx, ty, 3-i*0.4, 4-i*0.5, 0.5, 0, Math.PI*2); ctx.fill();
                    ctx.restore();
                }
                break;
            }
            case "energy_beams": {
                // Twin pulsing energy beams
                const pbT = Date.now()*0.004;
                const beamLen = 22 + Math.sin(pbT*3)*4;
                ctx.save();
                ctx.shadowColor = colors.highlight; ctx.shadowBlur = 12;
                // Top beam
                ctx.strokeStyle = colors.highlight; ctx.lineWidth = 3; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center-3, top+2); ctx.lineTo(center-3, top-beamLen); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+3, top+2); ctx.lineTo(center+3, top-beamLen); ctx.stroke();
                // Bottom beam
                ctx.beginPath(); ctx.moveTo(center-3, oy+h-2); ctx.lineTo(center-3, oy+h+beamLen); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+3, oy+h-2); ctx.lineTo(center+3, oy+h+beamLen); ctx.stroke();
                // Beam glow tip
                ctx.fillStyle = "#ffffff";
                ctx.beginPath(); ctx.arc(center, top-beamLen, 4, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center, oy+h+beamLen, 4, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur=0; ctx.restore();
                break;
            }
            case "spiral_arms": {
                // Galaxy spiral arms overlay
                const galT = Date.now()*0.0008;
                ctx.save();
                makeGumdropPath(ctx, 1, 1, w-2, h-2); ctx.clip();
                ctx.save(); ctx.translate(center, oy+h*0.5);
                ctx.rotate(galT);
                for (let arm = 0; arm < 2; arm++) {
                    ctx.rotate(Math.PI * arm);
                    for (let pt = 2; pt < 12; pt++) {
                        const angle = pt * 0.5;
                        const radius = pt * 1.6;
                        const px = Math.cos(angle)*radius;
                        const py = Math.sin(angle)*radius;
                        ctx.globalAlpha = 0.18 + (pt/12)*0.25;
                        ctx.fillStyle = pt%2===0 ? colors.highlight : "#ffffff";
                        ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI*2); ctx.fill();
                    }
                }
                ctx.restore(); ctx.restore();
                break;
            }
            case "cosmo_helmet": {
                // Soviet-style rounded helmet
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center, top+8, 15, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.arc(center, top+8, 13, 0, Math.PI*2); ctx.fill();
                // Visor (smaller, more vertical rectangle shape)
                ctx.fillStyle = "rgba(100,140,200,0.78)";
                ctx.beginPath(); ctx.roundRect(center-7, top+2, 14, 13, 4); ctx.fill();
                // Visor frame
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(center-7, top+2, 14, 13, 4); ctx.stroke();
                // Red star on top
                ctx.fillStyle = "#ff2020";
                const starCX = center, starCY = top-4, starR = 5;
                ctx.beginPath();
                for (let sp = 0; sp < 10; sp++) {
                    const sr = sp%2===0 ? starR : starR*0.43;
                    const sa = (sp/10)*Math.PI*2 - Math.PI/2;
                    if (sp===0) ctx.moveTo(starCX+Math.cos(sa)*sr, starCY+Math.sin(sa)*sr);
                    else ctx.lineTo(starCX+Math.cos(sa)*sr, starCY+Math.sin(sa)*sr);
                }
                ctx.closePath(); ctx.fill();
                ctx.strokeStyle = "#cc0000"; ctx.lineWidth = 0.8;
                ctx.stroke();
                break;
            }
            case "dark_matter_field": {
                // Distortion rings (outer)
                const dmT = Date.now()*0.0015;
                for (let ring = 0; ring < 4; ring++) {
                    const phase = dmT + ring*Math.PI/2;
                    const scale = 1 + Math.sin(phase)*0.08;
                    ctx.save(); ctx.translate(center, oy+h*0.5);
                    ctx.scale(scale, scale*0.6);
                    ctx.strokeStyle = colors.highlight;
                    ctx.lineWidth = 1.5-ring*0.3;
                    ctx.globalAlpha = (0.5-ring*0.1)*Math.abs(Math.sin(phase));
                    ctx.beginPath(); ctx.arc(0, 0, 16+ring*3, 0, Math.PI*2); ctx.stroke();
                    ctx.restore();
                }
                // Shimmer particles
                for (let i = 0; i < 6; i++) {
                    const px = center + Math.cos(dmT*0.7+i*1.05)*22;
                    const py = oy+h*0.5 + Math.sin(dmT+i*1.05)*14;
                    ctx.save(); ctx.globalAlpha = Math.abs(Math.sin(dmT*1.3+i))*0.7;
                    ctx.fillStyle = colors.highlight;
                    ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI*2); ctx.fill();
                    ctx.restore();
                }
                break;
            }
            case "whale_fin": {
                // Large dorsal fin (top)
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-2,top+2); ctx.bezierCurveTo(center-14,top-10,center-16,top-24,center-8,top-30); ctx.bezierCurveTo(center-2,top-22,center+4,top-10,center+2,top+2); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-1,top+2); ctx.bezierCurveTo(center-12,top-9,center-14,top-22,center-8,top-26); ctx.bezierCurveTo(center-2,top-19,center+2,top-9,center+1,top+2); ctx.closePath(); ctx.fill();
                // Stars on body (whale in space)
                ctx.save();
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                const whaleStars = [[8,10],[18,8],[14,20],[6,22],[22,16]];
                for (const [sx,sy] of whaleStars) {
                    ctx.fillStyle = "#c0e0ff";
                    ctx.beginPath(); ctx.arc(ox+sx,oy+sy, 1.5, 0, Math.PI*2); ctx.fill();
                }
                ctx.restore();
                // Tail flukes (bottom)
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-6,oy+h); ctx.bezierCurveTo(center-16,oy+h+8,center-20,oy+h+16,center-14,oy+h+18); ctx.bezierCurveTo(center-8,oy+h+20,center-4,oy+h+8,center,oy+h+6); ctx.bezierCurveTo(center+4,oy+h+8,center+8,oy+h+20,center+14,oy+h+18); ctx.bezierCurveTo(center+20,oy+h+16,center+16,oy+h+8,center+6,oy+h); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-5,oy+h); ctx.bezierCurveTo(center-14,oy+h+6,center-18,oy+h+14,center-13,oy+h+16); ctx.bezierCurveTo(center-8,oy+h+18,center-4,oy+h+7,center,oy+h+5); ctx.bezierCurveTo(center+4,oy+h+7,center+8,oy+h+18,center+13,oy+h+16); ctx.bezierCurveTo(center+18,oy+h+14,center+14,oy+h+6,center+5,oy+h); ctx.closePath(); ctx.fill();
                break;
            }
            case "star_map": {
                // Constellation dots and lines
                ctx.save();
                makeGumdropPath(ctx, 1, 1, w-2, h-2); ctx.clip();
                const constStars: [number,number][] = [[6,6],[14,4],[22,8],[18,16],[12,22],[5,18],[20,24],[9,12]];
                const constLines: [number,number][] = [[0,1],[1,2],[2,3],[3,4],[4,5],[3,6],[5,7],[0,7]];
                // Lines first
                ctx.strokeStyle = "rgba(255,200,60,0.35)"; ctx.lineWidth = 0.8;
                for (const [a,b] of constLines) {
                    ctx.beginPath();
                    ctx.moveTo(ox+constStars[a][0], oy+constStars[a][1]);
                    ctx.lineTo(ox+constStars[b][0], oy+constStars[b][1]);
                    ctx.stroke();
                }
                // Star dots
                const cstT = Date.now()*0.002;
                for (let i = 0; i < constStars.length; i++) {
                    const blink = Math.abs(Math.sin(cstT+i*0.8))*0.5+0.5;
                    ctx.globalAlpha = blink;
                    ctx.fillStyle = "#ffd060";
                    ctx.beginPath(); ctx.arc(ox+constStars[i][0], oy+constStars[i][1], 1.5+blink*0.8, 0, Math.PI*2); ctx.fill();
                }
                ctx.restore();
                break;
            }
            case "quasar_jet": {
                // Blazing energy jet (horizontal)
                const qT = Date.now()*0.005;
                for (let side = -1; side <= 1; side += 2) {
                    for (let i = 0; i < 5; i++) {
                        const jlen = 14 + i*5 + Math.sin(qT+i)*3;
                        const jx = center + side*(14+i*5);
                        const jy = oy+h*0.5 + Math.sin(qT*1.4+i)*2*side;
                        ctx.save();
                        ctx.globalAlpha = (1-i/5)*0.82;
                        const jetCols = ["#ffffff","#ffe860","#ffb020","#ff6000","rgba(255,80,0,0)"];
                        ctx.fillStyle = jetCols[Math.min(i,4)];
                        ctx.beginPath(); ctx.ellipse(jx, jy, 4, 2-i*0.3, 0, 0, Math.PI*2); ctx.fill();
                        ctx.restore();
                    }
                }
                // Core blaze
                ctx.save();
                ctx.shadowColor = "#ffe860"; ctx.shadowBlur = 18;
                const coreGrd = ctx.createRadialGradient(center,oy+h*0.5,0,center,oy+h*0.5,10);
                coreGrd.addColorStop(0, "#ffffff"); coreGrd.addColorStop(0.5, "#ffe860"); coreGrd.addColorStop(1, "rgba(255,160,0,0)");
                ctx.fillStyle = coreGrd;
                ctx.beginPath(); ctx.arc(center, oy+h*0.5, 10, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur=0; ctx.restore();
                break;
            }


        default:
            matched = false;
    }
    return matched;
}
