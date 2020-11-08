import { Injectable }         from '@angular/core';
import { PlayCanvas }         from '../play/play-canvas.class';
import { PlayScenario }       from '../play/play-scenario.class';
import { PlayPlayer }         from '../play/play-player.class';
import { PlayNPC }            from '../play/play-npc.class';
import { PlayHud }            from '../play/play-hud.class';
import { AssetCache }         from '../play/asset-cache.class';
import { PlayObject }         from '../play/play-object.class';
import { ScenarioData }       from '../model/scenario-data.model';
import { Character }          from '../model/character.model';
import { Position }           from '../model/position.model';
import { Game }               from '../model/game.model';
import { Key }                from '../model/key.model';
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

	makeScenario(canvas: PlayCanvas, mapBackground: HTMLImageElement, blockers: Position[]) {
		return new PlayScenario(canvas, mapBackground, blockers);
	}

	makePlayer(game: Game, width: number, height: number, blockWidth: number, blockHeight: number, scenario: PlayScenario, connections) {
		const playPlayer        = new PlayPlayer(game.positionX, game.positionY, width, height, blockWidth, blockHeight, scenario);
		const character         = new Character();
		character.name          = game.name;
		character.attack        = game.attack;
		character.defense       = game.defense;
		character.health        = game.maxHealth;
		character.currentHealth = game.health;
		character.money         = game.money;
		character.speed         = game.speed;
		character.inventory     = game.items;
		character.type          = -1;
		playPlayer.character    = character;
		playPlayer.connections  = connections;
		playPlayer.orientation  = game.orientation;
		return playPlayer;
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
		po.addObjectSprites(assets);

		return po;
	}

	makePlayNPC(c: CharacterInterface, data: ScenarioData, scenario: PlayScenario, assets: AssetCache) {
		const character = this.cms.getCharacter(c);
		character.currentHealth = data.characterHealth;
		const playNPC = new PlayNPC(
			data.x,
			data.y,
			data.characterWidth,
			data.characterHeight,
			data.characterBlockWidth,
			data.characterBlockHeight,
			scenario,
			character,
			data.id
		);
		playNPC.addCharacterSprites(assets);
		// Death sprites
		playNPC.addSprite('death', assets.get('/assets/play/death-1.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-1.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-2.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-2.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-3.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-3.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-4.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-4.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-5.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-5.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-6.png'));
		playNPC.addSprite('death', assets.get('/assets/play/death-6.png'));

		return playNPC;
	}

	makeHud(health: number, currentHealth: number, money: number, canvas: PlayCanvas, assets: AssetCache) {
		return new PlayHud(health, currentHealth, money, canvas, assets);
	}

	keyboard(keyCode: string): Key {
		const key = new Key(keyCode);

		window.addEventListener('keydown', key.downHandler.bind(key), false);
		window.addEventListener('keyup',   key.upHandler.bind(key),   false);
		return key;
	}

	removeKeyboard(key: Key) {
		window.removeEventListener('keydown', key.downHandler, false);
		window.removeEventListener('keyup',   key.upHandler,   false);
	}
}
