import { TagInterface } from '../interfaces/interfaces';

export class Tag {
	constructor(
		public id: number = null,
		public name: string = null
	) {}
	
	toInterface(): TagInterface {
		const tag: TagInterface = {
			id: this.id,
			name: this.name
		};
		return tag;
	}
}