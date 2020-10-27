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

	render(ctx, tileWidth: number, tileHeight: number) {
		this.playAnimation();
		const frameImg = this.assets.get(this.object.allFrames[this.currentFrame]);
		const posX = (this.x * tileWidth);
		const posY = (this.y * tileHeight) - ((this.height-1) * tileHeight);
		ctx.drawImage(frameImg, posX, posY, (this.width * tileWidth), (this.height * tileHeight));
	}
}