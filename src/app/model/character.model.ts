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
		public respawn: number = null,
		public frames: CharacterFrame[] = []
	) {}

	getAllFramesByOrientation(orientation: number) {
		const frameList = this.frames.filter(x => x.orientation==orientation);
		frameList.sort(function(a, b) {
			return a.order - b.order;
		});
		return frameList;
	}

	get allFramesUp() {		
		return this.getAllFramesByOrientation(1);
	}

	get allFramesRight() {		
		return this.getAllFramesByOrientation(2);
	}

	get allFramesDown() {		
		return this.getAllFramesByOrientation(3);
	}

	get allFramesLeft() {		
		return this.getAllFramesByOrientation(4);
	}

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
			respawn: this.respawn,
			frames: []
		};
		for (let characterFrame of this.frames) {
			character.frames.push(characterFrame.toInterface());
		}
		return character;
	}
}
