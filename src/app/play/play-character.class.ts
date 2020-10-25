import { Item } from '../model/item.model';

export class PlayCharacter {
	constructor(pos, size) {
		this.orientation = 'down';
		this.orientationList = [];
		this.pos = pos;
		this.size = size;
		this.center = {};
		this.sprites = {
			up: [],
			right: [],
			down: [],
			left: []
		};
		this.scenario = null;
		this.frameDuration = 0;
		this.defaultVX = 3;
		this.defaultVY = 3;
		this.vx = 0;
		this.vy = 0;
		this.moving = {
			up: false,
			down: false,
			right: false,
			left: false
		};
		this.frames = {
			up: [],
			right: [],
			down: [],
			left: []
		};
		this.currentFrame = 0;
		this.playing = false;
		this.interval = null;
		this.updateCenter();

		// Detalles del personaje
		this.isNPC = false;
		this.health = 100;
		this.currentHealth = 100;
		this.money = 100;
		this.speed = 3;
		this.items = [];
	}
	
	setDetail(
		name: string,
		isNPC: boolean,
		health: number,
		currentHealth: number,
		money: number,
		speed: number,
		items: Item[]
	) {
		this.name = name;
		this.isNPC = isNPC;
		this.health;
		this.currentHealth = currentHealth;
		this.money = money;
		this.speed = speed;
		this.items = items;
	}
	
	setScenario(
		scenario: PlayScenario,
		frameDuration: number,
		defaultVX: number,
		defaultVY: number
	) {
		this.scenario = scenario;
		this.frameDuration = frameDuration;
		this.defaultVX = defaultVX;
		this.defaultVY = defaultVY;
	}

	setSprite(ind, sprite) {
		this.sprites[ind].push(sprite);
	}

	updateCenter() {
		this.center = {
			x: this.pos.x + (this.size.width / 2),
			y: this.pos.y + (this.size.height / 2)
		}
	}

	up() {
		if (!this.moving.up) {
			this.vy = -1 * this.defaultVY * this.speed;
			this.moving.up = true;
			this.orientationList.push('up');
			this.playAnimation();
		}
		this.updateOrientation();
	}

	stopUp() {
		this.moving.up = false;
		this.vy = 0;
		this.orientationList.splice( this.orientationList.indexOf('up'), 1 );
		this.updateOrientation();
	}

	down() {
		if (!this.moving.down) {
			this.vy = this.defaultVY * this.speed;
			this.moving.down = true;
			this.orientationList.push('down');
			this.playAnimation();
		}
		this.updateOrientation();
	}

	stopDown() {
		this.moving.down = false;
		this.vy = 0;
		this.orientationList.splice( this.orientationList.indexOf('down'), 1 );
		this.updateOrientation();
	}

	right() {
		if (!this.moving.right) {
			this.vx = this.defaultVX * this.speed;
			this.moving.right = true;
			this.orientationList.push('right');
			this.playAnimation();
		}
		this.updateOrientation();
	}

	stopRight() {
		this.moving.right = false;
		this.vx = 0;
		this.orientationList.splice( this.orientationList.indexOf('right'), 1 );
		this.updateOrientation();
	}

	left() {
		if (!this.moving.left) {
			this.vx = -1 * this.defaultVX * this.speed;
			this.moving.left = true;
			this.orientationList.push('left');
			this.playAnimation();
		}
		this.updateOrientation();
	}

	stopLeft() {
		this.moving.left = false;
		this.vx = 0;
		this.orientationList.splice( this.orientationList.indexOf('left'), 1 );
		this.updateOrientation();
	}

	doAction() {
		console.log('doAction');
	}

	stopAction() {
		console.log('stopAction');
	}

	hit() {
		console.log('hit');
	}

	stopHit() {
		console.log('stopHit');
	}

	playAnimation() {
		if (!this.playing) {
			this.playing = true;
			this.interval = setInterval(this.updateAnimation.bind(this), this.frameDuration);
		}
	}

	stopAnimation() {
		this.playing = false;
		this.currentFrame = 0;
		clearInterval(this.interval);
	}

	updateAnimation() {
		if (this.currentFrame === (this.sprites[this.orientation].length - 1)) {
			this.currentFrame = 1;
		}
		else{
			this.currentFrame++;
		}
	}

	updateOrientation() {
		if (this.orientationList.length>0) {
			this.orientation = this.orientationList[this.orientationList.length - 1];
		}
	}

	move() {
		if (this.moving.up || this.moving.down || this.moving.right || this.moving.left) {
			let newPosX = this.pos.x + this.vx;
			let newPosY = this.pos.y + this.vy;

			// Colisión con los bordes de la pantalla
			if (newPosX<0 || newPosY<0 || (newPosX + this.size.width) > scenario.width || (newPosY + this.size.height) > scenario.height) {
				return false;
			}

			// Colisión con objetos
			let hit = false;
			let newPos = {
				pos: {x: newPosX, y: newPosY},
				size: this.size
			};
			scenario.blockers.forEach(tile => {
				if (collission(newPos, tile)) {
					hit = true;
				}
			});
			if (hit) {
				return false;
			}
			// Actualizo posición
			this.pos.x += this.vx;
			this.pos.y += this.vy;
			this.updateCenter();
		}
		else {
			this.stopAnimation();
		}
	}

	render() {
		scenario.ctx.drawImage(this.sprites[this.orientation][this.currentFrame].img, this.pos.x, this.pos.y, this.size.w, this.size.h);
	}
}