import { AssetCache } from './asset-cache.class';

export class PlayHud {
	health: number;
	currentHealth: number;
	money: number;
	canvas;
	assets;

	constructor(health: number, currentHealth: number, money: number, canvas, assets: AssetCache) {
		this.health = health;
		this.currentHealth = currentHealth;
		this.money = money;
		this.canvas = canvas;
		this.assets = assets;
	}

	render() {
		const ctx = this.canvas.ctx;
		const posY = 20;

		// Money
		ctx.drawImage(this.assets.get('/assets/hud/money.png'), 10, posY, 8, 10);
		ctx.font = "18px 'GraphicPixel'";
		ctx.fillStyle = '#fff';
		ctx.fillText(this.money, 25, 32);

		// Health
		const hearts = this.health / 20;
		const posX = 60;
		for (let i=0; i<hearts; i++) {
			ctx.drawImage(this.assets.get('/assets/hud/heart_full.png'), (posX + (i * 20)), posY, 14, 13);
		}
	}
}
