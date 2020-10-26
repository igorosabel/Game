import { Component, OnInit }  from '@angular/core';
import { Game }               from '../../../model/game.model';
import { ScenarioData }       from '../../../model/scenario-data.model';
import { ScenarioObject }     from '../../../model/scenario-object.model';
import { Character }          from '../../../model/character.model';
import { AssetCache }         from '../../../play/asset-cache.class';
import { PlayCanvas }         from '../../../play/play-canvas.class';
import { PlayScenario }       from '../../../play/play-scenario.class';
import { PlayPlayer }         from '../../../play/play-player.class';
import { PlayObject }         from '../../../play/play-object.class';
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
	game: Game = null;
	assetCache: AssetCache = new AssetCache();
	scenario: PlayScenario = null;
	blockers: BlockerInterface[] = [];
	mapBackground: string = null;
	scenarioDatas: ScenarioData[] = [];
	scenarioObjects: ScenarioObject[] = [];
	characters: Character[] = [];
	player: PlayPlayer = null;
	hud = null;
	defaultVX: number = 3;
	defaultVY: number = 3;
	fps: number = 30;
	start: number = 0;
	frameDuration: number = null;

	constructor(
		private as: ApiService,
		private cms: ClassMapperService,
		private cs: CommonService,
		private dss: DataShareService,
		private play: PlayService
	) {}

	ngOnInit(): void {
		this.frameDuration = 1000 / this.fps;
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
			console.log(this.characters);

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

	updatePlayerAssets() {
		this.player.sprites['up'] = [
			this.assetCache.get('/assets/player/link-up.png'),
			this.assetCache.get('/assets/player/up-walking-1.png'),
			this.assetCache.get('/assets/player/up-walking-2.png'),
			this.assetCache.get('/assets/player/up-walking-3.png'),
			this.assetCache.get('/assets/player/up-walking-4.png'),
			this.assetCache.get('/assets/player/up-walking-5.png'),
			this.assetCache.get('/assets/player/up-walking-6.png'),
			this.assetCache.get('/assets/player/up-walking-7.png')
		];
		this.player.sprites['down'] = [
			this.assetCache.get('/assets/player/link-down.png'),
			this.assetCache.get('/assets/player/down-walking-1.png'),
			this.assetCache.get('/assets/player/down-walking-2.png'),
			this.assetCache.get('/assets/player/down-walking-3.png'),
			this.assetCache.get('/assets/player/down-walking-4.png'),
			this.assetCache.get('/assets/player/down-walking-5.png'),
			this.assetCache.get('/assets/player/down-walking-6.png'),
			this.assetCache.get('/assets/player/down-walking-7.png')
		];
		this.player.sprites['left'] = [
			this.assetCache.get('/assets/player/link-left.png'),
			this.assetCache.get('/assets/player/left-walking-1.png'),
			this.assetCache.get('/assets/player/left-walking-2.png'),
			this.assetCache.get('/assets/player/left-walking-3.png'),
			this.assetCache.get('/assets/player/left-walking-4.png'),
			this.assetCache.get('/assets/player/left-walking-5.png'),
			this.assetCache.get('/assets/player/left-walking-6.png'),
			this.assetCache.get('/assets/player/left-walking-7.png')
		];
		this.player.sprites['right'] = [
			this.assetCache.get('/assets/player/link-right.png'),
			this.assetCache.get('/assets/player/right-walking-1.png'),
			this.assetCache.get('/assets/player/right-walking-2.png'),
			this.assetCache.get('/assets/player/right-walking-3.png'),
			this.assetCache.get('/assets/player/right-walking-4.png'),
			this.assetCache.get('/assets/player/right-walking-5.png'),
			this.assetCache.get('/assets/player/right-walking-6.png'),
			this.assetCache.get('/assets/player/right-walking-7.png')
		];
	}

	setup() {
		const canvas: PlayCanvas = this.play.makeCanvas();
		this.scenario = this.play.makeScenario(canvas, this.assetCache.get(this.mapBackground));
		this.scenario.blockers = this.blockers;

		this.scenarioObjects.forEach(object => {
			this.scenario.addObject( this.cms.getPlayObject(object, this.scenarioDatas, this.assetCache, this.frameDuration) );
		});

		this.player = this.play.makePlayer(
			{
				x: this.game.positionX * this.scenario.tileWidth,
				y: this.game.positionY * this.scenario.tileHeight
			},
			{
				width: this.scenario.tileWidth,
				height: (this.scenario.tileHeight * 1.5)
			},
			{
				name: this.game.name,
				health: this.game.maxHealth,
				currentHealth: this.game.health,
				money: this.game.money,
				speed: this.game.speed,
				items: this.game.items
			},
			{
				scenario: this.scenario,
				frameDuration: this.frameDuration,
				defaultVX: this.defaultVX,
				defaultVY: this.defaultVY
			}
		);
		this.updatePlayerAssets();

		this.hud = this.play.makeHud(this.player.health, this.player.currentHealth, this.player.money, canvas, this.assetCache);

		// Pinto escenario
		this.scenario.render();
		this.player.render();
		this.scenario.renderObjects();
		this.hud.render();

		// Eventos de teclado

		// W - Arriba
		let up = this.play.keyboard(87);
		up.press = () => { this.player.up() };
		up.release = () => { this.player.stopUp() };

		// S - Abajo
		let down = this.play.keyboard(83);
		down.press = () => { this.player.down() };
		down.release = () => { this.player.stopDown() };

		// D - Derecha
		let right = this.play.keyboard(68);
		right.press = () => { this.player.right() };
		right.release = () => { this.player.stopRight() };

		// A - Izquierda
		let left = this.play.keyboard(65);
		left.press = () => { this.player.left() };
		left.release = () => { this.player.stopLeft() };

		// E - Acción
		let doAction = this.play.keyboard(69);
		doAction.press = () => { this.player.doAction() };
		doAction.release = () => { this.player.stopAction() };

		// Espacio - Golpe
		let hit = this.play.keyboard(32);
		hit.press = () => { this.player.hit() };
		hit.release = () => { this.player.stopHit() };

		// Bucle del juego
		this.gameLoop();
	}

	gameLoop(timestamp: number = 0) {
		requestAnimationFrame(this.gameLoop.bind(this));
		if (timestamp >= this.start) {
			this.scenario.render();
			this.player.move();
			this.player.render();
			this.scenario.renderObjects();
			this.hud.render();

			this.start = timestamp + this.frameDuration;
		}
	}
}
