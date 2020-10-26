import { PlayCanvas } from './play-canvas.class';
import { PlayTile }   from './play-tile.class';

export class PlayScenario {
	debug: boolean;
	canvas: PlayCanvas;
	mapBackground;
	_width: number;
	_height: number;
	tileWidth: number;
	tileHeight: number;
	tiles;
	blockers;

	constructor(canvas: PlayCanvas, width: number = 800, height: number = 600, rows: number = 20, cols: number = 25, mapBackground) {
		// Modo debug
		this.debug = false;

		// Creo el canvas
		this.canvas = canvas;
		this._width = width;
		this._height = height;
		this.mapBackground = mapBackground;

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
				this.tiles[x + '-' + y] = new PlayTile({x, y}, pos, {width: this.tileWidth, height: this.tileHeight}, this.canvas);
				this.tiles[x + '-' + y].debug = this.debug;
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
		this.canvas.ctx.drawImage(this.mapBackground, 0, 0, this._width, this._height);
		for (let i in this.tiles) {
			this.tiles[i].render(this.ctx);
		}
	}
}
