import { BackgroundInterface } from '../interfaces/interfaces';

export class Background {
	constructor(
		public id: number = null,
		public idBackgroundCategory: number = null,
		public idAsset: number = null,
		public assetUrl: string = null,
		public name: string = null,
		public crossable: boolean = true
	) {}
	
	toInterface(): BackgroundInterface {
		const background: BackgroundInterface = {
			id: this.id,
			idBackgroundCategory: this.idBackgroundCategory,
			idAsset: this.idAsset,
			assetUrl: this.assetUrl,
			name: this.name,
			crossable: this.crossable
		};
		return background;
	}
}