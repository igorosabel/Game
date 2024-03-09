import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Constants } from 'src/app/constants';
import {
  KeyboardLayoutInterface,
  PlayResult,
} from 'src/app/interfaces/game.interfaces';
import {
  LoadingStatusInterface,
  StatusIdResult,
  StatusResult,
} from 'src/app/interfaces/interfaces';
import {
  ConnectionListInterface,
  ConnectionResult,
} from 'src/app/interfaces/scenario.interfaces';
import { WorldResult } from 'src/app/interfaces/world.interfaces';
import { Character } from 'src/app/model/character.model';
import { Connection } from 'src/app/model/connection.model';
import { Game } from 'src/app/model/game.model';
import { Inventory } from 'src/app/model/inventory.model';
import { Position } from 'src/app/model/position.model';
import { ScenarioData } from 'src/app/model/scenario-data.model';
import { ScenarioObject } from 'src/app/model/scenario-object.model';
import { World } from 'src/app/model/world.model';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';
import { InventoryComponent } from 'src/app/modules/shared/components/inventory/inventory.component';
import { Utils } from 'src/app/modules/shared/utils.class';
import { AssetCache } from 'src/app/play/asset-cache.class';
import { PlayCanvas } from 'src/app/play/play-canvas.class';
import { PlayConnection } from 'src/app/play/play-connection.class';
import { PlayHud } from 'src/app/play/play-hud.class';
import { PlayNPC } from 'src/app/play/play-npc.class';
import { PlayObject } from 'src/app/play/play-object.class';
import { PlayPlayer } from 'src/app/play/play-player.class';
import { PlayScenario } from 'src/app/play/play-scenario.class';
import { PlayUtils } from 'src/app/play/play-utils.class';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { PlayService } from 'src/app/services/play.service';

@Component({
  standalone: true,
  selector: 'game-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  imports: [NgClass, FormsModule, HeaderComponent, InventoryComponent],
})
export default class PlayComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  allLoaded: LoadingStatusInterface = {
    assets: false,
    unlockedWorlds: false,
    connections: false,
  };
  gameId: number = null;
  worldId: number = null;
  scenarioId: number = null;
  assetCache: AssetCache = new AssetCache();

  game: Game = new Game();
  scenario: PlayScenario = null;
  blockers: Position[] = [];
  mapBackground: string = null;
  scenarioDatas: ScenarioData[] = [];
  scenarioObjects: ScenarioObject[] = [];
  characters: Character[] = [];
  connections: ConnectionListInterface = {
    up: null,
    down: null,
    left: null,
    right: null,
  };

  hud: PlayHud = null;
  start: number = 0;
  playerUpdateTimer: number = null;

  keyboard: KeyboardLayoutInterface = {
    down: null,
    up: null,
    left: null,
    right: null,
    doAction: null,
    openInventory: null,
    hit: null,
    esc: null,
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

  @ViewChild('inventory', { static: false }) inventory: InventoryComponent;

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    private dss: DataShareService,
    private play: PlayService
  ) {}

  ngOnInit(): void {
    this.getPlayData();
  }

  getPlayData(): void {
    this.gameId = this.dss.getGlobal('idGame');
    this.as.getPlayData(this.gameId).subscribe((result: PlayResult): void => {
      this.worldId = result.idWorld;
      this.scenarioId = result.idScenario;
      this.game = this.cms.getGame(result.game);
      this.blockers = this.cms.getPositions(result.blockers);
      this.mapBackground = Utils.urldecode(result.mapBackground);
      this.scenarioDatas = this.cms.getScenarioDatas(result.scenarioDatas);
      this.scenarioObjects = this.cms.getScenarioObjects(
        result.scenarioObjects
      );
      this.characters = this.cms.getCharacters(result.characters);

      // Inventory
      for (
        let i: number = this.game.items.length;
        i < Constants.INVENTORY_SIZE;
        i++
      ) {
        this.game.items.push(new Inventory());
      }

      // Background
      this.assetCache.add(this.mapBackground);

      // Hud
      this.assetCache.add('/assets/hud/heart_empty.png');
      this.assetCache.add('/assets/hud/heart_full.png');
      this.assetCache.add('/assets/hud/heart_half.png');
      this.assetCache.add('/assets/hud/money.png');

      // Equipment
      this.assetCache.addEquipment(this.game.equipment);

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

      this.assetCache.load().then((): void => {
        this.allLoaded.assets = true;
        this.checkAllLoaded();
      });

      this.as
        .getUnlockedWorlds(this.gameId)
        .subscribe((result: WorldResult): void => {
          this.unlockedWorlds = this.cms.getWorlds(result.list);
          this.allLoaded.unlockedWorlds = true;
          this.checkAllLoaded();
        });
      this.as
        .getScenarioConnections(this.scenarioId)
        .subscribe((result: ConnectionResult): void => {
          this.connections = {
            up: null,
            down: null,
            left: null,
            right: null,
          };
          const connections: Connection[] = this.cms.getConnections(
            result.list
          );
          for (const connection of connections) {
            this.connections[connection.orientation] = connection;
          }
          this.allLoaded.connections = true;
          this.checkAllLoaded();
        });
    });
  }

  checkAllLoaded(): void {
    if (
      this.allLoaded.assets &&
      this.allLoaded.unlockedWorlds &&
      this.allLoaded.connections
    ) {
      this.setup();
    }
  }

  loadPlayerAssets(): void {
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

  updatePlayerAssets(player: PlayPlayer): PlayPlayer {
    player.sprites['up'] = [
      this.assetCache.get('/assets/player/link-up.png'),
      this.assetCache.get('/assets/player/up-walking-1.png'),
      this.assetCache.get('/assets/player/up-walking-2.png'),
      this.assetCache.get('/assets/player/up-walking-3.png'),
      this.assetCache.get('/assets/player/up-walking-4.png'),
      this.assetCache.get('/assets/player/up-walking-5.png'),
      this.assetCache.get('/assets/player/up-walking-6.png'),
      this.assetCache.get('/assets/player/up-walking-7.png'),
    ];
    player.sprites['down'] = [
      this.assetCache.get('/assets/player/link-down.png'),
      this.assetCache.get('/assets/player/down-walking-1.png'),
      this.assetCache.get('/assets/player/down-walking-2.png'),
      this.assetCache.get('/assets/player/down-walking-3.png'),
      this.assetCache.get('/assets/player/down-walking-4.png'),
      this.assetCache.get('/assets/player/down-walking-5.png'),
      this.assetCache.get('/assets/player/down-walking-6.png'),
      this.assetCache.get('/assets/player/down-walking-7.png'),
    ];
    player.sprites['left'] = [
      this.assetCache.get('/assets/player/link-left.png'),
      this.assetCache.get('/assets/player/left-walking-1.png'),
      this.assetCache.get('/assets/player/left-walking-2.png'),
      this.assetCache.get('/assets/player/left-walking-3.png'),
      this.assetCache.get('/assets/player/left-walking-4.png'),
      this.assetCache.get('/assets/player/left-walking-5.png'),
      this.assetCache.get('/assets/player/left-walking-6.png'),
      this.assetCache.get('/assets/player/left-walking-7.png'),
    ];
    player.sprites['right'] = [
      this.assetCache.get('/assets/player/link-right.png'),
      this.assetCache.get('/assets/player/right-walking-1.png'),
      this.assetCache.get('/assets/player/right-walking-2.png'),
      this.assetCache.get('/assets/player/right-walking-3.png'),
      this.assetCache.get('/assets/player/right-walking-4.png'),
      this.assetCache.get('/assets/player/right-walking-5.png'),
      this.assetCache.get('/assets/player/right-walking-6.png'),
      this.assetCache.get('/assets/player/right-walking-7.png'),
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
      this.assetCache.get('/assets/player/up-hit-9.png'),
    ];
    player.sprites['hit-down'] = [
      this.assetCache.get('/assets/player/down-hit-1.png'),
      this.assetCache.get('/assets/player/down-hit-2.png'),
      this.assetCache.get('/assets/player/down-hit-3.png'),
      this.assetCache.get('/assets/player/down-hit-4.png'),
      this.assetCache.get('/assets/player/down-hit-5.png'),
      this.assetCache.get('/assets/player/down-hit-6.png'),
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
      this.assetCache.get('/assets/player/left-hit-9.png'),
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
      this.assetCache.get('/assets/player/right-hit-9.png'),
    ];

    return player;
  }

  setup(): void {
    const canvas: PlayCanvas = this.play.makeCanvas();
    this.scenario = this.play.makeScenario(
      canvas,
      this.assetCache.get(this.mapBackground),
      this.blockers
    );
    this.scenario.blockers = this.blockers;

    this.scenarioDatas.forEach((data: ScenarioData): void => {
      let ind: number = null;
      if (data.idScenarioObject !== null) {
        ind = this.scenarioObjects.findIndex(
          (x: ScenarioObject): boolean => x.id === data.idScenarioObject
        );
        this.scenario.addObject(
          this.play.makePlayObject(
            this.scenarioObjects[ind].toInterface(),
            data,
            this.assetCache
          )
        );
      }
      if (data.idCharacter !== null) {
        ind = this.characters.findIndex(
          (x: Character): boolean => x.id === data.idCharacter
        );
        this.scenario.addNPC(
          this.play.makePlayNPC(
            this.characters[ind].toInterface(),
            data,
            this.scenario,
            this.assetCache
          )
        );
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
    this.scenario.onNPCAction.subscribe(
      (c: PlayScenario, npc: PlayNPC): void => {
        this.openNarratives(npc);
      }
    );
    this.scenario.onNPCDie.subscribe((c: PlayScenario, npc: PlayNPC): void => {
      this.enemyKilled(npc);
    });
    this.scenario.onObjectAction.subscribe(
      (c: PlayScenario, object: PlayObject): void => {
        this.activateObject(object);
      }
    );
    this.scenario.onPlayerConnection.subscribe(
      (c: PlayScenario, connection: PlayConnection): void => {
        this.changeScenario(connection);
      }
    );
    this.scenario.onPlayerHit.subscribe(
      (c: PlayScenario, npc: PlayNPC): void => {
        this.playerHit(npc);
      }
    );

    this.hud = this.play.makeHud(
      player.character.health,
      player.character.currentHealth,
      player.character.money,
      canvas,
      this.assetCache
    );

    // Pinto escenario
    this.scenario.render();
    this.scenario.renderItems();
    this.scenario.npcs.forEach((npc: PlayNPC): void => npc.npcLogic());
    this.hud.render();

    // Eventos de teclado
    this.disableKeyboard(false);
    this.setupKeyboard();

    // Bucle del juego
    this.gameLoop();
    this.loading = false;
    this.playerUpdateTimer = window.setInterval(
      this.updatePlayerPosition.bind(this),
      Constants.PLAYER_UPDATE_TIME
    );
  }

  gameLoop(timestamp: number = 0): void {
    requestAnimationFrame(this.gameLoop.bind(this));
    if (timestamp >= this.start) {
      this.scenario.render();
      this.scenario.player.move();
      this.scenario.npcs.forEach((npc: PlayNPC): boolean => npc.move());
      this.scenario.renderItems();
      this.hud.render();

      this.start = timestamp + Constants.FRAME_DURATION;
    }
  }

  setupKeyboard(): void {
    if (
      this.keyboard.up === null &&
      this.keyboard.down === null &&
      this.keyboard.right === null &&
      this.keyboard.left === null &&
      this.keyboard.doAction === null &&
      this.keyboard.openInventory === null &&
      this.keyboard.hit === null &&
      this.keyboard.esc === null
    ) {
      // W - Arriba
      this.keyboard.up = this.play.keyboard('w');
      this.keyboard.up.press = (): void => {
        if (!this.showOver) {
          this.scenario.player.up();
        }
      };
      this.keyboard.up.release = (): void => {
        if (!this.showOver) {
          this.scenario.player.stopUp();
        }
      };

      // S - Abajo
      this.keyboard.down = this.play.keyboard('s');
      this.keyboard.down.press = (): void => {
        if (!this.showOver) {
          this.scenario.player.down();
        }
      };
      this.keyboard.down.release = (): void => {
        if (!this.showOver) {
          this.scenario.player.stopDown();
        }
      };

      // D - Derecha
      this.keyboard.right = this.play.keyboard('d');
      this.keyboard.right.press = (): void => {
        if (!this.showOver) {
          this.scenario.player.right();
        }
      };
      this.keyboard.right.release = (): void => {
        if (!this.showOver) {
          this.scenario.player.stopRight();
        }
      };

      // A - Izquierda
      this.keyboard.left = this.play.keyboard('a');
      this.keyboard.left.press = (): void => {
        if (!this.showOver) {
          this.scenario.player.left();
        }
      };
      this.keyboard.left.release = (): void => {
        if (!this.showOver) {
          this.scenario.player.stopLeft();
        }
      };

      // E - Acción
      this.keyboard.doAction = this.play.keyboard('e');
      this.keyboard.doAction.press = (): void => {
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

      // I - Inventario
      this.keyboard.openInventory = this.play.keyboard('i');
      this.keyboard.openInventory.press = (): void => {
        if (this.inventory.isOpened()) {
          this.closeInventory(true);
          return;
        }
        if (!this.showOver) {
          this.openInventory();
        }
      };

      // Espacio - Golpe
      this.keyboard.hit = this.play.keyboard(' ');
      this.keyboard.hit.press = (): void => {
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
      this.keyboard.esc = this.play.keyboard('Escape');
      this.keyboard.esc.press = (): void => {
        this.showNarratives = false;
        this.showPortal = false;
        this.showMessage = false;
        this.showOver = false;
        this.disableKeyboard(false);
        this.inventory.close();
      };
    } else {
      this.play.removeKeyboard(this.keyboard.up);
      this.play.removeKeyboard(this.keyboard.down);
      this.play.removeKeyboard(this.keyboard.right);
      this.play.removeKeyboard(this.keyboard.left);
      this.play.removeKeyboard(this.keyboard.doAction);
      this.play.removeKeyboard(this.keyboard.openInventory);
      this.play.removeKeyboard(this.keyboard.hit);
      this.play.removeKeyboard(this.keyboard.esc);

      this.keyboard.up = null;
      this.keyboard.down = null;
      this.keyboard.right = null;
      this.keyboard.left = null;
      this.keyboard.doAction = null;
      this.keyboard.openInventory = null;
      this.keyboard.hit = null;
      this.keyboard.esc = null;

      this.setupKeyboard();
    }
  }

  disableKeyboard(mode: boolean): void {
    if (
      this.keyboard.up !== null &&
      this.keyboard.down !== null &&
      this.keyboard.right !== null &&
      this.keyboard.left !== null &&
      this.keyboard.doAction !== null &&
      this.keyboard.openInventory !== null &&
      this.keyboard.hit !== null &&
      this.keyboard.esc !== null
    ) {
      this.keyboard.up.disabled = mode;
      this.keyboard.down.disabled = mode;
      this.keyboard.right.disabled = mode;
      this.keyboard.left.disabled = mode;
      this.keyboard.doAction.disabled = mode;
      this.keyboard.openInventory.disabled = mode;
      this.keyboard.hit.disabled = mode;
      this.keyboard.esc.disabled = mode;
      if (!mode) {
        this.escKeyboard(mode);
      }
    }
  }

  escKeyboard(mode: boolean): void {
    if (
      this.keyboard.up !== null &&
      this.keyboard.down !== null &&
      this.keyboard.right !== null &&
      this.keyboard.left !== null &&
      this.keyboard.doAction !== null &&
      this.keyboard.openInventory !== null &&
      this.keyboard.hit !== null &&
      this.keyboard.esc !== null
    ) {
      this.keyboard.up.onlyEsc = mode;
      this.keyboard.down.onlyEsc = mode;
      this.keyboard.right.onlyEsc = mode;
      this.keyboard.left.onlyEsc = mode;
      this.keyboard.doAction.onlyEsc = mode;
      this.keyboard.openInventory.onlyEsc = mode;
      this.keyboard.hit.onlyEsc = mode;
      this.keyboard.esc.onlyEsc = mode;
    }
  }

  updatePlayerPosition(): void {
    const pos: Position = PlayUtils.getTile(
      new Position(
        this.scenario.player.blockPos.x,
        this.scenario.player.blockPos.y
      )
    );
    this.as
      .updatePosition(
        this.gameId,
        pos.x,
        pos.y,
        this.scenario.player.orientation
      )
      .subscribe((result: StatusResult): void => {
        if (result.status == 'error') {
          alert(
            '¡Ocurrió un error al actualizar la última posición del jugador!'
          );
        }
      });
  }

  openNarratives(character: PlayNPC): void {
    this.showOver = true;
    this.showNarratives = true;
    this.currentNarrative = 0;
    this.currentCharacter = character;
  }

  nextNarrative(): void {
    if (
      this.currentCharacter.character.narratives.length ==
      this.currentNarrative + 1
    ) {
      this.showNarratives = false;
      this.showOver = false;
      this.currentNarrative = 0;
    } else {
      this.currentNarrative++;
    }
  }

  closeMessage(): void {
    this.showMessage = false;
    this.showOver = false;
    this.disableKeyboard(false);
  }

  activateObject(playObject: PlayObject): void {
    if (playObject.object.activable) {
      // Portal
      if (
        playObject.object.activeTrigger == 1 &&
        playObject.object.activeTriggerCustom === null
      ) {
        this.portalWorld = new World();
        this.showPortal = true;
        this.showOver = true;
        this.escKeyboard(true);
      }
      // Mensaje
      if (
        playObject.object.activeTrigger == 0 &&
        playObject.object.activeTriggerCustom !== null
      ) {
        this.currentObject = playObject;
        this.showMessage = true;
        this.showOver = true;
      }
    }
  }

  portalActivate(): void {
    if (
      this.portalWorld.wordOne == null ||
      this.portalWorld.wordOne == '' ||
      this.portalWorld.wordTwo == null ||
      this.portalWorld.wordTwo == '' ||
      this.portalWorld.wordThree == null ||
      this.portalWorld.wordThree == ''
    ) {
      alert(
        'Tienes que introducir las tres palabras del mundo al que quieres viajar.'
      );
      return;
    }

    const currentWorldInd: number = this.unlockedWorlds.findIndex(
      (x: World): boolean => x.id === this.worldId
    );
    if (
      this.portalWorld.wordOne ==
        this.unlockedWorlds[currentWorldInd].wordOne ||
      this.portalWorld.wordTwo ==
        this.unlockedWorlds[currentWorldInd].wordTwo ||
      this.portalWorld.wordThree ==
        this.unlockedWorlds[currentWorldInd].wordThree
    ) {
      alert(
        'Las palabras introducidas corresponden al mundo en el que te encuentras ahora.'
      );
      return;
    }

    this.portalTravel(this.portalWorld);
  }

  closePortal(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.disableKeyboard(false);
    this.showPortal = false;
    this.showOver = false;
  }

  portalTravel(world: World): void {
    if (world.id === this.worldId) {
      return;
    }
    this.travelling = true;
    this.as
      .travel(
        this.gameId,
        world.id,
        world.wordOne,
        world.wordTwo,
        world.wordThree
      )
      .subscribe((result: StatusIdResult): void => {
        if (result.status !== 'ok') {
          alert('¡No existe ningún mundo con las palabras indicadas!');
        }
      });
  }

  openInventory(): void {
    this.showOver = true;
    this.escKeyboard(true);
    this.inventory.show();
  }

  closeInventory(ev: boolean): void {
    if (ev) {
      this.disableKeyboard(false);
      this.showOver = false;
    }
  }

  changeScenario(connection: PlayConnection): void {
    connection.idGame = this.gameId;
    this.loading = true;
    this.disableKeyboard(true);
    this.as
      .changeScenario(connection.toInterface())
      .subscribe((result: StatusResult): void => {
        if (result.status == 'ok') {
          this.getPlayData();
        } else {
          this.loading = false;
          alert('¡Ocurrió un error!');
        }
      });
  }

  playerHit(enemy: PlayNPC): void {
    if (enemy.dying) {
      return;
    }
    console.log(PlayUtils.getVector(this.scenario.player, enemy));
    enemy.character.currentHealth -=
      this.scenario.player.character.attack - enemy.character.defense;
    if (enemy.character.currentHealth < 1) {
      enemy.die();
    }

    //this.as.hitEnemy(this.gameId, enemy.idScenarioData).subscribe(result => {
    //console.log(result);
    //});
  }

  enemyKilled(enemy: PlayNPC): void {
    const ind: number = this.scenario.npcs.findIndex(
      (x: PlayNPC): boolean => x.idScenarioData === enemy.idScenarioData
    );
    this.scenario.npcs.splice(ind, 1);
  }

  ngOnDestroy(): void {
    clearInterval(this.playerUpdateTimer);
  }
}
