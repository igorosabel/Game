import { Constants }        from '../model/constants';
import { PlayCanvas }       from './play-canvas.class';
import { PlayObject }       from './play-object.class';
import { PlayNPC }          from './play-npc.class';
import { PlayEnemy }        from './play-enemy.class';
import { BlockerInterface } from '../interfaces/interfaces';

export class PlayScenario {
	debug: boolean;
	canvas: PlayCanvas;
	mapBackground;
	tileWidth: number;
	tileHeight: number;
	objects: PlayObject[];
	npcs: PlayNPC[];
	enemies: PlayEnemy[];
	blockers: BlockerInterface[];

	constructor(canvas: PlayCanvas, mapBackground, blockers: BlockerInterface[]) {
		// Modo debug
		this.debug = false;

		// Creo el canvas
		this.canvas = canvas;
		this.mapBackground = mapBackground;

		// Calculo tamaño de cada tile
		this.tileWidth = Constants.SCENARIO_WIDTH / Constants.SCENARIO_COLS;
		this.tileHeight = Constants.SCENARIO_HEIGHT / Constants.SCENARIO_ROWS;

		// Inicializo objetos y personajes
		this.blockers = blockers;
		this.objects = [];
		this.npcs = [];
		this.enemies = [];
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
		this.canvas.ctx.drawImage(this.mapBackground, 0, 0, Constants.SCENARIO_WIDTH, Constants.SCENARIO_HEIGHT);
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
