import { Constants } from 'src/app/constants';
import { PositionSize } from 'src/app/model/position-size.model';
import { ScenarioObject } from 'src/app/model/scenario-object.model';
import { AssetCache } from 'src/app/play/asset-cache.class';

export class PlayObject {
  blockPos: PositionSize;
  object: ScenarioObject;
  currentFrame: number;
  interval: number;
  sprites: any[];
  playing: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    object: ScenarioObject
  ) {
    this.blockPos = new PositionSize(
      x * Constants.TILE_WIDTH,
      y * Constants.TILE_HEIGHT - (height - 1) * Constants.TILE_HEIGHT,
      width * Constants.TILE_WIDTH,
      height * Constants.TILE_HEIGHT
    );
    this.object = object;

    this.currentFrame = 0;
    this.playing = false;
    this.sprites = [];
  }

  addObjectSprites(assets: AssetCache): void {
    for (const frame of this.object.allFrames) {
      this.addSprite(assets.get(frame));
    }
  }

  addSprite(sprite: any): void {
    this.sprites.push(sprite);
  }

  playAnimation(): void {
    if (!this.playing) {
      this.playing = true;
      this.interval = window.setInterval(
        this.updateAnimation.bind(this),
        Constants.FRAME_DURATION * 2
      );
    }
  }

  updateAnimation(): void {
    if (this.currentFrame === this.object.allFrames.length - 1) {
      this.currentFrame = 0;
    } else {
      this.currentFrame++;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.playAnimation();
    const frameImg: any = this.sprites[this.currentFrame];
    ctx.drawImage(
      frameImg,
      this.blockPos.x,
      this.blockPos.y,
      this.blockPos.width,
      this.blockPos.height
    );
    if (Constants.DEBUG) {
      ctx.strokeStyle = '#00f';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        this.blockPos.x,
        this.blockPos.y,
        this.blockPos.width,
        this.blockPos.height
      );
    }
  }
}
