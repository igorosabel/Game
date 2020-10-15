import { CharacterFrameInterface } from '../interfaces/interfaces';

export class CharacterFrame {
	constructor(
		public id: number = null,
		public idAsset: number = null,
		public assetUrl: string = null,
		public orientation: string = null,
		public order: number = null
	) {}

	toInterface(): CharacterFrameInterface {
		const characterFrame: CharacterFrameInterface = {
			id: this.id,
			idAsset: this.idAsset,
			assetUrl: this.assetUrl,
			orientation: this.orientation,
			order: this.order
		};
		return characterFrame;
	}
}
