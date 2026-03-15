import { FeatureCtx, makeGumdropPath, drawRoundedRect, drawPixelRect } from "./FeatureContext.js";

export function tryOriginalFeatures(fc: FeatureCtx): boolean {
    const { ctx, ox, oy, w, h, center, top, moveDir, colors } = fc;
    let matched = true;
    switch (fc.feature) {
            case "greenie": {
                // --- 미소 ---
                ctx.strokeStyle = "rgba(0,0,0,0.75)";
                ctx.lineWidth = 1.5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.arc(center, oy + h * 0.65, 4, 0.15, Math.PI - 0.15);
                ctx.stroke();

                // --- 볼터치 (blush) ---
                ctx.fillStyle = "rgba(255, 120, 120, 0.45)";
                ctx.beginPath();
                ctx.ellipse(center - 8, oy + h * 0.62, 3.5, 2.0, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(center + 8, oy + h * 0.62, 3.5, 2.0, 0, 0, Math.PI * 2);
                ctx.fill();

                // --- 왕관 (crown) ---
                const cw = 20, cx0 = center - 10, cyBase = top - 1;
                // 외곽선 (갈색)
                ctx.fillStyle = "#7B4500";
                ctx.beginPath();
                ctx.moveTo(cx0 - 1,     cyBase + 6);
                ctx.lineTo(cx0 - 1,     cyBase - 1);
                ctx.lineTo(cx0 + 3,     cyBase - 8);
                ctx.lineTo(cx0 + 7,     cyBase - 1);
                ctx.lineTo(cx0 + cw/2 - 2, cyBase - 1);
                ctx.lineTo(cx0 + cw/2,  cyBase - 14);
                ctx.lineTo(cx0 + cw/2 + 2, cyBase - 1);
                ctx.lineTo(cx0 + cw - 7, cyBase - 1);
                ctx.lineTo(cx0 + cw - 3, cyBase - 8);
                ctx.lineTo(cx0 + cw + 1, cyBase - 1);
                ctx.lineTo(cx0 + cw + 1, cyBase + 6);
                ctx.closePath();
                ctx.fill();

                // 금색 채우기
                ctx.fillStyle = "#F5C518";
                ctx.beginPath();
                ctx.moveTo(cx0,      cyBase + 5);
                ctx.lineTo(cx0,      cyBase);
                ctx.lineTo(cx0 + 3,  cyBase - 7);
                ctx.lineTo(cx0 + 7,  cyBase);
                ctx.lineTo(cx0 + cw/2 - 1, cyBase);
                ctx.lineTo(cx0 + cw/2, cyBase - 12);
                ctx.lineTo(cx0 + cw/2 + 1, cyBase);
                ctx.lineTo(cx0 + cw - 7, cyBase);
                ctx.lineTo(cx0 + cw - 3, cyBase - 7);
                ctx.lineTo(cx0 + cw,  cyBase);
                ctx.lineTo(cx0 + cw,  cyBase + 5);
                ctx.closePath();
                ctx.fill();

                // 하이라이트 (연한 금)
                ctx.fillStyle = "rgba(255,235,100,0.6)";
                ctx.fillRect(cx0 + 2, cyBase + 1, cw - 4, 2);

                // 에메랄드 젬 (다이아몬드 형태)
                const gx = cx0 + cw / 2, gy = cyBase - 9;
                ctx.fillStyle = "#1B7A3E";
                ctx.beginPath();
                ctx.moveTo(gx, gy - 3); ctx.lineTo(gx + 2.5, gy);
                ctx.lineTo(gx, gy + 2.5); ctx.lineTo(gx - 2.5, gy);
                ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#4ADE80";
                ctx.beginPath();
                ctx.moveTo(gx - 1, gy - 2.5); ctx.lineTo(gx + 0.5, gy - 0.5);
                ctx.lineTo(gx - 1, gy - 0.5); ctx.closePath(); ctx.fill();
                break;
            }
            case "basketball":
                ctx.fillStyle = "#e67e22";
                ctx.beginPath(); ctx.arc(center + 14, oy + h - 12, 7, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.stroke();
                break;
            case "boxing_gloves":
                ctx.fillStyle = "#ff4757";
                drawRoundedRect(ctx, center - 18, oy + h/2, 10, 10, 4); // Left
                drawRoundedRect(ctx, center + 8, oy + h/2, 10, 10, 4);  // Right
                break;
            case "tennis_racket":
                ctx.strokeStyle = "#ced6e0"; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.ellipse(center + 15, oy + h/2, 6, 8, 0, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center + 15, oy + h/2 + 8); ctx.lineTo(center + 15, oy + h/2 + 15); ctx.stroke();
                break;
            case "golf_cap":
                ctx.fillStyle = "#f1f2f6";
                drawRoundedRect(ctx, center - 11, top - 4, 22, 8, 3);
                ctx.fillRect(center + (moveDir >= 0 ? 2 : -18), top + 1, 16, 3); // 챙
                break;
            case "goggles":
                ctx.fillStyle = "#2f3542";
                drawRoundedRect(ctx, center - 12, oy + h * 0.45, 24, 8, 2);
                ctx.fillStyle = "#70a1ff";
                ctx.fillRect(center - 10, oy + h * 0.45 + 2, 8, 4);
                ctx.fillRect(center + 2, oy + h * 0.45 + 2, 8, 4);
                break;
            case "black_belt":
                ctx.fillStyle = "#000";
                ctx.fillRect(ox, oy + h - 10, w, 4);
                ctx.fillRect(center - 2, oy + h - 10, 4, 10); // 매듭
                break;
            case "skate_helmet":
                ctx.fillStyle = "#ffa502";
                drawRoundedRect(ctx, center - 13, top - 6, 26, 14, 10);
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                ctx.beginPath(); ctx.arc(center - 6, top, 2, 0, Math.PI*2); ctx.fill(); // 구멍
                ctx.beginPath(); ctx.arc(center + 6, top, 2, 0, Math.PI*2); ctx.fill();
                break;
            case "fencing_mask":
                ctx.fillStyle = "rgba(47, 53, 66, 0.8)";
                drawRoundedRect(ctx, center - 10, oy + h*0.3, 20, 18, 5);
                ctx.strokeStyle = "#dfe4ea"; ctx.lineWidth = 0.5;
                for(let i=-8; i<10; i+=3) { ctx.beginPath(); ctx.moveTo(center+i, oy+h*0.3); ctx.lineTo(center+i, oy+h*0.3+18); ctx.stroke(); }
                break;
            case "weight_belt":
                ctx.fillStyle = "#747d8c";
                ctx.fillRect(ox, oy + h - 12, w, 6);
                ctx.fillStyle = "#ffa502"; // 버클
                ctx.fillRect(center - 4, oy + h - 13, 8, 8);
                break;
            case "bike_helmet":
                ctx.fillStyle = "#1e90ff";
                ctx.beginPath(); ctx.moveTo(center - 14, top + 5); ctx.quadraticCurveTo(center, top - 15, center + 14, top + 5); ctx.fill();
                ctx.fillStyle = "#2f3542"; ctx.fillRect(center - 14, top + 3, 28, 3); // 바이저
                break;
            case "ski_goggles":
                ctx.fillStyle = "#ff4757";
                drawRoundedRect(ctx, center - 14, oy + h * 0.4, 28, 10, 4);
                ctx.fillStyle = "#2f3542"; // 렌즈
                drawRoundedRect(ctx, center - 12, oy + h * 0.4 + 2, 24, 6, 2);
                break;
            case "catcher_mask":
                ctx.fillStyle = "#2f3542";
                drawRoundedRect(ctx, center - 12, oy + h*0.2, 24, 22, 4);
                ctx.strokeStyle = "#ced6e0"; ctx.lineWidth = 1;
                ctx.strokeRect(center - 10, oy + h*0.3, 20, 4); ctx.strokeRect(center - 10, oy + h*0.5, 20, 4);
                break;
            case "head_guard":
                ctx.fillStyle = "#ff4757";
                drawRoundedRect(ctx, center - 14, top - 4, 28, 20, 6);
                ctx.clearRect(center - 8, oy + h*0.4, 16, 12); // 얼굴 구멍
                break;
            case "quiver":
                ctx.fillStyle = "#795548";
                ctx.fillRect(ox - 6, oy + 5, 6, 20); // 화살통
                ctx.fillStyle = "#ced6e0"; ctx.fillRect(ox - 5, oy, 2, 5); // 화살 깃
                break;
            case "red_headband":
                ctx.fillStyle = "#ff4757";
                ctx.fillRect(center - 15, oy + h*0.3, 30, 4);
                const wave = Math.sin(Date.now() * 0.01) * 5;
                ctx.fillRect(ox + w, oy + h*0.3 + wave, 10, 3); // 펄럭임
                break;
            case "volleyball":
                ctx.fillStyle = "#fff";
                ctx.beginPath(); ctx.arc(center - 14, oy + h - 10, 6, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = "#1e90ff"; ctx.lineWidth = 1; ctx.stroke();
                break;
            case "scrum_cap":
                ctx.fillStyle = "#2f3542";
                drawRoundedRect(ctx, center - 13, top - 2, 26, 16, 8);
                ctx.strokeStyle = "#57606f"; ctx.lineWidth = 1;
                ctx.strokeRect(center - 11, top + 2, 22, 8); // 보강 패드
                break;
            case "hockey_mask":
                ctx.fillStyle = "#f1f2f6";
                drawRoundedRect(ctx, center - 11, oy + h*0.25, 22, 24, 4);
                ctx.fillStyle = "#2f3542";
                for(let i=0; i<3; i++) for(let j=0; j<3; j++) ctx.fillRect(center - 6 + i*5, oy + h*0.4 + j*5, 2, 2); // 숨구멍
                break;
            case "shuttlecock":
                ctx.fillStyle = "#fff";
                ctx.beginPath(); ctx.moveTo(center + 12, oy + h - 15); ctx.lineTo(center + 18, oy + h - 25); ctx.lineTo(center + 6, oy + h - 25); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#ff4757"; ctx.beginPath(); ctx.arc(center + 12, oy + h - 12, 3, 0, Math.PI*2); ctx.fill();
                break;
            case "surfboard":
                ctx.fillStyle = "#48dbfb";
                ctx.beginPath(); ctx.ellipse(ox + w/2, oy + h + 2, 20, 5, 0, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#00d2d3"; ctx.stroke();
                break;
            
            // --- 직업 테마 스킨 ---
            case "stethoscope":
                ctx.strokeStyle = "#ced6e0"; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(center, oy + h*0.6, 8, 0, Math.PI); ctx.stroke(); // 줄
                ctx.fillStyle = "#747d8c"; ctx.fillRect(center - 2, oy + h*0.8, 4, 4); // 끝부분
                break;
            case "fire_helmet":
                ctx.fillStyle = "#d63031";
                drawRoundedRect(ctx, center - 14, top - 6, 28, 14, 6);
                ctx.fillStyle = "#f9ca24"; ctx.fillRect(center - 4, top - 2, 8, 6); // 마크
                ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(center - 14, top + 4, 28, 3); // 챙
                break;
            case "lab_flask":
                ctx.fillStyle = "rgba(164, 176, 190, 0.6)";
                ctx.beginPath(); ctx.moveTo(center + 10, oy + h - 5); ctx.lineTo(center + 18, oy + h - 5); ctx.lineTo(center + 14, oy + h - 15); ctx.fill();
                ctx.fillStyle = "#2ed573"; ctx.fillRect(center + 13, oy + h - 8, 3, 3); // 액체
                break;
            case "space_helmet":
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                ctx.beginPath(); ctx.arc(center, oy + h*0.4, 18, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
                ctx.fillStyle = "rgba(112, 161, 255, 0.3)"; // 바이저 빛
                ctx.beginPath(); ctx.ellipse(center + 5, oy + h*0.3, 8, 4, Math.PI/4, 0, Math.PI*2); ctx.fill();
                break;
            case "hard_hat":
                ctx.fillStyle = "#ffa502";
                drawRoundedRect(ctx, center - 13, top - 5, 26, 12, 8);
                ctx.fillStyle = "#e67e22"; ctx.fillRect(center - 13, top + 3, 26, 3); // 챙
                break;
            case "straw_hat":
                ctx.fillStyle = "#f9ca24";
                drawRoundedRect(ctx, center - 18, top + 2, 36, 4, 2); // 챙
                drawRoundedRect(ctx, center - 10, top - 6, 20, 10, 4); // 머리부분
                ctx.fillStyle = "#d35400"; ctx.fillRect(center - 10, top + 1, 20, 2); // 띠
                break;
            case "beret":
                ctx.fillStyle = "#2f3542";
                ctx.beginPath(); ctx.ellipse(center, top + 2, 16, 6, -Math.PI/10, 0, Math.PI*2); ctx.fill();
                ctx.fillRect(center - 1, top - 4, 2, 4); // 꼭지
                break;
            case "necktie":
                ctx.fillStyle = "#ff4757";
                ctx.beginPath(); ctx.moveTo(center, oy + h*0.5); ctx.lineTo(center - 4, oy + h*0.7); ctx.lineTo(center, oy + h*0.9); ctx.lineTo(center + 4, oy + h*0.7); ctx.fill();
                break;
            case "wizard_hat":
                ctx.fillStyle = "#5f27cd";
                ctx.beginPath(); ctx.moveTo(center - 15, top + 5); ctx.lineTo(center, top - 25); ctx.lineTo(center + 15, top + 5); ctx.fill();
                ctx.fillStyle = "#feca57"; ctx.beginPath(); ctx.arc(center + 2, top - 10, 2, 0, Math.PI*2); ctx.fill(); // 별
                break;
            case "pilot_cap":
                ctx.fillStyle = "#1e272e";
                drawRoundedRect(ctx, center - 14, top - 4, 28, 10, 4);
                ctx.fillStyle = "#f9ca24"; ctx.beginPath(); ctx.arc(center, top, 3, 0, Math.PI*2); ctx.fill(); // 배지
                break;
            case "judge_wig":
                ctx.fillStyle = "#f1f2f6";
                for(let i=-12; i<=12; i+=6) { ctx.beginPath(); ctx.arc(center+i, top+2, 6, 0, Math.PI*2); ctx.fill(); }
                drawRoundedRect(ctx, center - 12, top - 4, 24, 8, 6);
                break;
            case "miner_hat":
                ctx.fillStyle = "#747d8c";
                drawRoundedRect(ctx, center - 12, top - 4, 24, 10, 4);
                const beamFlash = Math.floor(Date.now() / 500) % 2 === 0;
                ctx.fillStyle = beamFlash ? "#fff200" : "#f1c40f";
                ctx.shadowBlur = beamFlash ? 15 : 0; ctx.shadowColor = "#fff200";
                ctx.beginPath(); ctx.arc(center, top + 1, 4, 0, Math.PI*2); ctx.fill();
                break;
            case "detective_hat":
                ctx.fillStyle = "#795548";
                drawRoundedRect(ctx, center - 14, top - 2, 28, 8, 4); // 챙
                drawRoundedRect(ctx, center - 10, top - 10, 20, 12, 6);
                break;
            case "sailor_cap":
                ctx.fillStyle = "#fff";
                drawRoundedRect(ctx, center - 10, top - 6, 20, 10, 2);
                ctx.fillStyle = "#1e90ff"; ctx.fillRect(center - 10, top + 1, 20, 3); // 파란 띠
                break;
            case "nurse_cap":
                ctx.fillStyle = "#fff";
                ctx.beginPath(); ctx.moveTo(center - 8, top + 4); ctx.lineTo(center, top - 6); ctx.lineTo(center + 8, top + 4); ctx.fill();
                ctx.fillStyle = "#ff4757"; ctx.fillRect(center - 1, top - 1, 2, 5); ctx.fillRect(center - 3, top + 1, 6, 2); // 십자가
                break;
            case "grad_cap":
                ctx.fillStyle = "#2f3542";
                ctx.beginPath(); ctx.moveTo(center, top + 2); ctx.lineTo(center - 16, top - 4); ctx.lineTo(center, top - 10); ctx.lineTo(center + 16, top - 4); ctx.fill();
                ctx.strokeStyle = "#feca57"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(center + 14, top - 4); ctx.lineTo(center + 14, top + 6); ctx.stroke(); // 수슬
                break;
            case "cowboy_hat":
                ctx.fillStyle = "#795548";
                ctx.beginPath(); ctx.ellipse(center, top + 4, 20, 6, 0, 0, Math.PI*2); ctx.fill();
                drawRoundedRect(ctx, center - 8, top - 8, 16, 12, 4);
                break;
            case "wrench":
                ctx.strokeStyle = "#747d8c"; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(center + 14, oy + h - 5); ctx.lineTo(center + 14, oy + h - 20); ctx.stroke();
                ctx.beginPath(); ctx.arc(center + 14, oy + h - 22, 4, Math.PI/4, Math.PI*1.75); ctx.stroke();
                break;
            case "glasses":
                ctx.strokeStyle = "#2f3542"; ctx.lineWidth = 1.5;
                ctx.strokeRect(center - 9, oy + h*0.45, 7, 6);
                ctx.strokeRect(center + 2, oy + h*0.45, 7, 6);
                ctx.beginPath(); ctx.moveTo(center - 2, oy + h*0.5); ctx.lineTo(center + 2, oy + h*0.5); ctx.stroke();
                break;
            case "scuba_mask":
                ctx.fillStyle = "rgba(72, 219, 251, 0.4)";
                drawRoundedRect(ctx, center - 12, oy + h*0.35, 24, 14, 4);
                ctx.strokeStyle = "#01a3a4"; ctx.lineWidth = 2; ctx.strokeRect(center - 12, oy + h*0.35, 24, 14);
                ctx.fillStyle = "#2f3542"; ctx.fillRect(center + 12, oy + h*0.3, 4, 15); // 스노클
                break;

            // ===== 동물 테마 스킨 =====
            case "cat_ears": {
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-14,top+3); ctx.lineTo(center-10,top-13); ctx.lineTo(center-3,top+1); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+14,top+3); ctx.lineTo(center+10,top-13); ctx.lineTo(center+3,top+1);  ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#ffb7c5";
                ctx.beginPath(); ctx.moveTo(center-13,top+2); ctx.lineTo(center-10,top-8); ctx.lineTo(center-5,top+0); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+13,top+2); ctx.lineTo(center+10,top-8); ctx.lineTo(center+5,top+0);  ctx.closePath(); ctx.fill();
                break;
            }
            case "dog_ears": {
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-10,top+3); ctx.bezierCurveTo(center-20,top-2,center-23,top+16,center-16,top+25); ctx.bezierCurveTo(center-11,top+23,center-9,top+14,center-9,top+5); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+10,top+3); ctx.bezierCurveTo(center+20,top-2,center+23,top+16,center+16,top+25); ctx.bezierCurveTo(center+11,top+23,center+9,top+14,center+9,top+5); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-10,top+4); ctx.bezierCurveTo(center-17,top+1,center-19,top+14,center-13,top+22); ctx.bezierCurveTo(center-10,top+20,center-9,top+13,center-9,top+6); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+10,top+4); ctx.bezierCurveTo(center+17,top+1,center+19,top+14,center+13,top+22); ctx.bezierCurveTo(center+10,top+20,center+9,top+13,center+9,top+6); ctx.closePath(); ctx.fill();
                break;
            }
            case "bunny_ears": {
                ctx.fillStyle = colors.main;
                drawRoundedRect(ctx, center-13, top-22, 7, 22, 3);
                drawRoundedRect(ctx, center+6,  top-22, 7, 22, 3);
                ctx.fillStyle = "#ffb7c5";
                ctx.fillRect(center-11, top-20, 3, 15);
                ctx.fillRect(center+8,  top-20, 3, 15);
                break;
            }
            case "frog_eyes": {
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center-9, top-2, 7, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+9, top-2, 7, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#111";
                ctx.beginPath(); ctx.arc(center-9, top-3, 4.5, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+9, top-3, 4.5, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.beginPath(); ctx.arc(center-11, top-5, 1.8, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+7,  top-5, 1.8, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "bee_wings": {
                ctx.fillStyle = "rgba(210,238,255,0.65)";
                ctx.strokeStyle = "rgba(100,180,255,0.45)"; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.ellipse(center-18,top+9, 12,7, -0.4,0,Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.ellipse(center-16,top+20, 8,5, -0.3,0,Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.ellipse(center+18,top+9, 12,7,  0.4,0,Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.ellipse(center+16,top+20, 8,5,  0.3,0,Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.save();
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                ctx.fillStyle = "rgba(20,10,0,0.4)";
                ctx.fillRect(0,8,w,4); ctx.fillRect(0,17,w,4); ctx.fillRect(0,26,w,4);
                ctx.restore();
                break;
            }
            case "penguin_bow": {
                ctx.fillStyle = "rgba(255,255,255,0.55)";
                ctx.beginPath(); ctx.ellipse(center, oy+h*0.66, 5, 8, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = "#ff4757";
                ctx.beginPath(); ctx.moveTo(center,oy+h*0.42); ctx.bezierCurveTo(center-9,oy+h*0.34,center-11,oy+h*0.47,center-5,oy+h*0.51); ctx.bezierCurveTo(center-2,oy+h*0.52,center,oy+h*0.46,center,oy+h*0.42); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center,oy+h*0.42); ctx.bezierCurveTo(center+9,oy+h*0.34,center+11,oy+h*0.47,center+5,oy+h*0.51); ctx.bezierCurveTo(center+2,oy+h*0.52,center,oy+h*0.46,center,oy+h*0.42); ctx.fill();
                ctx.fillStyle = "#c0392b"; ctx.beginPath(); ctx.arc(center, oy+h*0.44, 2.5, 0, Math.PI*2); ctx.fill();
                break;
            }
            case "fox_ears": {
                ctx.fillStyle = "#fff5ee";
                ctx.beginPath(); ctx.moveTo(center-15,top+3); ctx.lineTo(center-10,top-16); ctx.lineTo(center-3,top+1); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+15,top+3); ctx.lineTo(center+10,top-16); ctx.lineTo(center+3,top+1); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-14,top+3); ctx.lineTo(center-10,top-9); ctx.lineTo(center-4,top+1); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+14,top+3); ctx.lineTo(center+10,top-9); ctx.lineTo(center+4,top+1); ctx.closePath(); ctx.fill();
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-12,top+2); ctx.lineTo(center-10,top-5); ctx.lineTo(center-6,top+1); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+12,top+2); ctx.lineTo(center+10,top-5); ctx.lineTo(center+6,top+1); ctx.closePath(); ctx.fill();
                break;
            }
            case "duck_bill": {
                ctx.fillStyle = "#ff9500";
                ctx.beginPath();
                ctx.moveTo(center-9,oy+h*0.5); ctx.bezierCurveTo(center-12,oy+h*0.4,center-13,oy+h*0.62,center-8,oy+h*0.67);
                ctx.lineTo(center+8,oy+h*0.67); ctx.bezierCurveTo(center+13,oy+h*0.62,center+12,oy+h*0.4,center+9,oy+h*0.5);
                ctx.closePath(); ctx.fill();
                ctx.strokeStyle = "#c86000"; ctx.lineWidth = 1; ctx.stroke();
                ctx.fillStyle = "#c86000";
                ctx.beginPath(); ctx.arc(center-3,oy+h*0.54,1.5,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+3,oy+h*0.54,1.5,0,Math.PI*2); ctx.fill();
                break;
            }
            case "bear_ears": {
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center-11,top-1,6,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+11,top-1,6,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.arc(center-11,top-1,4,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+11,top-1,4,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#c97870";
                ctx.beginPath(); ctx.arc(center-11,top-1,2,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+11,top-1,2,0,Math.PI*2); ctx.fill();
                break;
            }
            case "owl_beak": {
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.moveTo(center-8,top+2); ctx.lineTo(center-10,top-10); ctx.lineTo(center-3,top-4); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+8,top+2); ctx.lineTo(center+10,top-10); ctx.lineTo(center+3,top-4); ctx.closePath(); ctx.fill();
                ctx.fillStyle = "#f9a825";
                ctx.beginPath(); ctx.moveTo(center-4,oy+h*0.52); ctx.lineTo(center,oy+h*0.65); ctx.lineTo(center+4,oy+h*0.52); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = "#c07000"; ctx.lineWidth = 0.8; ctx.stroke();
                break;
            }
            case "panda_ears": {
                ctx.fillStyle = "#2f3542";
                ctx.beginPath(); ctx.arc(center-11,top-1,7,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(center+11,top-1,7,0,Math.PI*2); ctx.fill();
                ctx.save(); ctx.globalAlpha = 0.8;
                ctx.beginPath(); ctx.ellipse(center-6,oy+h*0.47,5,4.5,-0.3,0,Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(center+6,oy+h*0.47,5,4.5, 0.3,0,Math.PI*2); ctx.fill();
                ctx.restore();
                break;
            }
            case "shark_fin": {
                ctx.fillStyle = colors.main;
                ctx.beginPath(); ctx.moveTo(center-5,top+2); ctx.lineTo(center-1,top-20); ctx.lineTo(center+9,top+2); ctx.closePath(); ctx.fill();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1.2; ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+12,oy+h*0.5); ctx.lineTo(center+18,oy+h*0.38); ctx.lineTo(center+18,oy+h*0.56); ctx.closePath(); ctx.fill(); ctx.stroke();
                break;
            }
            case "axolotl_gills": {
                const gillBase = "#ff8fa3", gillTip = "#ff4757";
                for (let side = -1; side <= 1; side += 2) {
                    for (let i = 0; i < 3; i++) {
                        const a = (i - 1) * 0.4;
                        const len = 13 - i * 2;
                        const bx = center + side * 14;
                        ctx.strokeStyle = gillBase; ctx.lineWidth = 3.5; ctx.lineCap = "round";
                        ctx.beginPath(); ctx.moveTo(bx, top+6); ctx.quadraticCurveTo(bx+side*5, top+6-len*0.5, bx+side*2+Math.sin(a)*5, top+6-len); ctx.stroke();
                        ctx.fillStyle = gillTip; ctx.beginPath(); ctx.arc(bx+side*2+Math.sin(a)*5, top+6-len, 2.5, 0, Math.PI*2); ctx.fill();
                    }
                }
                break;
            }
            case "octopus_tentacles": {
                const t = Date.now() * 0.002;
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 3; ctx.lineCap = "round";
                for (let i = 0; i < 4; i++) {
                    const sx = center - 13 + i * 9;
                    const wave = Math.sin(t + i * 0.9) * 5;
                    ctx.beginPath(); ctx.moveTo(sx, oy+h-2); ctx.quadraticCurveTo(sx+wave, oy+h+9, sx+wave*0.5, oy+h+17); ctx.stroke();
                }
                ctx.fillStyle = "rgba(255,255,255,0.38)";
                for (let i = 0; i < 4; i++) {
                    const sx = center - 13 + i * 9;
                    ctx.beginPath(); ctx.arc(sx, oy+h+6,  1.8, 0, Math.PI*2); ctx.fill();
                    ctx.beginPath(); ctx.arc(sx, oy+h+13, 1.8, 0, Math.PI*2); ctx.fill();
                }
                break;
            }
            case "lion_mane": {
                ctx.fillStyle = colors.outline;
                for (let i = 0; i < 12; i++) {
                    const a = (i/12)*Math.PI*2 - Math.PI/2;
                    ctx.beginPath(); ctx.arc(center+Math.cos(a)*19, oy+h/2+Math.sin(a)*21, 6, 0, Math.PI*2); ctx.fill();
                }
                ctx.fillStyle = colors.main;
                for (let i = 0; i < 12; i++) {
                    const a = (i/12)*Math.PI*2 - Math.PI/2 + Math.PI/12;
                    ctx.beginPath(); ctx.arc(center+Math.cos(a)*17, oy+h/2+Math.sin(a)*19, 4.5, 0, Math.PI*2); ctx.fill();
                }
                break;
            }
            case "butterfly_wings": {
                const flap = Math.sin(Date.now()*0.005) * 0.12;
                ctx.save(); ctx.globalAlpha = 0.88;
                ctx.fillStyle = "#ff7675";
                ctx.beginPath(); ctx.ellipse(center-19,oy+h*0.33, 14+flap*5,10, -0.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#fdcb6e";
                ctx.beginPath(); ctx.ellipse(center-18,oy+h*0.31, 8,6, -0.4,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#e17055";
                ctx.beginPath(); ctx.ellipse(center-17,oy+h*0.65, 11,8, 0.45,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#ff7675";
                ctx.beginPath(); ctx.ellipse(center+19,oy+h*0.33, 14+flap*5,10, 0.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#fdcb6e";
                ctx.beginPath(); ctx.ellipse(center+18,oy+h*0.31, 8,6, 0.4,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#e17055";
                ctx.beginPath(); ctx.ellipse(center+17,oy+h*0.65, 11,8, -0.45,0,Math.PI*2); ctx.fill();
                ctx.strokeStyle = "rgba(0,0,0,0.22)"; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.moveTo(center-4,oy+h*0.38); ctx.lineTo(center-28,oy+h*0.28); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(center+4,oy+h*0.38); ctx.lineTo(center+28,oy+h*0.28); ctx.stroke();
                ctx.restore();
                break;
            }
            case "tiger_stripes": {
                ctx.save();
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                ctx.fillStyle = "rgba(0,0,0,0.38)";
                ctx.save(); ctx.translate(center, h/2); ctx.rotate(0.38);
                ctx.fillRect(-2,-16,4,10); ctx.fillRect( 7,-14,3, 9); ctx.fillRect(-11,-14,3, 9);
                ctx.fillRect(-2,  4,4,10); ctx.fillRect( 7,  4,3, 9); ctx.fillRect(-11,  4,3, 9);
                ctx.restore(); ctx.restore();
                break;
            }
            case "chameleon_eye": {
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center-5,oy+h*0.37,11,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#f1c40f";
                ctx.beginPath(); ctx.arc(center-5,oy+h*0.37,8.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center-4,oy+h*0.39,5.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#111";
                ctx.beginPath(); ctx.arc(center-4,oy+h*0.39,3.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.beginPath(); ctx.arc(center-6,oy+h*0.34,1.6,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = colors.outline;
                ctx.beginPath(); ctx.arc(center+7,oy+h*0.43,5.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#f1c40f";
                ctx.beginPath(); ctx.arc(center+7,oy+h*0.43,3.5,0,Math.PI*2); ctx.fill();
                ctx.fillStyle = "#111";
                ctx.beginPath(); ctx.arc(center+7.5,oy+h*0.44,2.2,0,Math.PI*2); ctx.fill();
                break;
            }
            case "elephant_trunk": {
                const trunkWave = Math.sin(Date.now()*0.0018)*4;
                ctx.strokeStyle = colors.main; ctx.lineWidth = 6; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(center,oy+h*0.55); ctx.bezierCurveTo(center-4,oy+h*0.8, center+trunkWave,oy+h+6, center-8+trunkWave,oy+h+3); ctx.stroke();
                ctx.strokeStyle = colors.outline; ctx.lineWidth = 1.5; ctx.stroke();
                ctx.fillStyle = "#fffff0";
                ctx.beginPath(); ctx.moveTo(center-8,oy+h*0.6); ctx.lineTo(center-15,oy+h*0.76); ctx.lineTo(center-10,oy+h*0.6); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(center+5,oy+h*0.6);  ctx.lineTo(center+12,oy+h*0.76); ctx.lineTo(center+7,oy+h*0.6);  ctx.closePath(); ctx.fill();
                break;
            }
            case "crow_feathers": {
                for (let i = 0; i < 5; i++) {
                    const fx = center - 8 + i * 4;
                    const fh = [6,10,14,10,6][i];
                    ctx.fillStyle = i % 2 === 0 ? "#1a1a2e" : "#4a4a6e";
                    ctx.beginPath(); ctx.moveTo(fx-2,top+2); ctx.lineTo(fx,top-fh); ctx.lineTo(fx+2,top+2); ctx.closePath(); ctx.fill();
                }
                const shimmer = (Math.sin(Date.now()*0.003)+1)*0.5;
                ctx.save(); ctx.globalAlpha = shimmer * 0.28;
                ctx.fillStyle = "#74b9ff";
                makeGumdropPath(ctx, 2, 2, w-4, h-4); ctx.clip();
                ctx.fillRect(0,0,w,h*0.45);
                ctx.restore();
                break;
            }

        default:
            matched = false;
    }
    return matched;
}
