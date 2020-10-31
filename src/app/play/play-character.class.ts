import { EventDispatcher } from 'strongly-typed-events';
import { Constants }       from '../model/constants';
import { Item }            from '../model/item.model';
import { Position }        from '../model/position.model';
import { Character }       from '../model/character.model';
import { Narrative }       from '../model/narrative.model';
import { PlayScenario }    from './play-scenario.class';
import { AssetCache }      from './asset-cache.class';
import { PlayConnection }  from './play-connection.class';
import { PlayUtils }       from './play-utils.class';

export class PlayCharacter {
	orientation: string;
	orientationList;
	pos;
	blockPos;
	originalSize;
	center;
	sprites;
	scenario: PlayScenario;
	vx: number;
	vy: number;
	moving;
	frames;
	currentFrame: number;
	playing: boolean;
	interval: number;
	name: string;
	character: Character;
	connections;
	npcData;

	private _onAction = new EventDispatcher<PlayCharacter, Position>();
	private _onConnection = new EventDispatcher<PlayCharacter, PlayConnection>();

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		blockWidth:number,
		blockHeight: number,
		scenario: PlayScenario
	) {
		this.orientation = 'down';
		this.orientationList = [];
		this.pos = {
			x: ((x * Constants.TILE_WIDTH) - (width * Constants.TILE_WIDTH)),
			y: ((y * Constants.TILE_HEIGHT) - (height * Constants.TILE_HEIGHT)),
			width: (width * Constants.TILE_WIDTH),
			height: (height * Constants.TILE_HEIGHT)
		};
		this.blockPos = {
			x: ((x * Constants.TILE_WIDTH) - (blockWidth * Constants.TILE_WIDTH)),
			y: ((y * Constants.TILE_HEIGHT) - (blockHeight * Constants.TILE_HEIGHT)),
			width: (blockWidth * Constants.TILE_WIDTH),
			height: (blockHeight * Constants.TILE_HEIGHT)
		};
		this.originalSize = {width, height};
		this.scenario = scenario;
		this.center = {};
		this.sprites = {
			up: [],
			right: [],
			down: [],
			left: []
		};
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
		this.npcData = {
			isNPC: false,
			status: 'idle',
			timer: null,
			remainingTime: 0
		};
	}

	setSprite(ind, sprite) {
		this.sprites[ind].push(sprite);
	}

	updateCenter() {
		this.center = PlayUtils.getCenter(this.pos);
	}

	getNextPos() {
		this.updateCenter();
		const newPos: Position = new Position(this.center.x, this.center.y);
		switch(this.orientation) {
			case 'up': {
				newPos.y -= this.pos.height;
			}
			break;
			case 'down': {
				newPos.y += this.pos.height;
			}
			break;
			case 'left': {
				newPos.x -= this.pos.width;
			}
			break;
			case 'right': {
				newPos.x += this.pos.width;
			}
			break;
		}
		return newPos;
	}

	getNextTile() {
		const newPos: Position = this.getNextPos();
		const nextTile: Position = new Position(
			Math.floor(newPos.x / Constants.TILE_WIDTH),
			Math.floor(newPos.y / Constants.TILE_HEIGHT)
		);
		return nextTile;
	}

	stop() {
		this.moving.up = false;
		this.moving.down = false;
		this.moving.right = false;
		this.moving.left = false;
		this.stopAnimation();
	}

	up() {
		if (!this.moving.up) {
			this.vy = -1 * Constants.DEFAULT_VY * this.character.speed;
			this.moving.up = true;
			this.orientationList.push('up');
			this.playAnimation();
		}
		this.updateOrientation();
	}

	stopUp() {
		if (this.moving.up) {
			this.moving.up = false;
			this.vy = 0;
			this.orientationList.splice( this.orientationList.indexOf('up'), 1 );
		}
		this.updateOrientation();
	}

	down() {
		if (!this.moving.down) {
			this.vy = Constants.DEFAULT_VY * this.character.speed;
			this.moving.down = true;
			this.orientationList.push('down');
			this.playAnimation();
		}
		this.updateOrientation();
	}

	stopDown() {
		if (this.moving.down) {
			this.moving.down = false;
			this.vy = 0;
			this.orientationList.splice( this.orientationList.indexOf('down'), 1 );
		}
		this.updateOrientation();
	}

	right() {
		if (!this.moving.right) {
			this.vx = Constants.DEFAULT_VX * this.character.speed;
			this.moving.right = true;
			this.orientationList.push('right');
			this.playAnimation();
		}
		this.updateOrientation();
	}

	stopRight() {
		if (this.moving.right) {
			this.moving.right = false;
			this.vx = 0;
			this.orientationList.splice( this.orientationList.indexOf('right'), 1 );
		}
		this.updateOrientation();
	}

	left() {
		if (!this.moving.left) {
			this.vx = -1 * Constants.DEFAULT_VX * this.character.speed;
			this.moving.left = true;
			this.orientationList.push('left');
			this.playAnimation();
		}
		this.updateOrientation();
	}

	stopLeft() {
		if (this.moving.left) {
			this.moving.left = false;
			this.vx = 0;
			this.orientationList.splice( this.orientationList.indexOf('left'), 1 );
		}
		this.updateOrientation();
	}

	doAction() {
		this._onAction.dispatch(this, this.getNextPos());
	}

	stopAction() {

	}

	public get onAction() {
		return this._onAction.asEvent();
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
			this.interval = setInterval(this.updateAnimation.bind(this), Constants.FRAME_DURATION);
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

	collission(obj1, obj2: Position) {
		let rect2 = {x: (obj2.x * Constants.TILE_WIDTH), y: (obj2.y * Constants.TILE_HEIGHT), width: Constants.TILE_WIDTH, height: Constants.TILE_HEIGHT};

		return PlayUtils.collision(obj1, rect2);
	}

	characterCollision(pos, character) {
		let charPos = {x: character.blockPos.x, y: character.blockPos.y, width: character.blockPos.width, height: character.blockPos.height};

		return PlayUtils.collision(pos, charPos);
	}

	public get onConnection() {
		return this._onConnection.asEvent();
	}

	stopNPC() {
		switch (this.orientation) {
			case 'up': { this.stopUp(); }
			break;
			case 'down': { this.stopDown(); }
			break;
			case 'left': { this.stopLeft(); }
			break;
			case 'right': { this.stopRight(); }
			break;
		}
	}

	npcLogic() {
		if (this.npcData.isNPC && !this.character.fixedPosition) {
			clearTimeout(this.npcData.timer);
			this.npcData.remainingTime--;
			const distance = PlayUtils.distance(this.scenario.player.blockPos, this.blockPos);
			if (distance > 250) {
				this.npcData.status = 'wandering';
			}

			if (this.npcData.status=='wandering' && this.npcData.remainingTime<1) {
				const movementOptions = ['down', 'up', 'left', 'right'];
				const currentInd = movementOptions.findIndex(x => x===this.orientation);
				movementOptions.splice(currentInd, 1);
				const option = movementOptions[Math.floor(Math.random() * movementOptions.length)];
				this.stopNPC();
				this.orientation = option;
				switch (option) {
					case 'up': { this.up(); }
					break;
					case 'down': { this.down(); }
					break;
					case 'left': { this.left(); }
					break;
					case 'right': { this.right(); }
					break;
				}
				this.npcData.remainingTime = Math.floor(Math.random() * 6) + 3;
			}

			this.npcData.timer = setTimeout(() => { this.npcLogic(); }, 1000);
		}
	}

	move() {
		if (this.moving.up || this.moving.down || this.moving.right || this.moving.left) {
			let newPosX = this.blockPos.x + this.vx;
			let newPosY = this.blockPos.y + this.vy;
			// Colisión con los bordes de la pantalla
			if ((newPosX < 0) || (newPosY < 0) || ((newPosX + this.blockPos.width) > Constants.SCENARIO_WIDTH) || ((newPosY + this.blockPos.height) > Constants.SCENARIO_HEIGHT)) {
				if (!this.npcData.isNPC) {
					const next = this.getNextTile();
					const playConnection = new PlayConnection();
					// Izquierda
					if ((newPosX < 0) && this.connections.left!==null) {
						playConnection.to = this.connections.left.to;
						playConnection.x = 0;
						playConnection.y = next.y;
					}
					// Arriba
					if ((newPosY < 0) && this.connections.up!==null) {
						playConnection.to = this.connections.up.to;
						playConnection.x = next.x;
						playConnection.y = 0;
					}
					// Derecha
					if (((newPosX + this.blockPos.width) > Constants.SCENARIO_WIDTH) && this.connections.right!==null) {
						playConnection.to = this.connections.right.to;
						playConnection.x = Constants.SCENARIO_COLS;
						playConnection.y = next.y;
					}
					// Abajo
					if (((newPosY + this.blockPos.height) > Constants.SCENARIO_HEIGHT) && this.connections.down!==null) {
						playConnection.to = this.connections.down.to;
						playConnection.x = next.x;
						playConnection.y = Constants.SCENARIO_ROWS;
					}
					if (playConnection.to!==null) {
						this._onConnection.dispatch(this, playConnection);
					}
				}
				else {
					this.stopNPC();
				}
				return false;
			}

			// Colisión con fondos y objetos
			let hit = false;
			let newPos = {
				x: newPosX,
				y: newPosY,
				width: this.blockPos.width,
				height: this.blockPos.height
			};
			this.scenario.blockers.forEach(object => {
				if (this.collission(newPos, object)) {
					hit = true;
				}
			});
			if (!this.npcData.isNPC) {
				this.scenario.characters.forEach(character => {
					if (this.characterCollision(newPos, character)) {
						hit = true;
					}
				});
			}
			else {
				const characterList = [...this.scenario.characters];
				const characterInd = characterList.findIndex(x => x.pos.x===this.pos.x && x.pos.y===this.pos.y);
				characterList.splice(characterInd, 1);
				characterList.forEach(character => {
					if (this.characterCollision(newPos, character)) {
						hit = true;
					}
				});
				if (this.characterCollision(newPos, this.scenario.player)) {
					hit = true;
				}
			}
			if (hit) {
				if (this.npcData.isNPC) {
					this.stopNPC();
				}
				return false;
			}

			// Actualizo posición
			this.pos.x += this.vx;
			this.pos.y += this.vy;
			this.blockPos.x += this.vx;
			this.blockPos.y += this.vy;
			this.updateCenter();
		}
		else {
			this.stopAnimation();
		}
	}

	render(ctx) {
		ctx.drawImage(this.sprites[this.orientation][this.currentFrame], this.pos.x, this.pos.y, this.pos.width, this.pos.height);
		if (Constants.DEBUG) {
			ctx.strokeStyle = '#f00';
			ctx.lineWidth = 1;
			ctx.strokeRect(this.pos.x, this.pos.y, this.pos.width, this.pos.height);
			ctx.strokeStyle = '#00f';
			ctx.lineWidth = 1;
			ctx.strokeRect(this.blockPos.x, this.blockPos.y, this.blockPos.width, this.blockPos.height);
		}
	}
}
