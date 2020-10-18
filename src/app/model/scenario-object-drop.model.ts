import { ScenarioObjectDropInterface } from '../interfaces/interfaces';

export class ScenarioObjectDrop {
	constructor(
		public id: number = null,
		public idItem: number = null,
		public itemName: string = null,
		public assetUrl: string = null,
		public num: number = null
	) {}

	toInterface(): ScenarioObjectDropInterface {
		const scenarioObjectDrop: ScenarioObjectDropInterface = {
			id: this.id,
			idItem: this.idItem,
			itemName: this.itemName,
			assetUrl: this.assetUrl,
			num: this.num
		};
		return scenarioObjectDrop;
	}
}
