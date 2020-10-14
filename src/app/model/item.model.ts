import { ItemInterface, ItemFrameInterface } from '../interfaces/interfaces';
import { ItemFrame } from './item-frame.model';

export class Item {
	constructor(
		public id: number = null,
		public type: number = null,
		public idAsset: number = null,
		public assetUrl: string = null,
		public name: string = null,
		public money: number = null,
		public health: number = null,
		public attack: number = null,
		public defense: number = null,
		public speed: number = null,
		public wearable: number = null,
		public frames: ItemFrame[] = []
	) {}

	get allFrames() {
		const frameList = [];
		frameList.push(this.assetUrl);
		for (let frame of this.frames) {
			frameList.push(frame.assetUrl);
		}
		return frameList;
	}

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
		for (let itemFrame of this.frames) {
			item.frames.push(itemFrame.toInterface());
		}
		return item;
	}
}
