import { ItemFrameInterface } from '../interfaces/interfaces';

export class ItemFrame {
	constructor(
		public id: number = null,
		public idAsset: number = null,
		public assetUrl: string = null,
		public order: number = null
	) {}

	toInterface(): ItemFrameInterface {
		const itemFrame: ItemFrameInterface = {
			id: this.id,
			idAsset: this.idAsset,
			assetUrl: this.assetUrl,
			order: this.order
		};
		return itemFrame;
	}
}
