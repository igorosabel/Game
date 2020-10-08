import { WorldInterface } from '../interfaces/interfaces';

export class World {
	constructor(
		public id: number = null,
		public name: string = null,
		public description: string = null,
		public wordOne: string = null,
		public wordTwo: string = null,
		public wordThree: string = null,
		public friendly: boolean = false
	) {}
	
	toInterface(): WorldInterface {
		const world: WorldInterface = {
			id: this.id,
			name: this.name,
			description: this.description,
			wordOne: this.wordOne,
			wordTwo: this.wordTwo,
			wordThree: this.wordThree,
			friendly: this.friendly
		};
		return world;
	}
}