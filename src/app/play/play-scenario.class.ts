export class PlayScenario {
	debug: boolean;
	canvas;
	_width: number;
	_height: number;
	tile_width: number;
	tile_height: number;
	tiles;

	constructor(width = 256, height = 256, rows = 16, cols = 16) {
		// Modo debug
		this.debug = false;

		// Creo el canvas
		this.canvas = makeCanvas(width, height);
		this._width = width;
		this._height = height;

		// Calculo tamaño de cada tile
		this.tile_width = width / cols;
		this.tile_height = height / rows;

		// Creo los tiles
		this.tiles = {};
		for (let y=1; y<=rows; y++) {
			for (let x=1; x<=cols; x++) {
				let pos = {
					x: (x-1) * this.tile_width,
					y: (y-1) * this.tile_height
				};
				this.tiles[x + '-' + y] = makeTile({x, y}, pos, {w: this.tile_width, h: this.tile_height});
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
