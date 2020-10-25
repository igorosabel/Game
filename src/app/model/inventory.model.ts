import { InventoryInterface, ItemInterface } from '../interfaces/interfaces';
import { Item } from './item.model';

export class Inventory {
	constructor(
		public id: number = null,
		public idGame: number = null,
		public idItem: number = null,
		public item: Item = null,
		public order: number = null,
		public num: number = null
	) {}

	toInterface(): InventoryInterface {
		const inventory: InventoryInterface = {
			id: this.id,
			idGame: this.idGame,
			idItem: this.idItem,
			item: this.item.toInterface(),
			order: this.order,
			num: this.num
		};
		return inventory;
	}
}
