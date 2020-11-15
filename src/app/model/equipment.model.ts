import { EquipmentInterface } from '../interfaces/interfaces';
import { Item } from '../model/item.model';

export class Equipment {
	constructor(
		public head: Item = null,
		public necklace: Item = null,
		public body: Item = null,
		public boots: Item = null,
		public weapon: Item = null
	) {}

	toInterface(): EquipmentInterface {
		return {
			head: (this.head===null) ? null : this.head.toInterface(),
			necklace: (this.necklace===null) ? null : this.necklace.toInterface(),
			body: (this.body===null) ? null : this.body.toInterface(),
			boots: (this.boots===null) ? null : this.boots.toInterface(),
			weapon: (this.weapon===null) ? null : this.weapon.toInterface()
		};
	}
}
