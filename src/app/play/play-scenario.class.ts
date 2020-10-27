import { Constants }        from '../model/constants';
import { PlayCanvas }       from './play-canvas.class';
import { PlayObject }       from './play-object.class';
import { PlayCharacter }    from './play-character.class';
import { BlockerInterface } from '../interfaces/interfaces';

export class PlayScenario {
	debug: boolean;
	canvas: PlayCanvas;
	mapBackground;
	objects: PlayObject[];
	characters: PlayCharacter[];
	blockers: BlockerInterface[];

	constructor(canvas: PlayCanvas, mapBackground, blockers: BlockerInterface[]) {
		// Creo el canvas
		this.canvas = canvas;
		this.mapBackground = mapBackground;

		// Inicializo objetos y personajes
		this.blockers = blockers;
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

	renderObjects() {
		this.objects.forEach(object => {
			object.render(this.canvas.ctx);
		});
	}

	renderCharacters() {
		this.characters.forEach(character => {
			character.render(this.canvas.ctx);
		});
	}
}
