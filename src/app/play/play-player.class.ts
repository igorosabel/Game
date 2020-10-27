import { PlayCharacter } from './play-character.class';

export class PlayPlayer extends PlayCharacter {
	constructor(pos, size, options, scenario) {
		super(pos, size);
		this.setDetail(
			options.name,
			false,
			options.health,
			options.currentHealth,
			options.money,
			options.speed,
			options.items
		);
		this.scenario = scenario;
	}
}
