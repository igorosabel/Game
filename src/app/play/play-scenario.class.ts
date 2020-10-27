import { Constants }     from '../model/constants';
import { Position }      from '../model/position.model';
import { PlayCanvas }    from './play-canvas.class';
import { PlayObject }    from './play-object.class';
import { PlayCharacter } from './play-character.class';

export class PlayScenario {
	debug: boolean;
	canvas: PlayCanvas;
	mapBackground;
	player: PlayCharacter;
	objects: PlayObject[];
	characters: PlayCharacter[];
	blockers: Position[];

	constructor(canvas: PlayCanvas, mapBackground, blockers: Position[]) {
		// Creo el canvas
		this.canvas = canvas;
		this.mapBackground = mapBackground;

		// Inicializo objetos y personajes
		this.blockers = blockers;
		this.player = null;
		this.objects = [];
		this.characters = [];
	}

	get ctx() {
		return this.canvas.ctx;
	}

	addObject(object: PlayObject) {
		this.objects.push(object);
	}

	addCharacter(character: PlayCharacter) {
		this.characters.push(character);
	}

	render() {
		this.canvas.ctx.drawImage(this.mapBackground, 0, 0, Constants.SCENARIO_WIDTH, Constants.SCENARIO_HEIGHT);
	}

	renderItems() {
		let list = [];
		list.push(this.player);
		list = list.concat(this.objects);
		list = list.concat(this.characters);
		list.sort((a, b) => a.pos.y - b.pos.y);

		list.forEach(item => {
			item.render(this.canvas.ctx);
		});
	}
}
