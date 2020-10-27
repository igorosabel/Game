import { Injectable }       from '@angular/core';
import { PlayCanvas }       from '../play/play-canvas.class';
import { PlayScenario }     from '../play/play-scenario.class';
import { PlayPlayer }       from '../play/play-player.class';
import { PlayHud }          from '../play/play-hud.class';
import { AssetCache }       from '../play/asset-cache.class';
import { BlockerInterface } from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class PlayService {
	constructor() {}

	makeCanvas() {
		return new PlayCanvas();
	}

	makeScenario(canvas: PlayCanvas, mapBackground, blockers: BlockerInterface[]) {
		return new PlayScenario(canvas, mapBackground, blockers);
	}

	makePlayer(pos, size, options, scenario) {
		return new PlayPlayer(pos, size, options, scenario);
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
