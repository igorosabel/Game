import { ConnectionInterface } from '../interfaces/interfaces';

export class Connection {
	constructor(
		public to: number = null,
		public toName: string = null,
		public orientation: string = null
	) {}

	toInterface(): ConnectionInterface {
		const connection: ConnectionInterface = {
			to: this.to,
			toName: this.toName,
			orientation: this.orientation
		};
		return connection;
	}
}
