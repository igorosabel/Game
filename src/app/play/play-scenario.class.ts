import { EventDispatcher } from 'strongly-typed-events';
import { Constants }       from '../model/constants';
import { Position }        from '../model/position.model';
import { PlayCanvas }      from './play-canvas.class';
import { PlayObject }      from './play-object.class';
import { PlayCharacter }   from './play-character.class';
import { PlayConnection }  from './play-connection.class';

export class PlayScenario {
	debug: boolean;
	canvas: PlayCanvas;
	mapBackground;
	player: PlayCharacter;
	objects: PlayObject[];
	characters: PlayCharacter[];
	blockers: Position[];
	
	private _onCharacterAction = new EventDispatcher<PlayScenario, PlayCharacter>();
	private _onObjectAction = new EventDispatcher<PlayScenario, PlayObject>();
	private _onPlayerConnection = new EventDispatcher<PlayScenario, PlayConnection>();

	constructor(canvas: PlayCanvas, mapBackground, blockers: Position[]) {
		// Creo el canvas
		this.canvas = canvas;
		this.mapBackground = mapBackground;

		// Inicializo objetos y personajes
		this.blockers = blockers;
		this.player = null;
		this.objects = [];
		this.characters = [];
	}

	get ctx() {
		return this.canvas.ctx;
	}
	
	findOnPosition(pos: Position, list) {
		for (let item of list) {
			let startPosX = (item.pos.x - Constants.NEXT_POS);
			let endPosX = startPosX + item.size.width + Constants.NEXT_POS;
			let startPosY = (item.pos.y - Constants.NEXT_POS);
			let endPosY = startPosY + item.size.height + Constants.NEXT_POS;
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

	addPlayer(player: PlayCharacter) {
		player.onAction.subscribe((c, position) => {
			const character = this.findOnPosition(position, this.characters);
			if (character!==null) {
				this.player.stop();
				this._onCharacterAction.dispatch(this, character);
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
		this.player = player;
	}
	
	public get onCharacterAction() {
		return this._onCharacterAction.asEvent();
	}
	
	public get onObjectAction() {
		return this._onObjectAction.asEvent();
	}

	public get onPlayerConnection() {
		return this._onPlayerConnection.asEvent();
	}

	addObject(object: PlayObject) {
		this.objects.push(object);
	}

	addCharacter(character: PlayCharacter) {
		this.characters.push(character);
	}

	render() {
		this.canvas.ctx.drawImage(this.mapBackground, 0, 0, Constants.SCENARIO_WIDTH, Constants.SCENARIO_HEIGHT);
	}

	renderItems() {
		let list = [];
		list.push(this.player);
		list = list.concat(this.objects);
		list = list.concat(this.characters);
		list.sort((a, b) => a.blockPos.y - b.blockPos.y);

		list.forEach(item => {
			item.render(this.canvas.ctx);
		});
	}
}
