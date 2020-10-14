import { CharacterInterface, CharacterFrameInterface } from '../interfaces/interfaces';
import { CharacterFrame } from './character-frame.model';

export class Character {
	constructor(
		public id: number = null,
		public name: string = null,
		public idAssetUp: number = null,
		public assetUpUrl: string = null,
		public idAssetDown: number = null,
		public assetDownUrl: string = null,
		public idAssetLeft: number = null,
		public assetLeftUrl: string = null,
		public idAssetRight: number = null,
		public assetRightUrl: string = null,
		public type: number = null,
		public health: number = null,
		public attack: number = null,
		public defense: number = null,
		public speed: number = null,
		public dropIdItem: number = null,
		public dropAssetUrl: string = null,
		public dropChance: number = null,
		public respawn: number = null,
		public framesUp: CharacterFrame[] = [],
		public framesDown: CharacterFrame[] = [],
		public framesLeft: CharacterFrame[] = [],
		public framesRight: CharacterFrame[] = []
	) {}

	toInterface(): CharacterInterface {
		const character: CharacterInterface = {
			id: this.id,
			name: this.name,
			idAssetUp: this.idAssetUp,
			assetUpUrl: this.assetUpUrl,
			idAssetDown: this.idAssetDown,
			assetDownUrl: this.assetDownUrl,
			idAssetLeft: this.idAssetLeft,
			assetLeftUrl: this.assetLeftUrl,
			idAssetRight: this.idAssetRight,
			assetRightUrl: this.assetRightUrl,
			type: this.type,
			health: this.health,
			attack: this.attack,
			defense: this.defense,
			speed: this.speed,
			dropIdItem: this.dropIdItem,
			dropAssetUrl: this.dropAssetUrl,
			dropChance: this.dropChance,
			respawn: this.respawn,
			framesUp: [],
			framesDown: [],
			framesLeft: [],
			framesRight: []
		};
		for (let characterFrame of this.framesUp) {
			character.framesUp.push(characterFrame.toInterface());
		}
		for (let characterFrame of this.framesDown) {
			character.framesDown.push(characterFrame.toInterface());
		}
		for (let characterFrame of this.framesLeft) {
			character.framesLeft.push(characterFrame.toInterface());
		}
		for (let characterFrame of this.framesRight) {
			character.framesRight.push(characterFrame.toInterface());
		}
		return character;
	}
}
