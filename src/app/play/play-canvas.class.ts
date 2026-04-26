import Constants from '@app/constants';

export default class PlayCanvas {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    const gameObj: Element | null = document.querySelector('.game');
    if (gameObj !== null) {
      gameObj.innerHTML = '';
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'board';
      this.canvas.className = 'board';
      this.canvas.width = Constants.SCENARIO_WIDTH;
      this.canvas.height = Constants.SCENARIO_HEIGHT;
      gameObj.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');
    }
  }
}
