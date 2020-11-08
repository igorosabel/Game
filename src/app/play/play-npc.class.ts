import { PlayCharacter } from './play-character.class';
import { PlayScenario }  from './play-scenario.class';
import { PlayUtils }     from './play-utils.class';
import { Character }     from '../model/character.model';

export class PlayNPC extends PlayCharacter {
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		blockWidth:number,
		blockHeight: number,
		scenario: PlayScenario,
		character: Character,
		idScenarioData: number
	) {
		super(x, y, width, height, blockWidth, blockHeight, scenario);
		this.character = character;
		this.idScenarioData = idScenarioData;
		this.npcData.isNPC = true;
		if (this.character.type==1) {
			this.npcData.isEnemy = true;
		}
	}

	npcLogic() {
		if (this.npcData.isNPC && !this.character.fixedPosition && !this.dying) {
			clearTimeout(this.npcData.timer);
			this.npcData.remainingTime--;
			const distance = this.scenario.player.blockPos.distance(this.blockPos);
			if (distance > 250) {
				this.npcData.status = 'wandering';
			}

			if (this.npcData.status=='wandering' && this.npcData.remainingTime<1) {
				const movementOptions = ['down', 'up', 'left', 'right'];
				const currentInd = movementOptions.findIndex(x => x===this.orientation);
				movementOptions.splice(currentInd, 1);
				const option = movementOptions[Math.floor(Math.random() * movementOptions.length)];
				this.stopNPC();
				this.orientation = option;
				switch (option) {
					case 'up': { this.up(); }
					break;
					case 'down': { this.down(); }
					break;
					case 'left': { this.left(); }
					break;
					case 'right': { this.right(); }
					break;
				}
				this.npcData.remainingTime = Math.floor(Math.random() * 6) + 3;
			}

			this.npcData.timer = setTimeout(() => { this.npcLogic(); }, 1000);
		}
	}

	die() {
		this.dying = true;
		this.currentDieFrame = 0;
		clearTimeout(this.npcData.timer);
		this.stopNPC();
		this.playAnimation();
	}
}