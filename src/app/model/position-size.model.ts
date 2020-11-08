
import { Position }              from '../model/position.model';
import { PositionSizeInterface } from '../interfaces/interfaces';

export class PositionSize {
	constructor(
		public x: number = null,
		public y: number = null,
		public width: number = null,
		public height: number = null
	) {}

	getCenter(): Position {
		return new Position(
			this.x + (this.width / 2),
			this.y + (this.height / 2)
		);
	}

	distance(pos2: PositionSize): number {
		const obj1 = this.getCenter();
		const obj2 = pos2.getCenter();

		return Math.sqrt( Math.pow((obj2.x - obj1.x), 2) + Math.pow((obj2.y - obj1.y), 2));
	}

	toInterface(): PositionSizeInterface {
		const positionSize: PositionSizeInterface = {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};
		return positionSize;
	}
}
