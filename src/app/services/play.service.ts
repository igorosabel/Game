import { Injectable }         from '@angular/core';
import { PlayCanvas }         from '../play/play-canvas.class';
import { PlayScenario }       from '../play/play-scenario.class';
import { PlayCharacter }      from '../play/play-character.class';
import { PlayHud }            from '../play/play-hud.class';
import { AssetCache }         from '../play/asset-cache.class';
import { PlayObject }         from '../play/play-object.class';
import { ScenarioData }       from '../model/scenario-data.model';
import { ScenarioObject }     from '../model/scenario-object.model';
import { Character }          from '../model/character.model';
import { Position }           from '../model/position.model';
import { Game }               from '../model/game.model';
import { ClassMapperService } from './class-mapper.service';
import {
	CharacterInterface,
	ScenarioObjectInterface
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class PlayService {
	constructor(private cms: ClassMapperService) {}

	makeCanvas() {
		return new PlayCanvas();
	}

	makeScenario(canvas: PlayCanvas, mapBackground, blockers: Position[]) {
		return new PlayScenario(canvas, mapBackground, blockers);
	}

	makePlayer(game: Game, width, height, blockWidth, blockHeight, scenario, connections) {
		const playCharacter       = new PlayCharacter(game.positionX, game.positionY, width, height, blockWidth, blockHeight, scenario);
		const character           = new Character();
		character.name            = game.name;
		character.attack          = game.attack;
		character.defense         = game.defense;
		character.health          = game.maxHealth;
		character.currentHealth   = game.health;
		character.money           = game.money;
		character.speed           = game.speed;
		character.inventory       = game.items;
		playCharacter.character   = character;
		playCharacter.connections = connections;
		playCharacter.orientation = game.orientation;
		return playCharacter;
	}

	makePlayObject(so: ScenarioObjectInterface, data: ScenarioData, assets: AssetCache) {
		const scenarioObject = this.cms.getScenarioObject(so);
		const po = new PlayObject(
			data.x,
			data.y,
			data.scenarioObjectWidth,
			data.scenarioObjectHeight,
			scenarioObject
		);
		po.assets = assets;

		return po;
	}

	makePlayCharacter(c: CharacterInterface, data: ScenarioData, scenario: PlayScenario, assets: AssetCache) {
		const character = this.cms.getCharacter(c);
		character.currentHealth = data.characterHealth;
		const playCharacter = new PlayCharacter(
			data.x,
			data.y,
			data.characterWidth,
			data.characterHeight,
			data.characterBlockWidth,
			data.characterBlockHeight,
			scenario
		);
		for (let frame of character.allFramesUp) {
			playCharacter.sprites['up'].push(assets.get(frame));
		}
		for (let frame of character.allFramesDown) {
			playCharacter.sprites['down'].push(assets.get(frame));
		}
		for (let frame of character.allFramesLeft) {
			playCharacter.sprites['left'].push(assets.get(frame));
		}
		for (let frame of character.allFramesRight) {
			playCharacter.sprites['right'].push(assets.get(frame));
		}
		playCharacter.character = character;
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
			disabled: false,
			onlyEsc: false
		};

		key.downHandler = function(event) {
			if (this.disabled) { return; }
			if (this.onlyEsc && event.keyCode!==27) { return; }
			if (event.keyCode === key.code) {
				if (key.isUp && key.press) { key.press(); }
				key.isDown = true;
				key.isUp = false;
			}
			event.preventDefault();
		};
		key.upHandler = function(event) {
			if (this.disabled) { return; }
			if (this.onlyEsc && event.keyCode!==27) { return; }
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
