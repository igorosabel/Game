import { PlayConnectionInterface } from '../interfaces/interfaces';

export class PlayConnection {
	constructor(
		public to: number = null,
		public x: number = null,
		public y: number = null
	) {}

	toInterface(): PlayConnectionInterface {
		const playConnection: PlayConnectionInterface = {
			to: this.to,
			x: this.x,
			y: this.y
		};
		return playConnection;
	}
}
