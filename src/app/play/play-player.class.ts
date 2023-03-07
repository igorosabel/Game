import { Position } from 'src/app/model/position.model';
import { PlayCharacter } from 'src/app/play/play-character.class';
import { PlayConnection } from 'src/app/play/play-connection.class';
import { PlayScenario } from 'src/app/play/play-scenario.class';
import { EventDispatcher, IEvent } from 'strongly-typed-events';

export class PlayPlayer extends PlayCharacter {
  private _onAction: EventDispatcher<PlayPlayer, Position> =
    new EventDispatcher<PlayPlayer, Position>();
  private _onHit: EventDispatcher<PlayPlayer, Position> = new EventDispatcher<
    PlayPlayer,
    Position
  >();

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    blockWidth: number,
    blockHeight: number,
    scenario: PlayScenario
  ) {
    super(x, y, width, height, blockWidth, blockHeight, scenario);
  }

  doAction(): void {
    this._onAction.dispatch(this, this.getNextPos());
  }

  public get onAction(): IEvent<PlayPlayer, Position> {
    return this._onAction.asEvent();
  }

  hit(): void {
    if (!this.hitting) {
      this.hitting = true;
      this.playAnimation();
      this._onHit.dispatch(this, this.getNextPos());
    }
  }

  public get onHit(): IEvent<PlayPlayer, Position> {
    return this._onHit.asEvent();
  }

  public get onConnection(): IEvent<PlayCharacter, PlayConnection> {
    return this._onConnection.asEvent();
  }
}
