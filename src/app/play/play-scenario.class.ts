import { PlayTile } from './play-tile.class';

export class PlayScenario {
	debug: boolean;
	canvas;
	_width: number;
	_height: number;
	tileWidth: number;
	tileHeight: number;
	tiles;

	constructor(canvas, width = 800, height = 600, rows = 18, cols = 24) {
		// Modo debug
		this.debug = false;

		// Creo el canvas
		this.canvas = canvas;
		this._width = width;
		this._height = height;

		// Calculo tamaño de cada tile
		this.tileWidth = width / cols;
		this.tileHeight = height / rows;

		// Creo los tiles
		this.tiles = {};
		for (let y=1; y<=rows; y++) {
			for (let x=1; x<=cols; x++) {
				let pos = {
					x: (x-1) * this.tileWidth,
					y: (y-1) * this.tileHeight
				};
				this.tiles[x + '-' + y] = new PlayTile({x, y}, pos, {width: this.tileWidth, height: this.tileHeight});
			}
		}

		// Tiles con colision
		this.blockers = [];
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get ctx() {
		return this.canvas.ctx;
	}

	addBck(pos, bck) {
		this.tiles[pos.x + '-' + pos.y].addBck(bck);
		if (this.tiles[pos.x + '-' + pos.y].crossable===false) {
			this.addBlocker(this.tiles[pos.x + '-' + pos.y]);
		}
	}
	addSpr(pos, spr) {
		this.tiles[pos.x + '-' + pos.y].addSpr(spr);
		if (this.tiles[pos.x + '-' + pos.y].crossable===false) {
			this.addBlocker(this.tiles[pos.x + '-' + pos.y]);
		}
	}
	removeTile(pos) {
		let tile = this.tiles[pos.x + '-' + pos.y];
		this.blockers.splice(this.blockers.indexOf(tile), 1);
		delete this.tiles[pos.x + '-' + pos.y];
	}
	addBlocker(tile) {
		this.blockers.push(tile);
	}
	render() {
		for (let i in this.tiles) {
			this.tiles[i].render(this.ctx);
		}
	}
}
