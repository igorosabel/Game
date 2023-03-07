import { AssetCache } from 'src/app/play/asset-cache.class';
import { PlayCanvas } from 'src/app/play/play-canvas.class';

export class PlayHud {
  health: number;
  currentHealth: number;
  money: number;
  canvas: PlayCanvas;
  assets: AssetCache;

  constructor(
    health: number,
    currentHealth: number,
    money: number,
    canvas: PlayCanvas,
    assets: AssetCache
  ) {
    this.health = health;
    this.currentHealth = currentHealth;
    this.money = money;
    this.canvas = canvas;
    this.assets = assets;
  }

  render(): void {
    const ctx: CanvasRenderingContext2D = this.canvas.ctx;
    const posY = 20;

    // Money
    ctx.drawImage(this.assets.get('/assets/hud/money.png'), 10, posY, 8, 10);
    ctx.font = "18px 'PressStart'";
    ctx.fillStyle = '#fff';
    ctx.fillText(this.money.toString(), 25, 32);

    // Health
    const hearts: number = this.health / 20;
    const posX = 60;
    for (let i: number = 0; i < hearts; i++) {
      ctx.drawImage(
        this.assets.get('/assets/hud/heart_full.png'),
        posX + i * 20,
        posY,
        14,
        13
      );
    }
  }
}
