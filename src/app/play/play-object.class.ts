import { Constants }      from '../model/constants';
import { ScenarioObject } from '../model/scenario-object.model';
import { AssetCache }     from './asset-cache.class';

export class PlayObject {
	blockPos;
	object: ScenarioObject;
	currentFrame: number;
	interval: number;
	assets: AssetCache;
	playing: boolean;

	constructor(x: number, y: number, width: number, height: number, object: ScenarioObject) {
		this.blockPos = {
			x: x * Constants.TILE_WIDTH,
			y: (y * Constants.TILE_HEIGHT) - ((height-1) * Constants.TILE_HEIGHT),
			width: width * Constants.TILE_WIDTH,
			height: height * Constants.TILE_HEIGHT
		};
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
		ctx.drawImage(frameImg, this.blockPos.x, this.blockPos.y, this.blockPos.width, this.blockPos.height);
		if (Constants.DEBUG) {
			ctx.strokeStyle = '#00f';
			ctx.lineWidth = 1;
			ctx.strokeRect(this.blockPos.x, this.blockPos.y, this.blockPos.width, this.blockPos.height);
		}
	}
}
