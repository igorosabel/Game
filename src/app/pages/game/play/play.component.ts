import { Component, OnInit }  from '@angular/core';
import { Constants }          from '../../../model/constants';
import { Game }               from '../../../model/game.model';
import { ScenarioData }       from '../../../model/scenario-data.model';
import { ScenarioObject }     from '../../../model/scenario-object.model';
import { Character }          from '../../../model/character.model';
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
import { BlockerInterface }   from '../../../interfaces/interfaces';

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
	blockers: BlockerInterface[] = [];
	mapBackground: string = null;
	scenarioDatas: ScenarioData[] = [];
	scenarioObjects: ScenarioObject[] = [];
	characters: Character[] = [];

	hud: PlayHud = null;
	start: number = 0;

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
			this.blockers = result.blockers;
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
		this.scenario.player = player;

		this.hud = this.play.makeHud(player.health, player.currentHealth, player.money, canvas, this.assetCache);

		// Pinto escenario
		this.scenario.render();
		this.scenario.renderItems();
		this.hud.render();

		// Eventos de teclado

		// W - Arriba
		let up = this.play.keyboard(87);
		up.press = () => { player.up() };
		up.release = () => { player.stopUp() };

		// S - Abajo
		let down = this.play.keyboard(83);
		down.press = () => { player.down() };
		down.release = () => { player.stopDown() };

		// D - Derecha
		let right = this.play.keyboard(68);
		right.press = () => { player.right() };
		right.release = () => { player.stopRight() };

		// A - Izquierda
		let left = this.play.keyboard(65);
		left.press = () => { player.left() };
		left.release = () => { player.stopLeft() };

		// E - Acción
		let doAction = this.play.keyboard(69);
		doAction.press = () => { player.doAction() };
		doAction.release = () => { player.stopAction() };

		// Espacio - Golpe
		let hit = this.play.keyboard(32);
		hit.press = () => { player.hit() };
		hit.release = () => { player.stopHit() };

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
}
