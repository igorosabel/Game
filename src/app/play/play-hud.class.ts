import AssetCache from '@play/asset-cache.class';
import PlayCanvas from '@play/play-canvas.class';

export default class PlayHud {
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
    assets: AssetCache,
  ) {
    this.health = health;
    this.currentHealth = currentHealth;
    this.money = money;
    this.canvas = canvas;
    this.assets = assets;
  }

  render(): void {
    const ctx: CanvasRenderingContext2D | null = this.canvas.ctx;
    const posY = 20;
    const moneyIcon: HTMLImageElement | null = this.assets.get('/hud/money.png');

    // Money
    if (ctx && moneyIcon) {
      ctx.drawImage(moneyIcon, 10, posY, 8, 10);
      ctx.font = "18px 'PressStart'";
      ctx.fillStyle = '#fff';
      ctx.fillText(this.money.toString(), 25, 32);
    }

    // Health
    const hearts: number = this.health / 20;
    const posX = 60;
    const heartIcon: HTMLImageElement | null = this.assets.get('/hud/heart_full.png');
    if (ctx && heartIcon) {
      for (let i: number = 0; i < hearts; i++) {
        ctx.drawImage(heartIcon, posX + i * 20, posY, 14, 13);
      }
    }
  }
}
