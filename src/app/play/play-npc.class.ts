import { PlayCharacter } from './play-character.class';

export class PlayNPC extends PlayCharacter {
	constructor(pos, size) {
		super(pos, size);
		this.setDetail(
			options.name,
			true,
			options.health,
			options.currentHealth,
			options.money,
			options.speed,
			options.items
		);
		this.setScenario(
			scenario.scenario,
			scenario.frameDuration,
			scenario.defaultVX,
			scenario.defaultVY
		);
	}
}
