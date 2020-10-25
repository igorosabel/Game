export class PlayCanvas {
	canvas;
	ctx;

	constructor(
		width: number = 800,
		height: number = 600,
		border: string = '1px dashed black',
		backgroundColor: string = 'white'
	) {
		this.canvas = document.createElement('canvas');
		this.canvas.id = 'board';
		this.canvas.className = 'board';
		this.canvas.width = width;
		this.canvas.height = height;
		this.canvas.style.border = border;
		this.canvas.style.backgroundColor = backgroundColor;
		document.querySelector('.game').appendChild(this.canvas);

		this.ctx = this.canvas.getContext('2d');
	}
}
