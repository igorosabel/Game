export class PlayHud {
	health: number;
	currentHealth: number;
	money: number;
	canvas;
	sprites;

	constructor(health: number, currentHealth: number, money: number, canvas) {
		this.health = health;
		this.currentHealth = currentHealth;
		this.money = money;
		this.canvas = canvas;
		this.sprites = {};
	}

	addSprite(ind, spr) {
		this.sprites[ind] = spr;
	}

	render() {
		const ctx = this.canvas.ctx;
		const posY = 20;

		// Money
		ctx.drawImage(this.sprites['money'].img, 10, posY, 8, 10);
		ctx.font = "18px 'GraphicPixel'";
		ctx.fillStyle = '#fff';
		ctx.fillText(this.money, 25, 32);

		// Health
		const hearts = this.health / 20;
		const posX = 60;
		for (let i=0; i<hearts; i++) {
			ctx.drawImage(this.sprites['heart_full'].img, (posX + (i * 20)), posY, 14, 13);
		}
	}
}
