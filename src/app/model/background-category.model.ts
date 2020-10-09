import { BackgroundCategoryInterface } from '../interfaces/interfaces';

export class BackgroundCategory {
	constructor(
		public id: number = null,
		public name: string = null
	) {}
	
	toInterface(): BackgroundCategoryInterface {
		const backgroundCategory: BackgroundCategoryInterface = {
			id: this.id,
			name: this.name
		};
		return backgroundCategory;
	}
}