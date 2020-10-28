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
		return new PlayCharacter(x, y, width, height, blockWidth, blockHeight, options, scenario);
	}

	makePlayObject(object: ScenarioObject, datas: ScenarioData[], assets: AssetCache) {
		const ind = datas.findIndex(x => x.idScenarioObject===object.id);
		const po = new PlayObject(
			datas[ind].x,
			datas[ind].y,
			datas[ind].scenarioObjectWidth,
			datas[ind].scenarioObjectHeight,
			object
		);
		po.assets = assets;

		return po;
	}

	makePlayCharacter(character: Character, datas: ScenarioData[], scenario: PlayScenario, assets: AssetCache) {
		const ind = datas.findIndex(x => x.idCharacter===character.id);
		const playCharacter = new PlayCharacter(
			datas[ind].x,
			datas[ind].y,
			datas[ind].characterWidth,
			datas[ind].characterHeight,
			datas[ind].characterBlockWidth,
			datas[ind].characterBlockHeight,
			{
				name: character.name,
				isNPC: true,
				health: character.health,
				currentHealth: character.health,
				money: 0,
				speed: character.speed,
				items: []
			},
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
		playCharacter.narratives = character.narratives;

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
			upHandler: undefined
		};

		key.downHandler = function(event) {
			if (event.keyCode === key.code) {
				if (key.isUp && key.press) { key.press(); }
				key.isDown = true;
				key.isUp = false;
			}
			event.preventDefault();
		};
		key.upHandler = function(event) {
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
}
