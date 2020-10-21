import { NarrativeInterface } from '../interfaces/interfaces';

export class Narrative {
	constructor(
		public id: number = null,
		public dialog: string = null,
		public order: number = null
	) {}

	toInterface(): NarrativeInterface {
		const narrative: NarrativeInterface = {
			id: this.id,
			dialog: this.dialog,
			order: this.order
		};
		return narrative;
	}
}