import { SceneType } from "./types.js";

export class SceneManager {
    private scenes: Map<SceneType, HTMLElement> = new Map();
    private currentScene: SceneType = SceneType.START;

    constructor() {
        // HTML 요소 매핑
        const start = document.getElementById("start-screen");
        const shop = document.getElementById("shop-screen");
        const pause = document.getElementById("pause-screen");
        const gameover = document.getElementById("game-over-screen");

        if (start) this.scenes.set(SceneType.START, start);
        if (shop) this.scenes.set(SceneType.SHOP, shop);
        if (pause) this.scenes.set(SceneType.PAUSE, pause);
        if (gameover) this.scenes.set(SceneType.GAMEOVER, gameover);
    }

    public changeScene(type: SceneType): void {
        // 모든 씬 숨기기
        this.scenes.forEach((el) => {
            el.classList.add("hidden");
        });

        // 대상 씬 보이기
        const target = this.scenes.get(type);
        if (target) {
            target.classList.remove("hidden");
        }

        this.currentScene = type;
    }

    public getCurrentScene(): SceneType {
        return this.currentScene;
    }

    public is(type: SceneType): boolean {
        return this.currentScene === type;
    }
}
