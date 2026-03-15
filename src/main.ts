import { Game } from "./Game.js";

window.addEventListener("DOMContentLoaded", () => {
    const game = new Game("gameCanvas");
    
    // 시작 버튼
    const startButton = document.getElementById("start-button");
    if (startButton) {
        startButton.addEventListener("click", () => {
            game.start();
        });
    }

    // 상점 버튼
    const shopButton = document.getElementById("shop-button");
    if (shopButton) {
        shopButton.addEventListener("click", () => {
            game.openShop();
        });
    }

    // 상점 닫기 버튼
    const closeShopButton = document.getElementById("btn-close-shop");
    if (closeShopButton) {
        closeShopButton.addEventListener("click", () => {
            game.closeShop();
        });
    }

    // 스킨 캐러셀 버튼들
    const prevBtn = document.getElementById("prev-skin");
    const nextBtn = document.getElementById("next-skin");
    if (prevBtn) prevBtn.addEventListener("click", () => game.prevSkin());
    if (nextBtn) nextBtn.addEventListener("click", () => game.nextSkin());

    // 일시정지 버튼
    const pauseButton = document.getElementById("pause-button");
    if (pauseButton) {
        pauseButton.addEventListener("click", () => {
            game.togglePause();
        });
    }

    // 재개 버튼
    const resumeButton = document.getElementById("resume-button");
    if (resumeButton) {
        resumeButton.addEventListener("click", () => {
            game.togglePause();
        });
    }

    // TRY AGAIN 버튼 (게임 오버 화면 -> 즉시 재시작)
    const tryAgainButton = document.getElementById("try-again-button");
    if (tryAgainButton) {
        tryAgainButton.addEventListener("click", () => {
            game.reset();
        });
    }

    // 메인 메뉴 버튼 (게임 오버 화면 -> 메인 메뉴로)
    const restartButton = document.getElementById("restart-button");
    if (restartButton) {
        restartButton.addEventListener("click", () => {
            game.goToMainMenu();
        });
    }

    // 재시작 버튼 (일시정지 화면 -> 초기화 후 즉시 시작)
    const restartButtonPause = document.getElementById("restart-button-pause");
    if (restartButtonPause) {
        restartButtonPause.addEventListener("click", () => {
            game.reset();
        });
    }

    // 키보드 이벤트
    window.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        
        // P 키로 일시정지
        if (key === "p") {
            game.togglePause();
        }

        // 스페이스바로 시작 및 재시작
        if (e.code === "Space") {
            // 키를 꾹 누르고 있는 상태(repeat)라면 무시
            if (e.repeat) return;
            
            // 기본 스크롤 동작 방지
            e.preventDefault();

            if (!game.isStarted) {
                game.start();
            } 
            else if (game.isGameOver) {
                game.reset();
            }
        }
    });

    // 모바일 터치 대응 (시작 화면 클릭 시에도 시작되게)
    const startScreen = document.getElementById("start-screen");
    if (startScreen) {
        startScreen.addEventListener("touchstart", (e) => {
            // 버튼 클릭과 중복되지 않도록 처리
            if ((e.target as HTMLElement).id === "start-button") return;
            
            e.preventDefault();
            game.start();
        }, false);
    }
});
