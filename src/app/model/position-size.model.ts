import { PositionSizeInterface } from '../interfaces/interfaces';

export class PositionSize {
	constructor(
		public x: number = null,
		public y: number = null,
		public width: number = null,
		public height: number = null
	) {}

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
