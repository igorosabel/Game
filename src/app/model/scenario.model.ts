import { ScenarioInterface } from '../interfaces/interfaces';

export class Scenario {
	constructor(
		public id: number = null,
		public idWorld: number = null,
		public name: string = null,
		public startX: number = null,
		public startY: number = null,
		public initial: boolean = false,
		public friendly: boolean = false
	) {}
	
	toInterface(): ScenarioInterface {
		const scenario: ScenarioInterface = {
			id: this.id,
			idWorld: this.idWorld,
			name: this.name,
			startX: this.startX,
			startY: this.startY,
			initial: this.initial,
			friendly: this.friendly
		};
		return scenario;
	}
}