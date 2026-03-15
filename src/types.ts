export interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    draw(ctx: CanvasRenderingContext2D): void;
    update(canvasWidth?: number, canvasHeight?: number): void;
}

export enum PlatformType {
    NORMAL,
    MOVING,
    FRAGILE,
    SPRING,
    FOG
}

export enum Biome {
    FOREST,
    SKY,
    SPACE
}

export enum SceneType {
    START,
    SHOP,
    PLAYING,
    PAUSE,
    GAMEOVER
}

export interface SkinData {
    id: string;
    name: string;
    unlockDistance: number;
    lore: string;
    feature?: string;
    colors: {
        main: string;
        outline: string;
        highlight: string;
    };
}

export interface SkinColors {
    main: string;
    outline: string;
    highlight: string;
}

export interface GameSettings {
    GRAVITY: number;
    JUMP_STRENGTH: number;
    PLAYER_SPEED: number;
    PLATFORM_SPEED: number;
    PLATFORM_SPAWN_INTERVAL: number;
    LAVA_SPEED: number;
    LAVA_DELAY_FRAMES: number;
    PLATFORM_SPRING_STRENGTH: number;
}
