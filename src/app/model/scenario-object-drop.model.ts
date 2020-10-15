import { ScenarioObjectDropInterface } from '../interfaces/interfaces';

export class ScenarioObjectDrop {
	constructor(
		public id: number = null,
		public idAsset: number = null,
		public assetUrl: string = null,
		public num: number = null
	) {}

	toInterface(): ScenarioObjectDropInterface {
		const scenarioObjectDrop: ScenarioObjectDropInterface = {
			id: this.id,
			idAsset: this.idAsset,
			assetUrl: this.assetUrl,
			num: this.num
		};
		return scenarioObjectDrop;
	}
}