import { Constants }      from '../model/constants';
import { ScenarioObject } from '../model/scenario-object.model';
import { AssetCache }     from './asset-cache.class';

export class PlayObject {
	x: number;
	y: number;
	width: number;
	height: number;
	object: ScenarioObject;
	currentFrame: number;
	interval: number;
	assets: AssetCache;
	playing: boolean;

	constructor(x: number, y: number, width: number, height: number, object: ScenarioObject) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.object = object;

		this.currentFrame = 0;
		this.playing = false;
		this.assets = null;
	}

	playAnimation() {
		if (!this.playing) {
			this.playing = true;
			this.interval = setInterval(this.updateAnimation.bind(this), Constants.FRAME_DURATION * 2);
		}
	}

	updateAnimation() {
		if (this.currentFrame === (this.object.allFrames.length - 1)) {
			this.currentFrame = 0;
		}
		else{
			this.currentFrame++;
		}
	}

	render(ctx) {
		this.playAnimation();
		const frameImg = this.assets.get(this.object.allFrames[this.currentFrame]);
		const posX = (this.x * Constants.TILE_WIDTH);
		const posY = (this.y * Constants.TILE_HEIGHT) - ((this.height-1) * Constants.TILE_HEIGHT);
		ctx.drawImage(frameImg, posX, posY, (this.width * Constants.TILE_WIDTH), (this.height * Constants.TILE_HEIGHT));
		if (Constants.DEBUG) {
			ctx.strokeStyle = '#f00';
			ctx.lineWidth = 1;
			ctx.strokeRect(posX, posY, (this.width * Constants.TILE_WIDTH), (this.height * Constants.TILE_HEIGHT));
		}
	}
}