import Constants from '@app/constants';
import Position from '@model/position.model';
import PlayCanvas from '@play/play-canvas.class';
import PlayCharacter from '@play/play-character.class';
import PlayConnection from '@play/play-connection.class';
import PlayNPC from '@play/play-npc.class';
import PlayObject from '@play/play-object.class';
import PlayPlayer from '@play/play-player.class';
import { EventDispatcher, IEvent } from 'strongly-typed-events';

export default class PlayScenario {
  debug: boolean = false;
  canvas: PlayCanvas;
  mapBackground: HTMLImageElement | null;
  player: PlayPlayer | null;
  objects: PlayObject[];
  npcs: PlayNPC[];
  blockers: Position[];

  private _onNPCAction: EventDispatcher<PlayScenario, PlayNPC> = new EventDispatcher<
    PlayScenario,
    PlayNPC
  >();
  private _onNPCDie: EventDispatcher<PlayScenario, PlayNPC> = new EventDispatcher<
    PlayScenario,
    PlayNPC
  >();
  private _onObjectAction: EventDispatcher<PlayScenario, PlayObject> = new EventDispatcher<
    PlayScenario,
    PlayObject
  >();
  private _onPlayerConnection: EventDispatcher<PlayScenario, PlayConnection> = new EventDispatcher<
    PlayScenario,
    PlayConnection
  >();
  private _onPlayerHit: EventDispatcher<PlayScenario, PlayNPC> = new EventDispatcher<
    PlayScenario,
    PlayNPC
  >();

  constructor(canvas: PlayCanvas, mapBackground: HTMLImageElement | null, blockers: Position[]) {
    // Creo el canvas
    this.canvas = canvas;
    this.mapBackground = mapBackground;

    // Inicializo objetos y personajes
    this.blockers = blockers;
    this.player = null;
    this.objects = [];
    this.npcs = [];
  }

  get ctx(): CanvasRenderingContext2D | null {
    return this.canvas.ctx;
  }

  findOnPosition(pos: Position, list: (PlayNPC | PlayObject)[]): PlayNPC | PlayObject | null {
    for (const item of list) {
      const startPosX: number = item.blockPos!.x! - Constants.NEXT_POS;
      const endPosX: number = startPosX + item.blockPos!.width! + Constants.NEXT_POS;
      const startPosY: number = item.blockPos!.y! - Constants.NEXT_POS;
      const endPosY: number = startPosY + item.blockPos!.height! + Constants.NEXT_POS;
      if (pos.x! > startPosX && pos.x! < endPosX && pos.y! > startPosY && pos.y! < endPosY) {
        return item;
      }
    }

    return null;
  }

  addPlayer(player: PlayPlayer): void {
    player.onAction.subscribe((c: PlayPlayer, position: Position): void => {
      const npc: PlayNPC = this.findOnPosition(position, this.npcs) as PlayNPC;
      if (npc !== null) {
        if (npc.npcData !== null && !npc.npcData.isEnemy) {
          this.player!.stop();
          this._onNPCAction.dispatch(this, npc);
        }
      } else {
        const object: PlayObject = this.findOnPosition(position, this.objects) as PlayObject;
        if (object !== null) {
          this.player!.stop();
          this._onObjectAction.dispatch(this, object);
        }
      }
    });
    player.onConnection.subscribe((c: PlayCharacter, connection: PlayConnection): void => {
      this.player!.stop();
      this._onPlayerConnection.dispatch(this, connection);
    });
    player.onHit.subscribe((c: PlayPlayer, position: Position): void => {
      const npc: PlayNPC = this.findOnPosition(position, this.npcs) as PlayNPC;
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
    npc.onDie.subscribe((): void => {
      this._onNPCDie.dispatch(this, npc);
    });
    this.npcs.push(npc);
  }

  render(): void {
    if (this.canvas.ctx !== null && this.mapBackground !== null) {
      this.canvas.ctx.drawImage(
        this.mapBackground,
        0,
        0,
        Constants.SCENARIO_WIDTH,
        Constants.SCENARIO_HEIGHT,
      );
    }
  }

  renderItems(): void {
    let list: (PlayPlayer | PlayObject | PlayNPC | null)[] = [];
    list.push(this.player);
    list = list.concat(this.objects);
    list = list.concat(this.npcs);
    list.sort(
      (
        a: PlayPlayer | PlayObject | PlayNPC | null,
        b: PlayPlayer | PlayObject | PlayNPC | null,
      ): number => {
        if (a === null) {
          return 1;
        }
        if (b === null) {
          return -1;
        }
        return a.blockPos!.y! - b.blockPos!.y!;
      },
    );

    list.forEach((item: PlayPlayer | PlayObject | PlayNPC | null): void => {
      if (item !== null && this.canvas.ctx !== null) {
        item.render(this.canvas.ctx);
      }
    });
  }
}
