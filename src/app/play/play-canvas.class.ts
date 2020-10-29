import { Constants } from '../model/constants';

export class PlayCanvas {
	canvas;
	ctx;

	constructor() {
		document.querySelector('.game').innerHTML = '';
		this.canvas = document.createElement('canvas');
		this.canvas.id = 'board';
		this.canvas.className = 'board';
		this.canvas.width = Constants.SCENARIO_WIDTH;
		this.canvas.height = Constants.SCENARIO_HEIGHT;
		document.querySelector('.game').appendChild(this.canvas);

		this.ctx = this.canvas.getContext('2d');
	}
}
