import { CharacterInterface } from '../interfaces/interfaces';
import { CharacterFrame }     from './character-frame.model';
import { Narrative }          from './narrative.model';
import { Item }               from './item.model';
import { Inventory }          from './inventory.model';

export class Character {
	currentHealth: number = null;
	money: number = null;
	items: Item[] = null;
	inventory: Inventory[] = null;

	constructor(
		public id: number = null,
		public name: string = null,
		public width: number = null,
		public blockWidth: number = null,
		public height: number = null,
		public blockHeight: number = null,
		public fixedPosition: boolean = false,
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
		public framesRight: CharacterFrame[] = [],
		public narratives: Narrative[] = []
	) {
		this.currentHealth = health;
		this.money = 0;
		this.items = [];
		this.inventory = [];
	}

	getAllFrames(sent: string) {
		const frameList = [];
		frameList.push(this['asset'+sent+'Url']);
		for (let frame of this['frames'+sent]) {
			frameList.push(frame.assetUrl);
		}
		return frameList;
	}

	get allFramesUp() {
		return this.getAllFrames('Up');
	}

	get allFramesDown() {
		return this.getAllFrames('Down');
	}

	get allFramesLeft() {
		return this.getAllFrames('Left');
	}

	get allFramesRight() {
		return this.getAllFrames('Right');
	}

	toInterface(): CharacterInterface {
		const character: CharacterInterface = {
			id: this.id,
			name: this.name,
			width: this.width,
			blockWidth: this.blockWidth,
			height: this.height,
			blockHeight: this.blockHeight,
			fixedPosition: this.fixedPosition,
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
			framesRight: [],
			narratives: []
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
		for (let narrative of this.narratives) {
			character.narratives.push(narrative.toInterface());
		}
		return character;
	}
}
