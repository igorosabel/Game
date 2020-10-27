import { PositionInterface } from '../interfaces/interfaces';

export class Position {
	constructor(
		public x: number = null,
		public y: number = null
	) {}

	toInterface(): PositionInterface {
		const position: PositionInterface = {
			x: this.x,
			y: this.y
		};
		return position;
	}
}
