import { ScenarioInterface } from '../interfaces/interfaces';

export class Scenario {
	constructor(
		public id: number = null,
		public idWorld: number = null,
		public name: string = null,
		public friendly: boolean = false
	) {}
	
	toInterface(): ScenarioInterface {
		const scenario: ScenarioInterface = {
			id: this.id,
			idWorld: this.idWorld,
			name: this.name,
			friendly: this.friendly
		};
		return scenario;
	}
}