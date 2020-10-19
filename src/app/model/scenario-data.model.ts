import { ScenarioDataInterface } from '../interfaces/interfaces';

export class ScenarioData {
	constructor(
		public id: number = null,
		public x: number = null,
		public y: number = null,
		public idBackground: number = null,
		public backgroundName: string = null,
		public backgroundAssetUrl: string = null,
		public idScenarioObject: number = null,
		public scenarioObjectName: string = null,
		public scenarioObjectAssetUrl: string = null,
		public idCharacter: number = null,
		public characterName: string = null,
		public characterAssetUrl: string = null
	) {}
	
	get backgroundStyle() {
		if (this.backgroundAssetUrl != null) {
		return `url(${this.backgroundAssetUrl}) no-repeat scroll center center / 100% 100% transparent`;
		}
		return `none`;
	}

	toInterface(): ScenarioDataInterface {
		const scenarioData: ScenarioDataInterface = {
			id: this.id,
			x: this.x,
			y: this.y,
			idBackground: this.idBackground,
			backgroundName: this.backgroundName,
			backgroundAssetUrl: this.backgroundAssetUrl,
			idScenarioObject: this.idScenarioObject,
			scenarioObjectName: this.scenarioObjectName,
			scenarioObjectAssetUrl: this.scenarioObjectAssetUrl,
			idCharacter: this.idCharacter,
			characterName: this.characterName,
			characterAssetUrl: this.characterAssetUrl
		};
		return scenarioData;
	}
}
