import { Injectable }  from '@angular/core';
import { World }    from '../model/world.model';
import { WorldInterface, WorldResult } from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ClassMapperService {
	constructor() {}

	getWorlds(response: WorldInterface[]) {
		const worlds: World[] = [];

		for (let w of response) {
			let world = this.getWorld(w);
			worlds.push(world);
		}

		return worlds;
	}

	getWorld(w: WorldInterface) {
		const world = new World(w.id, w.name, w.description, w.wordOne, w.wordTwo, w.wordThree, w.friendly);
		return world;
	}
}
