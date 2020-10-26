import { PlayCanvas }       from './play-canvas.class';
import { PlayObject }       from './play-object.class';
import { PlayNPC }          from './play-npc.class';
import { PlayEnemy }        from './play-enemy.class';
import { BlockerInterface } from '../interfaces/interfaces';

export class PlayScenario {
	debug: boolean;
	canvas: PlayCanvas;
	mapBackground;
	_width: number;
	_height: number;
	tileWidth: number;
	tileHeight: number;
	objects: PlayObject[];
	npcs: PlayNPC[];
	enemies: PlayEnemy[];
	blockers: BlockerInterface[];

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

		// Inicializo objetos y personajes
		this.objects = [];
		this.npcs = [];
		this.enemies = [];
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

	addObject(object: PlayObject) {
		this.objects.push(object);
	}

	addNPC(npc: PlayNPC) {
		this.npcs.push(npc);
	}

	addEnemy(enemy: PlayEnemy) {
		this.enemies.push(enemy);
	}

	render() {
		this.canvas.ctx.drawImage(this.mapBackground, 0, 0, this._width, this._height);
	}

	renderObjects() {
		this.objects.forEach(object => {
			object.render(this.canvas.ctx, this.tileWidth, this.tileHeight);
		});
	}

	renderCharacters() {
		this.npcs.forEach(npc => {
			npc.render();
		});
		this.enemies.forEach(enemy => {
			enemy.render();
		});
	}
}
