import { EventDispatcher } from 'strongly-typed-events';
import { PlayCharacter }   from './play-character.class';
import { PlayScenario }    from './play-scenario.class';
import { PlayConnection }  from './play-connection.class';
import { Position }        from '../model/position.model';

export class PlayPlayer extends PlayCharacter {
	private _onAction     = new EventDispatcher<PlayPlayer, Position>();
	private _onHit        = new EventDispatcher<PlayPlayer, Position>();

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		blockWidth:number,
		blockHeight: number,
		scenario: PlayScenario
	) {
		super(x, y, width, height, blockWidth, blockHeight, scenario);
	}

	doAction() {
		this._onAction.dispatch(this, this.getNextPos());
	}

	public get onAction() {
		return this._onAction.asEvent();
	}

	hit() {
		if (!this.hitting) {
			this.hitting = true;
			this.playAnimation();
			this._onHit.dispatch(this, this.getNextPos());
		}
	}

	public get onHit() {
		return this._onHit.asEvent();
	}

	public get onConnection() {
		return this._onConnection.asEvent();
	}
}