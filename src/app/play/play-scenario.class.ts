import { EventDispatcher } from 'strongly-typed-events';
import { Constants }       from '../constants';
import { Position }        from '../model/position.model';
import { PlayCanvas }      from './play-canvas.class';
import { PlayObject }      from './play-object.class';
import { PlayPlayer }      from './play-player.class';
import { PlayNPC }         from './play-npc.class';
import { PlayConnection }  from './play-connection.class';

export class PlayScenario {
	debug: boolean;
	canvas: PlayCanvas;
	mapBackground: HTMLImageElement;
	player: PlayPlayer;
	objects: PlayObject[];
	npcs: PlayNPC[];
	blockers: Position[];

	private _onNPCAction        = new EventDispatcher<PlayScenario, PlayNPC>();
	private _onNPCDie           = new EventDispatcher<PlayScenario, PlayNPC>();
	private _onObjectAction     = new EventDispatcher<PlayScenario, PlayObject>();
	private _onPlayerConnection = new EventDispatcher<PlayScenario, PlayConnection>();
	private _onPlayerHit        = new EventDispatcher<PlayScenario, PlayNPC>();

	constructor(canvas: PlayCanvas, mapBackground: HTMLImageElement, blockers: Position[]) {
		// Creo el canvas
		this.canvas = canvas;
		this.mapBackground = mapBackground;

		// Inicializo objetos y personajes
		this.blockers = blockers;
		this.player = null;
		this.objects = [];
		this.npcs = [];
	}

	get ctx() {
		return this.canvas.ctx;
	}

	findOnPosition(pos: Position, list) {
		for (let item of list) {
			let startPosX = (item.blockPos.x - Constants.NEXT_POS);
			let endPosX = startPosX + item.blockPos.width + Constants.NEXT_POS;
			let startPosY = (item.blockPos.y - Constants.NEXT_POS);
			let endPosY = startPosY + item.blockPos.height + Constants.NEXT_POS;
			if (
				(pos.x > startPosX) &&
				(pos.x < endPosX) &&
				(pos.y > startPosY) &&
				(pos.y < endPosY)
			) {
				return item;
			}
		}

		return null;
	}

	addPlayer(player: PlayPlayer) {
		player.onAction.subscribe((c, position) => {
			const npc = this.findOnPosition(position, this.npcs);
			if (npc!==null) {
				if (!npc.npcData.isEnemy) {
					this.player.stop();
					this._onNPCAction.dispatch(this, npc);
				}
			}
			else {
				const object = this.findOnPosition(position, this.objects);
				if (object!==null) {
					this.player.stop();
					this._onObjectAction.dispatch(this, object);
				}
			}

		});
		player.onConnection.subscribe((c, connection) => {
			this.player.stop();
			this._onPlayerConnection.dispatch(this, connection);
		});
		player.onHit.subscribe((c, position) => {
			const npc = this.findOnPosition(position, this.npcs);
			if (npc!==null) {
				this._onPlayerHit.dispatch(this, npc);
			}
		});
		this.player = player;
	}

	public get onNPCAction() {
		return this._onNPCAction.asEvent();
	}

	public get onNPCDie() {
		return this._onNPCDie.asEvent();
	}

	public get onObjectAction() {
		return this._onObjectAction.asEvent();
	}

	public get onPlayerConnection() {
		return this._onPlayerConnection.asEvent();
	}

	public get onPlayerHit() {
		return this._onPlayerHit.asEvent();
	}

	addObject(object: PlayObject) {
		this.objects.push(object);
	}

	addNPC(npc: PlayNPC) {
		npc.onDie.subscribe((c, type) => {
			this._onNPCDie.dispatch(this, npc);
		});
		this.npcs.push(npc);
	}

	render() {
		this.canvas.ctx.drawImage(this.mapBackground, 0, 0, Constants.SCENARIO_WIDTH, Constants.SCENARIO_HEIGHT);
	}

	renderItems() {
		let list = [];
		list.push(this.player);
		list = list.concat(this.objects);
		list = list.concat(this.npcs);
		list.sort((a, b) => a.blockPos.y - b.blockPos.y);

		list.forEach(item => {
			item.render(this.canvas.ctx);
		});
	}
}
