import { PlayCharacter } from './play-character.class';

export class PlayEnemy extends PlayCharacter {
	constructor(pos, size) {
		super(pos, size);
		this.isNpc = true;
	}
}