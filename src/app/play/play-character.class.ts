import Constants from '@app/constants';
import { CharacterSizeInterface } from '@interfaces/character.interfaces';
import { NPCData } from '@interfaces/player.interfaces';
import { ConnectionListInterface } from '@interfaces/scenario.interfaces';
import Character from '@model/character.model';
import PositionSize from '@model/position-size.model';
import Position from '@model/position.model';
import AssetCache from '@play/asset-cache.class';
import PlayConnection from '@play/play-connection.class';
import PlayNPC from '@play/play-npc.class';
import PlayScenario from '@play/play-scenario.class';
import PlayUtils from '@play/play-utils.class';
import { EventDispatcher } from 'strongly-typed-events';

export default class PlayCharacter {
  idScenarioData: number;
  orientation: string;
  orientationList: string[];
  blockPos: PositionSize;
  originalSize: CharacterSizeInterface = { width: 0, height: 0 };
  center: Position;
  sprites;
  scenario: PlayScenario;
  vx: number;
  vy: number;
  moving;
  hitting: boolean;
  stopHitting: boolean;
  frames;
  currentFrame: number;
  currentHitFrame: number;
  playing: boolean;
  dying: boolean;
  currentDieFrame: number;
  interval: number;
  character: Character;
  connections: ConnectionListInterface;
  npcData: NPCData;

  _onConnection = new EventDispatcher<PlayCharacter, PlayConnection>();
  _onDie: EventDispatcher<PlayCharacter, number> = new EventDispatcher<
    PlayCharacter,
    number
  >();

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    blockWidth: number,
    blockHeight: number,
    scenario: PlayScenario
  ) {
    this.orientation = 'down';
    this.orientationList = [];
    this.blockPos = new PositionSize(
      x * Constants.TILE_WIDTH,
      y * Constants.TILE_HEIGHT,
      blockWidth * Constants.TILE_WIDTH,
      blockHeight * Constants.TILE_HEIGHT
    );
    this.originalSize = { width, height };
    this.scenario = scenario;
    this.center = new Position();
    this.sprites = {
      up: [],
      right: [],
      down: [],
      left: [],
      death: [],
    };
    this.vx = 0;
    this.vy = 0;
    this.moving = {
      up: false,
      down: false,
      right: false,
      left: false,
    };
    this.hitting = false;
    this.stopHitting = false;
    this.frames = {
      up: [],
      right: [],
      down: [],
      left: [],
    };
    this.currentFrame = 0;
    this.currentHitFrame = 0;
    this.playing = false;
    this.dying = false;
    this.currentDieFrame = 0;
    this.interval = null;
    this.updateCenter();
    this.npcData = {
      isNPC: false,
      isEnemy: false,
      status: 'idle',
      timer: null,
      remainingTime: 0,
    };
  }

  addCharacterSprites(assets: AssetCache): void {
    for (const frame of this.character.allFramesUp) {
      this.addSprite('up', assets.get(frame));
    }
    for (const frame of this.character.allFramesDown) {
      this.addSprite('down', assets.get(frame));
    }
    for (const frame of this.character.allFramesLeft) {
      this.addSprite('left', assets.get(frame));
    }
    for (const frame of this.character.allFramesRight) {
      this.addSprite('right', assets.get(frame));
    }
  }

  addSprite(ind: string, sprite): void {
    this.sprites[ind].push(sprite);
  }

  updateCenter(): void {
    this.center = this.blockPos.getCenter();
  }

  getNextPos(): Position {
    this.updateCenter();
    const newPos: Position = new Position(this.center.x, this.center.y);
    switch (this.orientation) {
      case 'up':
        {
          newPos.y -= this.blockPos.height;
        }
        break;
      case 'down':
        {
          newPos.y += this.blockPos.height;
        }
        break;
      case 'left':
        {
          newPos.x -= this.blockPos.width;
        }
        break;
      case 'right':
        {
          newPos.x += this.blockPos.width;
        }
        break;
    }
    return newPos;
  }

  getNextTile(): Position {
    const newPos: Position = this.getNextPos();
    return PlayUtils.getTile(newPos);
  }

  stop(): void {
    this.moving.up = false;
    this.moving.down = false;
    this.moving.right = false;
    this.moving.left = false;
    this.stopAnimation();
  }

  up(): void {
    if (!this.moving.up) {
      this.vy = -1 * Constants.DEFAULT_VY * this.character.speed;
      this.moving.up = true;
      this.orientationList.push('up');
      this.playAnimation();
    }
    this.updateOrientation();
  }

  stopUp(): void {
    if (this.moving.up) {
      this.moving.up = false;
      this.vy = 0;
      this.orientationList.splice(this.orientationList.indexOf('up'), 1);
    }
    this.updateOrientation();
  }

  down(): void {
    if (!this.moving.down) {
      this.vy = Constants.DEFAULT_VY * this.character.speed;
      this.moving.down = true;
      this.orientationList.push('down');
      this.playAnimation();
    }
    this.updateOrientation();
  }

  stopDown(): void {
    if (this.moving.down) {
      this.moving.down = false;
      this.vy = 0;
      this.orientationList.splice(this.orientationList.indexOf('down'), 1);
    }
    this.updateOrientation();
  }

  right(): void {
    if (!this.moving.right) {
      this.vx = Constants.DEFAULT_VX * this.character.speed;
      this.moving.right = true;
      this.orientationList.push('right');
      this.playAnimation();
    }
    this.updateOrientation();
  }

  stopRight(): void {
    if (this.moving.right) {
      this.moving.right = false;
      this.vx = 0;
      this.orientationList.splice(this.orientationList.indexOf('right'), 1);
    }
    this.updateOrientation();
  }

  left(): void {
    if (!this.moving.left) {
      this.vx = -1 * Constants.DEFAULT_VX * this.character.speed;
      this.moving.left = true;
      this.orientationList.push('left');
      this.playAnimation();
    }
    this.updateOrientation();
  }

  stopLeft(): void {
    if (this.moving.left) {
      this.moving.left = false;
      this.vx = 0;
      this.orientationList.splice(this.orientationList.indexOf('left'), 1);
    }
    this.updateOrientation();
  }

  playAnimation(): void {
    if (!this.playing) {
      this.playing = true;
      this.interval = window.setInterval(
        this.updateAnimation.bind(this),
        Constants.FRAME_DURATION
      );
    }
  }

  stopAnimation(): void {
    if (!this.hitting) {
      this.playing = false;
      this.currentFrame = 0;
      this.currentHitFrame = 0;
      this.currentDieFrame = 0;
      clearInterval(this.interval);
    }
  }

  updateAnimation(): void {
    if (!this.hitting) {
      if (this.currentFrame === this.sprites[this.orientation].length - 1) {
        this.currentFrame = 1;
      } else {
        this.currentFrame++;
      }
    } else {
      if (
        this.currentHitFrame ===
        this.sprites['hit-' + this.orientation].length - 1
      ) {
        this.currentHitFrame = 0;
        this.hitting = false;
        this.stopHitting = true;
      } else {
        this.currentHitFrame++;
      }
    }
    if (this.dying) {
      if (this.currentDieFrame === this.sprites['death'].length - 1) {
        this.currentDieFrame = 0;
        this.stopAnimation();
        this._onDie.dispatch(this, this.character.type);
      } else {
        this.currentDieFrame++;
      }
    }
  }

  updateOrientation(): void {
    if (this.orientationList.length > 0) {
      this.orientation = this.orientationList[this.orientationList.length - 1];
    }
  }

  collission(obj1: PositionSize, obj2: Position): boolean {
    const rect2: PositionSize = new PositionSize(
      obj2.x * Constants.TILE_WIDTH,
      obj2.y * Constants.TILE_HEIGHT,
      Constants.TILE_WIDTH,
      Constants.TILE_HEIGHT
    );

    return PlayUtils.collision(obj1, rect2);
  }

  npcCollision(pos: PositionSize, character: PlayCharacter): boolean {
    const charPos: PositionSize = new PositionSize(
      character.blockPos.x,
      character.blockPos.y,
      character.blockPos.width,
      character.blockPos.height
    );

    return PlayUtils.collision(pos, charPos);
  }

  stopNPC(): void {
    switch (this.orientation) {
      case 'up':
        {
          this.stopUp();
        }
        break;
      case 'down':
        {
          this.stopDown();
        }
        break;
      case 'left':
        {
          this.stopLeft();
        }
        break;
      case 'right':
        {
          this.stopRight();
        }
        break;
    }
  }

  public get onDie() {
    return this._onDie.asEvent();
  }

  move(): boolean {
    if (this.dying) {
      return;
    }
    if (
      this.moving.up ||
      this.moving.down ||
      this.moving.right ||
      this.moving.left
    ) {
      const newPosX: number = this.blockPos.x + this.vx;
      const newPosY: number = this.blockPos.y + this.vy;
      // Colisión con los bordes de la pantalla
      if (
        newPosX < 0 ||
        newPosY < 0 ||
        newPosX + this.blockPos.width > Constants.SCENARIO_WIDTH ||
        newPosY + this.blockPos.height > Constants.SCENARIO_HEIGHT
      ) {
        if (!this.npcData.isNPC) {
          const next: Position = this.getNextTile();
          const playConnection = new PlayConnection();
          // Izquierda
          if (newPosX < 0 && this.connections.left !== null) {
            playConnection.to = this.connections.left.to;
            playConnection.x = 0;
            playConnection.y = next.y;
          }
          // Arriba
          if (newPosY < 0 && this.connections.up !== null) {
            playConnection.to = this.connections.up.to;
            playConnection.x = next.x;
            playConnection.y = 0;
          }
          // Derecha
          if (
            newPosX + this.blockPos.width > Constants.SCENARIO_WIDTH &&
            this.connections.right !== null
          ) {
            playConnection.to = this.connections.right.to;
            playConnection.x = Constants.SCENARIO_COLS;
            playConnection.y = next.y;
          }
          // Abajo
          if (
            newPosY + this.blockPos.height > Constants.SCENARIO_HEIGHT &&
            this.connections.down !== null
          ) {
            playConnection.to = this.connections.down.to;
            playConnection.x = next.x;
            playConnection.y = Constants.SCENARIO_ROWS;
          }
          if (playConnection.to !== null) {
            this._onConnection.dispatch(this, playConnection);
          }
        } else {
          this.stopNPC();
        }
        return false;
      }

      // Colisión con fondos y objetos
      let hit: boolean = false;
      const newPos: PositionSize = new PositionSize(
        newPosX,
        newPosY,
        this.blockPos.width,
        this.blockPos.height
      );
      this.scenario.blockers.forEach((object: Position): void => {
        if (this.collission(newPos, object)) {
          hit = true;
        }
      });
      if (!this.npcData.isNPC) {
        this.scenario.npcs.forEach((npc: PlayNPC): void => {
          if (this.npcCollision(newPos, npc)) {
            hit = true;
          }
        });
      } else {
        const npcList: PlayNPC[] = [...this.scenario.npcs];
        const npcInd: number = npcList.findIndex(
          (x: PlayNPC): boolean =>
            x.blockPos.x === this.blockPos.x && x.blockPos.y === this.blockPos.y
        );
        npcList.splice(npcInd, 1);
        npcList.forEach((npc: PlayNPC): void => {
          if (this.npcCollision(newPos, npc)) {
            hit = true;
          }
        });
        if (this.npcCollision(newPos, this.scenario.player)) {
          hit = true;
        }
      }
      if (hit) {
        if (this.npcData.isNPC) {
          this.stopNPC();
        }
        return false;
      }

      // Actualizo posición
      this.blockPos.x += this.vx;
      this.blockPos.y += this.vy;
      this.updateCenter();
    } else {
      this.stopAnimation();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    let img = this.sprites[this.orientation][this.currentFrame];
    let posX: number = null;
    let posY: number = null;
    if (!this.hitting) {
      switch (this.orientation) {
        case 'down':
          {
            posX = this.blockPos.x - (img.width - this.blockPos.width) / 2;
            posY = this.blockPos.y - (img.height - this.blockPos.height);
          }
          break;
        case 'left':
          {
            posX = this.blockPos.x - (img.width - this.blockPos.width);
            posY = this.blockPos.y - (img.height - this.blockPos.height);
          }
          break;
        case 'right':
          {
            posX = this.blockPos.x;
            posY = this.blockPos.y - (img.height - this.blockPos.height);
          }
          break;
        case 'up':
          {
            posX = this.blockPos.x - (img.width - this.blockPos.width) / 2;
            posY = this.blockPos.y - (img.height - this.blockPos.height);
          }
          break;
      }
    }
    if (this.hitting) {
      img = this.sprites['hit-' + this.orientation][this.currentHitFrame];
      switch (this.orientation) {
        case 'down':
          {
            posX = this.blockPos.x - (img.width - this.blockPos.width) / 2;
            posY = this.blockPos.y;
          }
          break;
        case 'left':
          {
            posX = this.blockPos.x - (img.width - this.blockPos.width);
            posY = this.blockPos.y - (img.height - this.blockPos.height) / 2;
          }
          break;
        case 'right':
          {
            posX = this.blockPos.x;
            posY = this.blockPos.y - (img.height - this.blockPos.height) / 2;
          }
          break;
        case 'up':
          {
            posX = this.blockPos.x - (img.width - this.blockPos.width) / 2;
            posY = this.blockPos.y - (img.height - this.blockPos.height);
          }
          break;
      }
      if (this.stopHitting && this.orientation == 'down') {
        posX = this.blockPos.x;
        posY = this.blockPos.y;
      }
    }
    ctx.drawImage(img, posX, posY, img.width, img.height);
    if (this.dying) {
      const centerX: number = posX + img.width / 2;
      const centerY: number = posY + img.height / 2;
      const deathImg = this.sprites['death'][this.currentDieFrame];
      const deathPosX: number = centerX - deathImg.width / 2;
      const deathPosY: number = centerY - deathImg.height / 2;

      ctx.drawImage(
        deathImg,
        deathPosX,
        deathPosY,
        deathImg.width,
        deathImg.height
      );
    }
    /*ctx.globalAlpha = 0.62;
		ctx.globalCompositeOperation = 'source-atop';
		ctx.fillStyle = 'red';
		ctx.fillRect(posX, posY, img.width, img.height);*/
    if (Constants.DEBUG) {
      ctx.strokeStyle = '#f00';
      ctx.lineWidth = 1;
      ctx.strokeRect(posX, posY, img.width, img.height);
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
