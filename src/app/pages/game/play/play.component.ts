import { Component, OnInit }  from '@angular/core';
import { AssetCache }         from '../../../play/asset-cache.class';
import { ApiService }         from '../../../services/api.service';
import { CommonService }      from '../../../services/common.service';
import { DataShareService }   from '../../../services/data-share.service';
import { ClassMapperService } from '../../../services/class-mapper.service';
import { PlayService } from '../../../services/play.service';
import { PlayScenario } from '../../../play/play-scenario.class';

@Component({
	selector: 'game-play',
	templateUrl: './play.component.html',
	styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
	gameId: number = null;
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
			console.log(result);
			this.assetCache.addScenarioObjects(this.cms.getScenarioObjects(result.scenarioObjects));
			this.assetCache.addCharacters(this.cms.getCharacters(result.characters));
			this.assetCache.load().then(() => this.setup());
		});
	}

	setup() {
		const canvas = this.play.makeCanvas();
		this.scenario = this.play.makeScenario(canvas);
		this.player = this.play.makePlayer(
			{
				x: startPos.x * this.scenario.tileWidth,
				y: startPos.y * this.scenario.tileHeight
			}, {
				width: this.scenario.tileWidth,
				height: (this.scenario.tileHeight * 1.5)
			}
		);
		hud = makeHud(player.health, player.currentHealth, player.money);
	
		// Cargo assets en el escenario
		assets.list.forEach(asset => {
			if (asset.type==='bck') {
				let bck = makeSprite(asset.image, asset.crossable);
				scenario.addBck({x: asset.x, y: asset.y}, bck);
			}
			if (asset.type==='spr') {
				let spr = makeSprite(asset.image, asset.crossable);
				scenario.addSpr({x: asset.x, y: asset.y}, spr);
			}
			if (asset.type==='player') {
				let fr = makeSprite(asset.image);
				let ind = asset.id.replace('player_', '');
				ind = ind.split('_').shift();
				player.setSprite(ind, fr);
			}
			if (asset.type==='hud') {
				let item = makeSprite(asset.image);
				hud.addSprite(asset.id, item);
			}
		});
	
		// Pinto escenario
		scenario.render();
		player.render();
		hud.render();
	
		// Eventos de teclado
	
		// W - Arriba
		let up = keyboard(87);
		up.press = () => player.up();
		up.release = () => player.stopUp();
	
		// S - Abajo
		let down = keyboard(83);
		down.press = () => player.down();
		down.release = () => player.stopDown();
	
		// D - Derecha
		let right = keyboard(68);
		right.press = () => player.right();
		right.release = () => player.stopRight();
	
		// A - Izquierda
		let left = keyboard(65);
		left.press = () => player.left();
		left.release = () => player.stopLeft();
		
		// E - Acción
		let doAction = keyboard(69);
		doAction.press = () => player.doAction();
		doAction.release = () => player.stopAction();
		
		// Espacio - Golpe
		let hit = keyboard(32);
		hit.press = () => player.hit();
		hit.release = () => player.stopHit();
	
		// Bucle del juego
		gameLoop();
	}
	
	function gameLoop(timestamp) {
		requestAnimationFrame(gameLoop);
		if (timestamp >= start) {
			scenario.render();
			player.move();
			player.render();
			hud.render();
	
			start = timestamp + frameDuration;
		}
	}
}
