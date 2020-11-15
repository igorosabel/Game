import { GameInterface } from '../interfaces/interfaces';
import { Inventory }     from './inventory.model';
import { Equipment }     from './equipment.model';

export class Game {
	constructor(
		public id: number = null,
		public name: string = null,
		public idScenario: number = null,
		public positionX: number = null,
		public positionY: number = null,
		public orientation: string = null,
		public money: number = null,
		public health: number = null,
		public maxHealth: number = null,
		public attack: number = null,
		public defense: number = null,
		public speed: number = null,
		public items: Inventory[] = [],
		public equipment: Equipment = null
	) {}

	toInterface(): GameInterface {
		const game: GameInterface = {
			id: this.id,
			name: this.name,
			idScenario: this.idScenario,
			positionX: this.positionX,
			positionY: this.positionY,
			orientation: this.orientation,
			money: this.money,
			health: this.health,
			maxHealth: this.maxHealth,
			attack: this.attack,
			defense: this.defense,
			speed: this.speed,
			items: [],
			equipment: this.equipment.toInterface()
		};
		for (let item of this.items) {
			game.items.push(item.toInterface());
		}
		return game;
	}
}
