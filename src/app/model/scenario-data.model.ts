import { ScenarioDataInterface } from '../interfaces/interfaces';

export class ScenarioData {
	constructor(
		public id: number = null,
		public type: number = null,
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

	toInterface(): ItemInterface {
		const item: ItemInterface = {
			id: this.id,
			type: this.type,
			idAsset: this.idAsset,
			assetUrl: this.assetUrl,
			name: this.name,
			money: this.money,
			health: this.health,
			attack: this.attack,
			defense: this.defense,
			speed: this.speed,
			wearable: this.wearable,
			frames: []
		};
		return item;
	}
}
