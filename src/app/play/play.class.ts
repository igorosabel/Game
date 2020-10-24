export class Play {
	makeCanvas(
		width = 256,
		height = 256,
		border = '1px dashed black',
		backgroundColor = 'white'
	) {
		let canvas = document.createElement('canvas');
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
}
