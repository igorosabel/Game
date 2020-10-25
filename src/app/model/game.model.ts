import { GameInterface } from '../interfaces/interfaces';
import { Inventory } from './inventory.model';

export class Game {
	constructor(
		public id: number = null,
		public name: string = null,
		public idScenario: number = null,
		public positionX: number = null,
		public positionY: number = null,
		public money: number = null,
		public health: number = null,
		public maxHealth: number = null,
		public attack: number = null,
		public defense: number = null,
		public speed: number = null,
		public items: Inventory[] = []
	) {}

	toInterface(): GameInterface {
		const game: GameInterface = {
			id: this.id,
			name: this.name,
			idScenario: this.idScenario,
			positionX: this.positionX,
			positionY: this.positionY,
			money: this.money,
			health: this.health,
			maxHealth: this.maxHealth,
			attack: this.attack,
			defense: this.defense,
			speed: this.speed,
			items: []
		};
		for (let item of this.items) {
			game.items.push(item.toInterface());
		}
		return game;
	}
}
