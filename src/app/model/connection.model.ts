import { ConnectionInterface } from '../interfaces/interfaces';

export class Connection {
	constructor(
		public from: number = null,
		public fromName: string = null,
		public to: number = null,
		public toName: string = null,
		public orientation: string = null
	) {}

	toInterface(): ConnectionInterface {
		const connection: ConnectionInterface = {
			from: this.from,
			fromName: this.fromName,
			to: this.to,
			toName: this.toName,
			orientation: this.orientation
		};
		return connection;
	}
}
