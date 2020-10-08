import { Injectable }  from '@angular/core';
import { World }    from '../model/world.model';
import { Scenario }    from '../model/scenario.model';
import { WorldInterface, ScenarioInterface } from '../interfaces/interfaces';

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

	getScenarios(response: ScenarioInterface[]) {
		const scenarios: Scenario[] = [];

		for (let s of response) {
			let scenario = this.getScenario(s);
			scenarios.push(scenario);
		}

		return scenarios;
	}

	getScenario(s: ScenarioInterface) {
		const scenario = new Scenario(s.id, s.idWorld, s.name, s.friendly);
		return scenario;
	}
}
