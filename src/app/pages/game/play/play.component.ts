import { Component, OnInit }  from '@angular/core';
import { Constants }          from '../../../constants';
import { Game }               from '../../../model/game.model';
import { ScenarioData }       from '../../../model/scenario-data.model';
import { ScenarioObject }     from '../../../model/scenario-object.model';
import { Character }          from '../../../model/character.model';
import { Position }           from '../../../model/position.model';
import { World }              from '../../../model/world.model';
import { AssetCache }         from '../../../play/asset-cache.class';
import { PlayCanvas }         from '../../../play/play-canvas.class';
import { PlayScenario }       from '../../../play/play-scenario.class';
import { PlayPlayer }         from '../../../play/play-player.class';
import { PlayNPC }            from '../../../play/play-npc.class';
import { PlayObject }         from '../../../play/play-object.class';
import { PlayConnection }     from '../../../play/play-connection.class';
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
	loading: boolean = true;
	allLoaded = {
		assets: false,
		unlockedWorlds: false,
		connections: false
	};
	gameId: number = null;
	worldId: number = null;
	scenarioId: number = null;
	assetCache: AssetCache = new AssetCache();

	game: Game = null;
	scenario: PlayScenario = null;
	blockers: Position[] = [];
	mapBackground: string = null;
	scenarioDatas: ScenarioData[] = [];
	scenarioObjects: ScenarioObject[] = [];
	characters: Character[] = [];
	connections = {
		up: null,
		down: null,
		left: null,
		right: null
	};

	hud: PlayHud = null;
	start: number = 0;

	keyboard = {
		down: null,
		up: null,
		left: null,
		right: null,
		doAction: null,
		hit: null,
		esc: null
	};

	showOver: boolean = false;

	showNarratives: boolean = false;
	currentCharacter: PlayNPC = null;
	currentNarrative: number = 0;

	showPortal: boolean = false;
	portalWorld: World = new World();
	unlockedWorlds: World[] = [];
	travelling: boolean = false;

	showMessage: boolean = false;
	currentObject: PlayObject = null;

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
			this.worldId = result.idWorld;
			this.scenarioId = result.idScenario;
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
			// Effects
			this.assetCache.add('/assets/play/death-1.png');
			this.assetCache.add('/assets/play/death-2.png');
			this.assetCache.add('/assets/play/death-3.png');
			this.assetCache.add('/assets/play/death-4.png');
			this.assetCache.add('/assets/play/death-5.png');
			this.assetCache.add('/assets/play/death-6.png');

			this.assetCache.load().then(() => {
				this.allLoaded.assets = true;
				this.checkAllLoaded();
			});

			this.as.getUnlockedWorlds(this.gameId).subscribe(result => {
				this.unlockedWorlds = this.cms.getWorlds(result.list);
				this.allLoaded.unlockedWorlds = true;
				this.checkAllLoaded();
			});
			this.as.getScenarioConnections(this.scenarioId).subscribe(result => {
				this.connections = {
					up: null,
					down: null,
					left: null,
					right: null
				};
				let connections = this.cms.getConnections(result.list);
				for (let connection of connections) {
					this.connections[connection.orientation] = connection;
				}
				this.allLoaded.connections = true;
				this.checkAllLoaded();
			});
		});
	}

	checkAllLoaded() {
		if (this.allLoaded.assets && this.allLoaded.unlockedWorlds && this.allLoaded.connections) {
			this.setup();
		}
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
		this.assetCache.add('/assets/player/down-hit-1.png');
		this.assetCache.add('/assets/player/down-hit-2.png');
		this.assetCache.add('/assets/player/down-hit-3.png');
		this.assetCache.add('/assets/player/down-hit-4.png');
		this.assetCache.add('/assets/player/down-hit-5.png');
		this.assetCache.add('/assets/player/down-hit-6.png');
		this.assetCache.add('/assets/player/left-hit-1.png');
		this.assetCache.add('/assets/player/left-hit-2.png');
		this.assetCache.add('/assets/player/left-hit-3.png');
		this.assetCache.add('/assets/player/left-hit-4.png');
		this.assetCache.add('/assets/player/left-hit-5.png');
		this.assetCache.add('/assets/player/left-hit-6.png');
		this.assetCache.add('/assets/player/left-hit-7.png');
		this.assetCache.add('/assets/player/left-hit-8.png');
		this.assetCache.add('/assets/player/left-hit-9.png');
		this.assetCache.add('/assets/player/right-hit-1.png');
		this.assetCache.add('/assets/player/right-hit-2.png');
		this.assetCache.add('/assets/player/right-hit-3.png');
		this.assetCache.add('/assets/player/right-hit-4.png');
		this.assetCache.add('/assets/player/right-hit-5.png');
		this.assetCache.add('/assets/player/right-hit-6.png');
		this.assetCache.add('/assets/player/right-hit-7.png');
		this.assetCache.add('/assets/player/right-hit-8.png');
		this.assetCache.add('/assets/player/right-hit-9.png');
		this.assetCache.add('/assets/player/up-hit-1.png');
		this.assetCache.add('/assets/player/up-hit-2.png');
		this.assetCache.add('/assets/player/up-hit-3.png');
		this.assetCache.add('/assets/player/up-hit-4.png');
		this.assetCache.add('/assets/player/up-hit-5.png');
		this.assetCache.add('/assets/player/up-hit-6.png');
		this.assetCache.add('/assets/player/up-hit-7.png');
		this.assetCache.add('/assets/player/up-hit-8.png');
		this.assetCache.add('/assets/player/up-hit-9.png');
	}

	updatePlayerAssets(player: PlayPlayer) {
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
		player.sprites['hit-up'] = [
			this.assetCache.get('/assets/player/up-hit-1.png'),
			this.assetCache.get('/assets/player/up-hit-2.png'),
			this.assetCache.get('/assets/player/up-hit-3.png'),
			this.assetCache.get('/assets/player/up-hit-4.png'),
			this.assetCache.get('/assets/player/up-hit-5.png'),
			this.assetCache.get('/assets/player/up-hit-6.png'),
			this.assetCache.get('/assets/player/up-hit-7.png'),
			this.assetCache.get('/assets/player/up-hit-8.png'),
			this.assetCache.get('/assets/player/up-hit-9.png')
		];
		player.sprites['hit-down'] = [
			this.assetCache.get('/assets/player/down-hit-1.png'),
			this.assetCache.get('/assets/player/down-hit-2.png'),
			this.assetCache.get('/assets/player/down-hit-3.png'),
			this.assetCache.get('/assets/player/down-hit-4.png'),
			this.assetCache.get('/assets/player/down-hit-5.png'),
			this.assetCache.get('/assets/player/down-hit-6.png')
		];
		player.sprites['hit-left'] = [
			this.assetCache.get('/assets/player/left-hit-1.png'),
			this.assetCache.get('/assets/player/left-hit-2.png'),
			this.assetCache.get('/assets/player/left-hit-3.png'),
			this.assetCache.get('/assets/player/left-hit-4.png'),
			this.assetCache.get('/assets/player/left-hit-5.png'),
			this.assetCache.get('/assets/player/left-hit-6.png'),
			this.assetCache.get('/assets/player/left-hit-7.png'),
			this.assetCache.get('/assets/player/left-hit-8.png'),
			this.assetCache.get('/assets/player/left-hit-9.png')
		];
		player.sprites['hit-right'] = [
			this.assetCache.get('/assets/player/right-hit-1.png'),
			this.assetCache.get('/assets/player/right-hit-2.png'),
			this.assetCache.get('/assets/player/right-hit-3.png'),
			this.assetCache.get('/assets/player/right-hit-4.png'),
			this.assetCache.get('/assets/player/right-hit-5.png'),
			this.assetCache.get('/assets/player/right-hit-6.png'),
			this.assetCache.get('/assets/player/right-hit-7.png'),
			this.assetCache.get('/assets/player/right-hit-8.png'),
			this.assetCache.get('/assets/player/right-hit-9.png')
		];

		return player;
	}

	setup() {
		const canvas: PlayCanvas = this.play.makeCanvas();
		this.scenario = this.play.makeScenario(canvas, this.assetCache.get(this.mapBackground), this.blockers);
		this.scenario.blockers = this.blockers;

		this.scenarioDatas.forEach(data => {
			let ind = null;
			if (data.idScenarioObject!==null) {
				ind = this.scenarioObjects.findIndex(x => x.id===data.idScenarioObject);
				this.scenario.addObject( this.play.makePlayObject(this.scenarioObjects[ind].toInterface(), data, this.assetCache) );
			}
			if (data.idCharacter!==null) {
				ind = this.characters.findIndex(x => x.id===data.idCharacter);
				this.scenario.addNPC( this.play.makePlayNPC(this.characters[ind].toInterface(), data, this.scenario, this.assetCache) );
			}
		});

		let player: PlayPlayer = this.play.makePlayer(
			this.game,
			1,
			1.5,
			1,
			1,
			this.scenario,
			this.connections
		);
		player = this.updatePlayerAssets(player);
		this.scenario.addPlayer(player);

		// Eventos de personajes y objetos
		this.scenario.onNPCAction.subscribe((c, npc) => { this.openNarratives(npc) });
		this.scenario.onNPCDie.subscribe((c, npc) => { this.enemyKilled(npc) });
		this.scenario.onObjectAction.subscribe((c, object) => { this.activateObject(object) });
		this.scenario.onPlayerConnection.subscribe((c, connection) => { this.changeScenario(connection) });
		this.scenario.onPlayerHit.subscribe((c, npc) => { this.playerHit(npc) });

		this.hud = this.play.makeHud(player.character.health, player.character.currentHealth, player.character.money, canvas, this.assetCache);

		// Pinto escenario
		this.scenario.render();
		this.scenario.renderItems();
		this.scenario.npcs.forEach(npc => npc.npcLogic());
		this.hud.render();

		// Eventos de teclado
		this.disableKeyboard(false);
		this.setupKeyboard();

		// Bucle del juego
		this.gameLoop();
		this.loading = false;
	}

	gameLoop(timestamp: number = 0) {
		requestAnimationFrame(this.gameLoop.bind(this));
		if (timestamp >= this.start) {
			this.scenario.render();
			this.scenario.player.move();
			this.scenario.npcs.forEach(npc => npc.move());
			this.scenario.renderItems();
			this.hud.render();

			this.start = timestamp + Constants.FRAME_DURATION;
		}
	}

	setupKeyboard() {
		if (
			this.keyboard.up===null &&
			this.keyboard.down===null &&
			this.keyboard.right===null &&
			this.keyboard.left===null &&
			this.keyboard.doAction===null &&
			this.keyboard.hit===null &&
			this.keyboard.esc===null
		) {
			// W - Arriba
			this.keyboard.up = this.play.keyboard(87);
			this.keyboard.up.press = () => {
				if (!this.showOver) { this.scenario.player.up(); }
			};
			this.keyboard.up.release = () => {
				if (!this.showOver) { this.scenario.player.stopUp(); }
			};

			// S - Abajo
			this.keyboard.down = this.play.keyboard(83);
			this.keyboard.down.press = () => {
				if (!this.showOver) { this.scenario.player.down(); }
			};
			this.keyboard.down.release = () => {
				if (!this.showOver) { this.scenario.player.stopDown(); }
			};

			// D - Derecha
			this.keyboard.right = this.play.keyboard(68);
			this.keyboard.right.press = () => {
				if (!this.showOver) { this.scenario.player.right(); }
			};
			this.keyboard.right.release = () => {
				if (!this.showOver) { this.scenario.player.stopRight(); }
			};

			// A - Izquierda
			this.keyboard.left = this.play.keyboard(65);
			this.keyboard.left.press = () => {
				if (!this.showOver) { this.scenario.player.left(); }
			};
			this.keyboard.left.release = () => {
				if (!this.showOver) { this.scenario.player.stopLeft(); }
			};

			// E - Acción
			this.keyboard.doAction = this.play.keyboard(69);
			this.keyboard.doAction.press = () => {
				if (this.showNarratives) {
					this.nextNarrative();
					return;
				}
				if (this.showMessage) {
					this.closeMessage();
					return;
				}
				if (!this.showOver) {
					this.scenario.player.doAction();
				}
			};

			// Espacio - Golpe
			this.keyboard.hit = this.play.keyboard(32);
			this.keyboard.hit.press = () => {
				if (this.showNarratives) {
					this.nextNarrative();
					return;
				}
				if (this.showMessage) {
					this.closeMessage();
					return;
				}
				if (!this.showOver) {
					this.scenario.player.hit();
				}
			};

			// Escape - Cancelar
			this.keyboard.esc = this.play.keyboard(27);
			this.keyboard.esc.press = () => {
				this.showNarratives = false;
				this.showPortal     = false;
				this.showMessage    = false;
				this.showOver       = false;
				this.disableKeyboard(false);
			};
		}
		else {
			this.play.removeKeyboard(this.keyboard.up);
			this.play.removeKeyboard(this.keyboard.down);
			this.play.removeKeyboard(this.keyboard.right);
			this.play.removeKeyboard(this.keyboard.left);
			this.play.removeKeyboard(this.keyboard.doAction);
			this.play.removeKeyboard(this.keyboard.hit);
			this.play.removeKeyboard(this.keyboard.esc);

			this.keyboard.up = null;
			this.keyboard.down = null;
			this.keyboard.right = null;
			this.keyboard.left = null;
			this.keyboard.doAction = null;
			this.keyboard.hit = null;
			this.keyboard.esc = null;

			this.setupKeyboard();
		}
	}

	disableKeyboard(mode: boolean) {
		if (
			this.keyboard.up!==null &&
			this.keyboard.down!==null &&
			this.keyboard.right!==null &&
			this.keyboard.left!==null &&
			this.keyboard.doAction!==null &&
			this.keyboard.hit!==null &&
			this.keyboard.esc!==null
		) {
			this.keyboard.up.disabled = mode;
			this.keyboard.down.disabled = mode;
			this.keyboard.right.disabled = mode;
			this.keyboard.left.disabled = mode;
			this.keyboard.doAction.disabled = mode;
			this.keyboard.hit.disabled = mode;
			this.keyboard.esc.disabled = mode;
			if (!mode) {
				this.escKeyboard(mode);
			}
		}
	}

	escKeyboard(mode: boolean) {
		if (
			this.keyboard.up!==null &&
			this.keyboard.down!==null &&
			this.keyboard.right!==null &&
			this.keyboard.left!==null &&
			this.keyboard.doAction!==null &&
			this.keyboard.hit!==null &&
			this.keyboard.esc!==null
		) {
			this.keyboard.up.onlyEsc = mode;
			this.keyboard.down.onlyEsc = mode;
			this.keyboard.right.onlyEsc = mode;
			this.keyboard.left.onlyEsc = mode;
			this.keyboard.doAction.onlyEsc = mode;
			this.keyboard.hit.onlyEsc = mode;
			this.keyboard.esc.onlyEsc = mode;
		}
	}

	openNarratives(character: PlayNPC) {
		this.showOver         = true;
		this.showNarratives   = true;
		this.currentNarrative = 0;
		this.currentCharacter = character;
	}

	nextNarrative() {
		if (this.currentCharacter.character.narratives.length==(this.currentNarrative+1)) {
			this.showNarratives   = false;
			this.showOver         = false;
			this.currentNarrative = 0;
		}
		else {
			this.currentNarrative++;
		}
	}

	closeMessage() {
		this.showMessage = false;
		this.showOver    = false;
		this.disableKeyboard(false);
	}

	activateObject(playObject: PlayObject) {
		if (playObject.object.activable) {
			// Portal
			if (playObject.object.activeTrigger==1 && playObject.object.activeTriggerCustom===null) {
				this.portalWorld = new World();
				this.showPortal = true;
				this.showOver   = true;
				this.escKeyboard(true);
			}
			// Mensaje
			if (playObject.object.activeTrigger==0 && playObject.object.activeTriggerCustom!==null) {
				this.currentObject = playObject;
				this.showMessage = true;
				this.showOver    = true;
			}
		}
	}

	portalActivate() {
		if (
			(this.portalWorld.wordOne==null || this.portalWorld.wordOne=='') ||
			(this.portalWorld.wordTwo==null || this.portalWorld.wordTwo=='') ||
			(this.portalWorld.wordThree==null || this.portalWorld.wordThree=='')
		) {
			alert('Tienes que introducir las tres palabras del mundo al que quieres viajar.');
			return;
		}

		let currentWorldInd = this.unlockedWorlds.findIndex(x => x.id===this.worldId);
		if (
			this.portalWorld.wordOne==this.unlockedWorlds[currentWorldInd].wordOne ||
			this.portalWorld.wordTwo==this.unlockedWorlds[currentWorldInd].wordTwo ||
			this.portalWorld.wordThree==this.unlockedWorlds[currentWorldInd].wordThree)
		{
			alert('Las palabras introducidas corresponden al mundo en el que te encuentras ahora.');
			return;
		}

		this.portalTravel(this.portalWorld);
	}

	portalClose(ev) {
		ev && ev.preventDefault();
		this.disableKeyboard(false);
		this.showPortal = false;
		this.showOver   = false;
	}

	portalTravel(world: World) {
		if (world.id===this.worldId){
			return;
		}
		this.travelling = true;
		this.as.travel(this.gameId, world.id, world.wordOne, world.wordTwo, world.wordThree).subscribe(result => {
			if  (result.status=='ok') {

			}
			else {
				alert('¡No existe ningún mundo con las palabras indicadas!');
			}
		});
	}

	changeScenario(connection: PlayConnection) {
		connection.idGame = this.gameId;
		this.loading = true;
		this.disableKeyboard(true);
		this.as.changeScenario(connection.toInterface()).subscribe(result => {
			if (result.status=='ok') {
				this.getPlayData();
			}
			else {
				this.loading = false;
				alert('¡Ocurrió un error!');
			}
		});
	}

	playerHit(enemy: PlayNPC) {
		enemy.character.currentHealth -= (this.scenario.player.character.attack - enemy.character.defense);
		if (enemy.character.currentHealth<1) {
			enemy.die();
		}

		//this.as.hitEnemy(this.gameId, enemy.idScenarioData).subscribe(result => {
			//console.log(result);
		//});
	}
	
	enemyKilled(enemy: PlayNPC) {
		const ind = this.scenario.npcs.findIndex(x => x.idScenarioData===enemy.idScenarioData);
		this.scenario.npcs.splice(ind, 1);
	}
}