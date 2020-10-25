import { Injectable } from '@angular/core';
import { PlayScenario } from '../play/play-scenario.class';
import { PlayTile } from '../play/play-tile.class';
import { PlayPlayer } from '../play/play-player.class';

@Injectable({
	providedIn: 'root'
})
export class PlayService {
	constructor() {}

	makeCanvas(
		width = 800,
		height = 600,
		border = '1px dashed black',
		backgroundColor = 'white'
	) {
		const canvas = document.createElement('canvas');
		canvas.id = 'board';
		canvas.className = 'board';
		canvas.width = width;
		canvas.height = height;
		canvas.style.border = border;
		canvas.style.backgroundColor = backgroundColor;
		document.querySelector('.game').appendChild(canvas);

		canvas.ctx = canvas.getContext('2d');

		return canvas;
	}
	
	makeScenario(canvas, width = 800, height = 600, rows = 18, cols = 24) {
		return new PlayScenario(width, height, rows, cols);
	}
	
	makeTile(ind, pos, size) {
		return new PlayTile(ind, pos, size);
	}
	
	makePlayer(pos, size) {
		return new PlayPlayer(pos, size);
	}
}