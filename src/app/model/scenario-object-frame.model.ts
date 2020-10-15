import { ScenarioObjectFrameInterface } from '../interfaces/interfaces';

export class ScenarioObjectFrame {
	constructor(
		public id: number = null,
		public idAsset: number = null,
		public assetUrl: string = null,
		public order: number = null
	) {}

	toInterface(): ScenarioObjectFrameInterface {
		const scenarioObjectFrame: ScenarioObjectFrameInterface = {
			id: this.id,
			idAsset: this.idAsset,
			assetUrl: this.assetUrl,
			order: this.order
		};
		return scenarioObjectFrame;
	}
}