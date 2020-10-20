import { ScenarioDataInterface } from '../interfaces/interfaces';

export class ScenarioData {
	constructor(
		public id: number = null,
		public idScenario: number = null,
		public x: number = null,
		public y: number = null,
		public idBackground: number = null,
		public backgroundName: string = null,
		public backgroundAssetUrl: string = null,
		public idScenarioObject: number = null,
		public scenarioObjectName: string = null,
		public scenarioObjectAssetUrl: string = null,
		public scenarioObjectWidth: number = null,
		public scenarioObjectHeight: number = null,
		public idCharacter: number = null,
		public characterName: string = null,
		public characterAssetUrl: string = null,
		public characterWidth: number = null,
		public characterHeight: number = null
	) {}

	toInterface(): ScenarioDataInterface {
		const scenarioData: ScenarioDataInterface = {
			id: this.id,
			idScenario: this.idScenario,
			x: this.x,
			y: this.y,
			idBackground: this.idBackground,
			backgroundName: this.backgroundName,
			backgroundAssetUrl: this.backgroundAssetUrl,
			idScenarioObject: this.idScenarioObject,
			scenarioObjectName: this.scenarioObjectName,
			scenarioObjectAssetUrl: this.scenarioObjectAssetUrl,
			scenarioObjectWidth: this.scenarioObjectWidth,
			scenarioObjectHeight: this.scenarioObjectHeight,
			idCharacter: this.idCharacter,
			characterName: this.characterName,
			characterAssetUrl: this.characterAssetUrl,
			characterWidth: this.characterWidth,
			characterHeight: this.characterHeight
		};
		return scenarioData;
	}
}
