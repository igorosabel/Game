import { Injectable }     from '@angular/core';
import { PlayCanvas }     from '../play/play-canvas.class';
import { PlayScenario }   from '../play/play-scenario.class';
import { PlayCharacter }  from '../play/play-character.class';
import { PlayHud }        from '../play/play-hud.class';
import { AssetCache }     from '../play/asset-cache.class';
import { PlayObject }     from '../play/play-object.class';
import { ScenarioData }   from '../model/scenario-data.model';
import { ScenarioObject } from '../model/scenario-object.model';
import { Character }      from '../model/character.model';
import { Position }       from '../model/position.model';

@Injectable({
	providedIn: 'root'
})
export class PlayService {
	constructor() {}

	makeCanvas() {
		return new PlayCanvas();
	}

	makeScenario(canvas: PlayCanvas, mapBackground, blockers: Position[]) {
		return new PlayScenario(canvas, mapBackground, blockers);
	}

	makePlayer(x, y, width, height, blockWidth, blockHeight, options, scenario) {
		const playCharacter     = new PlayCharacter(x, y, width, height, blockWidth, blockHeight, scenario);
		const character         = new Character();
		character.name          = options.name;
		character.health        = options.health;
		character.currentHealth = options.currentHealth;
		character.money         = options.money;
		character.speed         = options.speed;
		character.items         = options.items;
		playCharacter.character = character;
		return playCharacter;
	}

	makePlayObject(objects: ScenarioObject[], data: ScenarioData, assets: AssetCache) {
		const ind = objects.findIndex(x => x.id===data.idScenarioObject);
		const po = new PlayObject(
			data.x,
			data.y,
			data.scenarioObjectWidth,
			data.scenarioObjectHeight,
			objects[ind]
		);
		po.assets = assets;

		return po;
	}

	makePlayCharacter(characters: Character[], data: ScenarioData, scenario: PlayScenario, assets: AssetCache) {
		const ind = characters.findIndex(x => x.id===data.idCharacter);
		const playCharacter = new PlayCharacter(
			data.x,
			data.y,
			data.characterWidth,
			data.characterHeight,
			data.characterBlockWidth,
			data.characterBlockHeight,
			scenario
		);
		for (let frame of characters[ind].allFramesUp) {
			playCharacter.sprites['up'].push(assets.get(frame));
		}
		for (let frame of characters[ind].allFramesDown) {
			playCharacter.sprites['down'].push(assets.get(frame));
		}
		for (let frame of characters[ind].allFramesLeft) {
			playCharacter.sprites['left'].push(assets.get(frame));
		}
		for (let frame of characters[ind].allFramesRight) {
			playCharacter.sprites['right'].push(assets.get(frame));
		}
		playCharacter.character = characters[ind];
		playCharacter.npcData.isNPC = true;

		return playCharacter;
	}

	makeHud(health: number, currentHealth: number, money: number, canvas, assets: AssetCache) {
		return new PlayHud(health, currentHealth, money, canvas, assets);
	}

	keyboard(keyCode) {
		const key = {
			code: keyCode,
			isDown: false,
			isUp: true,
			press: undefined,
			release: undefined,
			downHandler: undefined,
			upHandler: undefined,
			disabled: false
		};

		key.downHandler = function(event) {
			if (this.disabled) { return; }
			if (event.keyCode === key.code) {
				if (key.isUp && key.press) { key.press(); }
				key.isDown = true;
				key.isUp = false;
			}
			event.preventDefault();
		};
		key.upHandler = function(event) {
			if (this.disabled) { return; }
			if (event.keyCode === key.code) {
				if (key.isDown && key.release) { key.release(); }
				key.isDown = false;
				key.isUp = true;
			}
			event.preventDefault();
		};

		window.addEventListener('keydown', key.downHandler.bind(key), false);
		window.addEventListener('keyup',   key.upHandler.bind(key),   false);
		return key;
	}

	removeKeyboard(key) {
		window.removeEventListener('keydown', key.downHandler, false);
		window.removeEventListener('keyup',   key.upHandler,   false);
	}
}
