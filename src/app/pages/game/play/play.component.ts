import { Component, OnInit }  from '@angular/core';
import { Game }               from '../../../model/game.model';
import { AssetCache }         from '../../../play/asset-cache.class';
import { PlayCanvas }         from '../../../play/play-canvas.class';
import { PlayScenario }       from '../../../play/play-scenario.class';
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
	game: Game = null;
	assetCache: AssetCache = new AssetCache();
	scenario: PlayScenario = null;
	player = null;
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
			this.assetCache.addScenarioObjects(this.cms.getScenarioObjects(result.scenarioObjects));
			this.assetCache.addCharacters(this.cms.getCharacters(result.characters));
			this.assetCache.load().then(() => this.setup());
		});
	}

	setup() {
		const canvas: PlayCanvas = this.play.makeCanvas();
		this.scenario = this.play.makeScenario(canvas);
		this.player = this.play.makePlayer(
			{
				x: this.game.positionX * this.scenario.tileWidth,
				y: this.game.positionY * this.scenario.tileHeight
			}, {
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
		this.hud = this.play.makeHud(this.player.health, this.player.currentHealth, this.player.money, canvas);

		// Pinto escenario
		this.scenario.render();
		this.player.render();
		this.hud.render();

		// Eventos de teclado

		// W - Arriba
		let up = this.play.keyboard(87);
		up.press = () => this.player.up();
		up.release = () => this.player.stopUp();

		// S - Abajo
		let down = this.play.keyboard(83);
		down.press = () => this.player.down();
		down.release = () => this.player.stopDown();

		// D - Derecha
		let right = this.play.keyboard(68);
		right.press = () => this.player.right();
		right.release = () => this.player.stopRight();

		// A - Izquierda
		let left = this.play.keyboard(65);
		left.press = () => this.player.left();
		left.release = () => this.player.stopLeft();

		// E - Acción
		let doAction = this.play.keyboard(69);
		doAction.press = () => this.player.doAction();
		doAction.release = () => this.player.stopAction();

		// Espacio - Golpe
		let hit = this.play.keyboard(32);
		hit.press = () => this.player.hit();
		hit.release = () => this.player.stopHit();

		// Bucle del juego
		this.gameLoop();
	}

	gameLoop(timestamp: number = 0) {
		requestAnimationFrame(this.gameLoop);
		if (timestamp >= this.start) {
			this.scenario.render();
			this.player.move();
			this.player.render();
			this.hud.render();

			this.start = timestamp + this.frameDuration;
		}
	}
}
