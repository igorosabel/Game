import { Component, OnInit }  from '@angular/core';
import { Constants }          from '../../../model/constants';
import { Game }               from '../../../model/game.model';
import { ScenarioData }       from '../../../model/scenario-data.model';
import { ScenarioObject }     from '../../../model/scenario-object.model';
import { Character }          from '../../../model/character.model';
import { Position }           from '../../../model/position.model';
import { World }              from '../../../model/world.model';
import { AssetCache }         from '../../../play/asset-cache.class';
import { PlayCanvas }         from '../../../play/play-canvas.class';
import { PlayScenario }       from '../../../play/play-scenario.class';
import { PlayCharacter }      from '../../../play/play-character.class';
import { PlayObject }         from '../../../play/play-object.class';
import { PlayHud }            from '../../../play/play-hud.class';
import { ApiService }         from '../../../services/api.service';
import { CommonService }      from '../../../services/common.service';
import { DataShareService }   from '../../../services/data-share.service';
import { ClassMapperService } from '../../../services/class-mapper.service';
import { PlayService }        from '../../../services/play.service';

@Component({
	selector: 'game-play',
	templateUrl: './play.component.html',
	styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
	gameId: number = null;
	assetCache: AssetCache = new AssetCache();

	game: Game = null;
	scenario: PlayScenario = null;
	blockers: Position[] = [];
	mapBackground: string = null;
	scenarioDatas: ScenarioData[] = [];
	scenarioObjects: ScenarioObject[] = [];
	characters: Character[] = [];

	hud: PlayHud = null;
	start: number = 0;

	showNarratives: boolean = false;
	currentCharacter: PlayCharacter = null;
	currentNarrative: number = 0;

	showPortal: boolean = false;
	portalWorld: World = new World();

	constructor(
		private as: ApiService,
		private cms: ClassMapperService,
		private cs: CommonService,
		private dss: DataShareService,
		private play: PlayService
	) {}

	ngOnInit(): void {
		this.getPlayData();
	}

	getPlayData() {
		this.gameId = this.dss.getGlobal('idGame');
		this.as.getPlayData(this.gameId).subscribe(result => {
			this.game = this.cms.getGame(result.game);
			this.blockers = this.cms.getPositions(result.blockers);
			this.mapBackground = this.cs.urldecode(result.mapBackground);
			this.scenarioDatas = this.cms.getScenarioDatas(result.scenarioDatas);
			this.scenarioObjects = this.cms.getScenarioObjects(result.scenarioObjects);
			this.characters = this.cms.getCharacters(result.characters);

			// Background
			this.assetCache.add(this.mapBackground);
			// Hud
			this.assetCache.add('/assets/hud/heart_empty.png');
			this.assetCache.add('/assets/hud/heart_full.png');
			this.assetCache.add('/assets/hud/heart_half.png');
			this.assetCache.add('/assets/hud/money.png');
			// Player
			this.loadPlayerAssets();
			// Scenario objects
			this.assetCache.addScenarioObjects(this.scenarioObjects);
			// Characters
			this.assetCache.addCharacters(this.cms.getCharacters(result.characters));
			this.assetCache.load().then(() => this.setup());
		});
	}

	loadPlayerAssets() {
		this.assetCache.add('/assets/player/down-walking-1.png');
		this.assetCache.add('/assets/player/down-walking-2.png');
		this.assetCache.add('/assets/player/down-walking-3.png');
		this.assetCache.add('/assets/player/down-walking-4.png');
		this.assetCache.add('/assets/player/down-walking-5.png');
		this.assetCache.add('/assets/player/down-walking-6.png');
		this.assetCache.add('/assets/player/down-walking-7.png');
		this.assetCache.add('/assets/player/left-walking-1.png');
		this.assetCache.add('/assets/player/left-walking-2.png');
		this.assetCache.add('/assets/player/left-walking-3.png');
		this.assetCache.add('/assets/player/left-walking-4.png');
		this.assetCache.add('/assets/player/left-walking-5.png');
		this.assetCache.add('/assets/player/left-walking-6.png');
		this.assetCache.add('/assets/player/left-walking-7.png');
		this.assetCache.add('/assets/player/right-walking-1.png');
		this.assetCache.add('/assets/player/right-walking-2.png');
		this.assetCache.add('/assets/player/right-walking-3.png');
		this.assetCache.add('/assets/player/right-walking-4.png');
		this.assetCache.add('/assets/player/right-walking-5.png');
		this.assetCache.add('/assets/player/right-walking-6.png');
		this.assetCache.add('/assets/player/right-walking-7.png');
		this.assetCache.add('/assets/player/up-walking-1.png');
		this.assetCache.add('/assets/player/up-walking-2.png');
		this.assetCache.add('/assets/player/up-walking-3.png');
		this.assetCache.add('/assets/player/up-walking-4.png');
		this.assetCache.add('/assets/player/up-walking-5.png');
		this.assetCache.add('/assets/player/up-walking-6.png');
		this.assetCache.add('/assets/player/up-walking-7.png');
		this.assetCache.add('/assets/player/link-down.png');
		this.assetCache.add('/assets/player/link-left.png');
		this.assetCache.add('/assets/player/link-right.png');
		this.assetCache.add('/assets/player/link-up.png');
	}

	updatePlayerAssets(player: PlayCharacter) {
		player.sprites['up'] = [
			this.assetCache.get('/assets/player/link-up.png'),
			this.assetCache.get('/assets/player/up-walking-1.png'),
			this.assetCache.get('/assets/player/up-walking-2.png'),
			this.assetCache.get('/assets/player/up-walking-3.png'),
			this.assetCache.get('/assets/player/up-walking-4.png'),
			this.assetCache.get('/assets/player/up-walking-5.png'),
			this.assetCache.get('/assets/player/up-walking-6.png'),
			this.assetCache.get('/assets/player/up-walking-7.png')
		];
		player.sprites['down'] = [
			this.assetCache.get('/assets/player/link-down.png'),
			this.assetCache.get('/assets/player/down-walking-1.png'),
			this.assetCache.get('/assets/player/down-walking-2.png'),
			this.assetCache.get('/assets/player/down-walking-3.png'),
			this.assetCache.get('/assets/player/down-walking-4.png'),
			this.assetCache.get('/assets/player/down-walking-5.png'),
			this.assetCache.get('/assets/player/down-walking-6.png'),
			this.assetCache.get('/assets/player/down-walking-7.png')
		];
		player.sprites['left'] = [
			this.assetCache.get('/assets/player/link-left.png'),
			this.assetCache.get('/assets/player/left-walking-1.png'),
			this.assetCache.get('/assets/player/left-walking-2.png'),
			this.assetCache.get('/assets/player/left-walking-3.png'),
			this.assetCache.get('/assets/player/left-walking-4.png'),
			this.assetCache.get('/assets/player/left-walking-5.png'),
			this.assetCache.get('/assets/player/left-walking-6.png'),
			this.assetCache.get('/assets/player/left-walking-7.png')
		];
		player.sprites['right'] = [
			this.assetCache.get('/assets/player/link-right.png'),
			this.assetCache.get('/assets/player/right-walking-1.png'),
			this.assetCache.get('/assets/player/right-walking-2.png'),
			this.assetCache.get('/assets/player/right-walking-3.png'),
			this.assetCache.get('/assets/player/right-walking-4.png'),
			this.assetCache.get('/assets/player/right-walking-5.png'),
			this.assetCache.get('/assets/player/right-walking-6.png'),
			this.assetCache.get('/assets/player/right-walking-7.png')
		];

		return player;
	}

	setup() {
		const canvas: PlayCanvas = this.play.makeCanvas();
		this.scenario = this.play.makeScenario(canvas, this.assetCache.get(this.mapBackground), this.blockers);
		this.scenario.blockers = this.blockers;

		this.scenarioObjects.forEach(object => {
			this.scenario.addObject( this.play.makePlayObject(object, this.scenarioDatas, this.assetCache) );
		});

		this.characters.forEach(character => {
			this.scenario.addCharacter( this.play.makePlayCharacter(character, this.scenarioDatas, this.scenario, this.assetCache) );
		});

		let player: PlayCharacter = this.play.makePlayer(
			this.game.positionX,
			this.game.positionY,
			1,
			1.5,
			1,
			1,
			{
				name: this.game.name,
				isNPC: false,
				health: this.game.maxHealth,
				currentHealth: this.game.health,
				money: this.game.money,
				speed: this.game.speed,
				items: this.game.items
			},
			this.scenario
		);
		player = this.updatePlayerAssets(player);
		this.scenario.addPlayer(player);
		
		// Eventos de personajes y objetos
		this.scenario.onCharacterAction.subscribe((c, character) => { this.openNarratives(character) });
		this.scenario.onObjectAction.subscribe((c, object) => { this.activateObject(object) });

		this.hud = this.play.makeHud(player.health, player.currentHealth, player.money, canvas, this.assetCache);

		// Pinto escenario
		this.scenario.render();
		this.scenario.renderItems();
		this.hud.render();

		// Eventos de teclado
		this.setupKeyboard();

		// Bucle del juego
		this.gameLoop();
	}

	gameLoop(timestamp: number = 0) {
		requestAnimationFrame(this.gameLoop.bind(this));
		if (timestamp >= this.start) {
			this.scenario.render();
			this.scenario.player.move();
			this.scenario.renderItems();
			this.hud.render();

			this.start = timestamp + Constants.FRAME_DURATION;
		}
	}

	setupKeyboard() {
		// W - Arriba
		let up = this.play.keyboard(87);
		up.press = () => {
			if (!this.showNarratives) { this.scenario.player.up(); }
		};
		up.release = () => {
			if (!this.showNarratives) { this.scenario.player.stopUp(); }
		};

		// S - Abajo
		let down = this.play.keyboard(83);
		down.press = () => {
			if (!this.showNarratives) { this.scenario.player.down(); }
		};
		down.release = () => {
			if (!this.showNarratives) { this.scenario.player.stopDown(); }
		};

		// D - Derecha
		let right = this.play.keyboard(68);
		right.press = () => {
			if (!this.showNarratives) { this.scenario.player.right(); }
		};
		right.release = () => {
			if (!this.showNarratives) { this.scenario.player.stopRight(); }
		};

		// A - Izquierda
		let left = this.play.keyboard(65);
		left.press = () => {
			if (!this.showNarratives) { this.scenario.player.left(); }
		};
		left.release = () => {
			if (!this.showNarratives) { this.scenario.player.stopLeft(); }
		};

		// E - Acción
		let doAction = this.play.keyboard(69);
		doAction.press = () => {
			if (!this.showNarratives) {
				this.scenario.player.doAction();
			}
			else {
				this.nextNarrative();
			}
		};
		doAction.release = () => {
			if (!this.showNarratives) { this.scenario.player.stopAction(); }
		};

		// Espacio - Golpe
		let hit = this.play.keyboard(32);
		hit.press = () => {
			if (!this.showNarratives) {
				this.scenario.player.hit();
			}
			else {
				this.nextNarrative();
			}
		};
		hit.release = () => {
			if (!this.showNarratives) { this.scenario.player.stopHit(); }
		};
		
		// Escape - Cancelar
		let esc = this.play.keyboard(27);
		esc.press = () => {
			this.showNarratives = false;
			this.showPortal = false;
		};
	}

	openNarratives(character: PlayCharacter) {
		this.showNarratives = true;
		this.currentNarrative = 0;
		this.currentCharacter = character;
	}

	nextNarrative() {
		if (this.currentCharacter.narratives.length==(this.currentNarrative+1)) {
			this.showNarratives = false;
		}
		else {
			this.currentNarrative++;
		}
	}

	activateObject(playObject: PlayObject) {
		console.log(playObject);
		if (playObject.object.activable) {
			if (playObject.object.activeTrigger==1 && playObject.object.activeTriggerCustom===null) {
				this.portalWorld = new World();
				this.showPortal = true;
			}
		}
	}
}
