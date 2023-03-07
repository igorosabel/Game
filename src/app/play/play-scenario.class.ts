import { Constants } from 'src/app/constants';
import { Position } from 'src/app/model/position.model';
import { PlayCanvas } from 'src/app/play/play-canvas.class';
import { PlayConnection } from 'src/app/play/play-connection.class';
import { PlayNPC } from 'src/app/play/play-npc.class';
import { PlayObject } from 'src/app/play/play-object.class';
import { PlayPlayer } from 'src/app/play/play-player.class';
import { EventDispatcher, IEvent } from 'strongly-typed-events';
import { PlayCharacter } from './play-character.class';

export class PlayScenario {
  debug: boolean;
  canvas: PlayCanvas;
  mapBackground: any;
  player: PlayPlayer;
  objects: PlayObject[];
  npcs: PlayNPC[];
  blockers: Position[];

  private _onNPCAction: EventDispatcher<PlayScenario, PlayNPC> =
    new EventDispatcher<PlayScenario, PlayNPC>();
  private _onNPCDie: EventDispatcher<PlayScenario, PlayNPC> =
    new EventDispatcher<PlayScenario, PlayNPC>();
  private _onObjectAction: EventDispatcher<PlayScenario, PlayObject> =
    new EventDispatcher<PlayScenario, PlayObject>();
  private _onPlayerConnection: EventDispatcher<PlayScenario, PlayConnection> =
    new EventDispatcher<PlayScenario, PlayConnection>();
  private _onPlayerHit: EventDispatcher<PlayScenario, PlayNPC> =
    new EventDispatcher<PlayScenario, PlayNPC>();

  constructor(canvas: PlayCanvas, mapBackground: any, blockers: Position[]) {
    // Creo el canvas
    this.canvas = canvas;
    this.mapBackground = mapBackground;

    // Inicializo objetos y personajes
    this.blockers = blockers;
    this.player = null;
    this.objects = [];
    this.npcs = [];
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.ctx;
  }

  findOnPosition(pos: Position, list: any): any {
    for (let item of list) {
      let startPosX: number = item.blockPos.x - Constants.NEXT_POS;
      let endPosX: number =
        startPosX + item.blockPos.width + Constants.NEXT_POS;
      let startPosY: number = item.blockPos.y - Constants.NEXT_POS;
      let endPosY: number =
        startPosY + item.blockPos.height + Constants.NEXT_POS;
      if (
        pos.x > startPosX &&
        pos.x < endPosX &&
        pos.y > startPosY &&
        pos.y < endPosY
      ) {
        return item;
      }
    }

    return null;
  }

  addPlayer(player: PlayPlayer): void {
    player.onAction.subscribe((c: PlayPlayer, position: Position): void => {
      const npc: any = this.findOnPosition(position, this.npcs);
      if (npc !== null) {
        if (!npc.npcData.isEnemy) {
          this.player.stop();
          this._onNPCAction.dispatch(this, npc);
        }
      } else {
        const object: PlayObject = this.findOnPosition(position, this.objects);
        if (object !== null) {
          this.player.stop();
          this._onObjectAction.dispatch(this, object);
        }
      }
    });
    player.onConnection.subscribe(
      (c: PlayCharacter, connection: PlayConnection): void => {
        this.player.stop();
        this._onPlayerConnection.dispatch(this, connection);
      }
    );
    player.onHit.subscribe((c: PlayPlayer, position: Position): void => {
      const npc: PlayNPC = this.findOnPosition(position, this.npcs);
      if (npc !== null) {
        this._onPlayerHit.dispatch(this, npc);
      }
    });
    this.player = player;
  }

  public get onNPCAction(): IEvent<PlayScenario, PlayNPC> {
    return this._onNPCAction.asEvent();
  }

  public get onNPCDie(): IEvent<PlayScenario, PlayNPC> {
    return this._onNPCDie.asEvent();
  }

  public get onObjectAction(): IEvent<PlayScenario, PlayObject> {
    return this._onObjectAction.asEvent();
  }

  public get onPlayerConnection(): IEvent<PlayScenario, PlayConnection> {
    return this._onPlayerConnection.asEvent();
  }

  public get onPlayerHit(): IEvent<PlayScenario, PlayNPC> {
    return this._onPlayerHit.asEvent();
  }

  addObject(object: PlayObject): void {
    this.objects.push(object);
  }

  addNPC(npc: PlayNPC): void {
    npc.onDie.subscribe((c: PlayCharacter, type: number): void => {
      this._onNPCDie.dispatch(this, npc);
    });
    this.npcs.push(npc);
  }

  render(): void {
    this.canvas.ctx.drawImage(
      this.mapBackground,
      0,
      0,
      Constants.SCENARIO_WIDTH,
      Constants.SCENARIO_HEIGHT
    );
  }

  renderItems(): void {
    let list: any = [];
    list.push(this.player);
    list = list.concat(this.objects);
    list = list.concat(this.npcs);
    list.sort((a: any, b: any): number => a.blockPos.y - b.blockPos.y);

    list.forEach((item: any): void => {
      item.render(this.canvas.ctx);
    });
  }
}
