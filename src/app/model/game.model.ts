import { GameInterface } from '../interfaces/interfaces';

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
		public speed: number = null
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
			speed: this.speed
		};
		return game;
	}
}
