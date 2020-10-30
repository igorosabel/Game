import { EventDispatcher } from 'strongly-typed-events';
import { Constants }       from '../model/constants';
import { Item }            from '../model/item.model';
import { Position }        from '../model/position.model';
import { Character }       from '../model/character.model';
import { Narrative }       from '../model/narrative.model';
import { PlayScenario }    from './play-scenario.class';
import { AssetCache }      from './asset-cache.class';
import { PlayConnection }  from './play-connection.class';

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
	}

	setSprite(ind, sprite) {
		this.sprites[ind].push(sprite);
	}

	updateCenter() {
		this.center = {
			x: this.pos.x + (this.pos.width / 2),
			y: this.pos.y + (this.pos.height / 2)
		}
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
		this.moving.up = false;
		this.vy = 0;
		this.orientationList.splice( this.orientationList.indexOf('up'), 1 );
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
		this.moving.down = false;
		this.vy = 0;
		this.orientationList.splice( this.orientationList.indexOf('down'), 1 );
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
		this.moving.right = false;
		this.vx = 0;
		this.orientationList.splice( this.orientationList.indexOf('right'), 1 );
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
		this.moving.left = false;
		this.vx = 0;
		this.orientationList.splice( this.orientationList.indexOf('left'), 1 );
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
		let rect1 = {x: obj1.x, y: obj1.y, width: obj1.width, height: obj1.height};
		let rect2 = {x: (obj2.x * Constants.TILE_WIDTH), y: (obj2.y * Constants.TILE_HEIGHT), width: Constants.TILE_WIDTH, height: Constants.TILE_HEIGHT};

		if (rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.height + rect1.y > rect2.y) {
			return true;
		}

		return false;
	}
	
	characterCollision(pos, character) {
		let charPos = {x: character.blockPos.x, y: character.blockPos.y, width: character.blockPos.width, height: character.blockPos.height};

		if (pos.x < charPos.x + charPos.width &&
			pos.x + pos.width > charPos.x &&
			pos.y < charPos.y + charPos.height &&
			pos.height + pos.y > charPos.y) {
			return true;
		}

		return false;
	}

	public get onConnection() {
		return this._onConnection.asEvent();
	}

	move() {
		if (!this.character.fixedPosition) {
			//console.log(this);
		}
		if (this.moving.up || this.moving.down || this.moving.right || this.moving.left) {
			let newPosX = this.blockPos.x + this.vx;
			let newPosY = this.blockPos.y + this.vy;
			// Colisión con los bordes de la pantalla
			if ((newPosX < 0) || (newPosY < 0) || ((newPosX + this.blockPos.width) > Constants.SCENARIO_WIDTH) || ((newPosY + this.blockPos.height) > Constants.SCENARIO_HEIGHT)) {
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
				return false;
			}

			// Colisión con objetos
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
			this.scenario.characters.forEach(character => {
				if (this.characterCollision(newPos, character)) {
					hit = true;
				}
			});
			if (hit) {
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
