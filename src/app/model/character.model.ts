import {
  CharacterFrameInterface,
  CharacterInterface,
  NarrativeInterface,
} from 'src/app/interfaces/interfaces';
import { CharacterFrame } from 'src/app/model/character-frame.model';
import { Inventory } from 'src/app/model/inventory.model';
import { Item } from 'src/app/model/item.model';
import { Narrative } from 'src/app/model/narrative.model';
import { Utils } from 'src/app/modules/shared/utils.class';

export class Character {
  currentHealth: number = null;
  money: number = null;
  items: Item[] = null;
  inventory: Inventory[] = null;

  constructor(
    public id: number = null,
    public name: string = null,
    public width: number = null,
    public blockWidth: number = null,
    public height: number = null,
    public blockHeight: number = null,
    public fixedPosition: boolean = false,
    public idAssetUp: number = null,
    public assetUpUrl: string = null,
    public idAssetDown: number = null,
    public assetDownUrl: string = null,
    public idAssetLeft: number = null,
    public assetLeftUrl: string = null,
    public idAssetRight: number = null,
    public assetRightUrl: string = null,
    public type: number = null,
    public health: number = null,
    public attack: number = null,
    public defense: number = null,
    public speed: number = null,
    public dropIdItem: number = null,
    public dropAssetUrl: string = null,
    public dropChance: number = null,
    public respawn: number = null,
    public framesUp: CharacterFrame[] = [],
    public framesDown: CharacterFrame[] = [],
    public framesLeft: CharacterFrame[] = [],
    public framesRight: CharacterFrame[] = [],
    public narratives: Narrative[] = []
  ) {
    this.currentHealth = health;
    this.money = 0;
    this.items = [];
    this.inventory = [];
  }

  getAllFrames(sent: string): string[] {
    const frameList: string[] = [];
    frameList.push(this['asset' + sent + 'Url']);
    for (let frame of this['frames' + sent]) {
      frameList.push(frame.assetUrl);
    }
    return frameList;
  }

  get allFramesUp(): string[] {
    return this.getAllFrames('Up');
  }

  get allFramesDown(): string[] {
    return this.getAllFrames('Down');
  }

  get allFramesLeft(): string[] {
    return this.getAllFrames('Left');
  }

  get allFramesRight(): string[] {
    return this.getAllFrames('Right');
  }

  fromInterface(c: CharacterInterface): Character {
    this.id = c.id;
    this.name = Utils.urldecode(c.name);
    this.width = c.width;
    this.blockWidth = c.blockWidth;
    this.height = c.height;
    this.blockHeight = c.blockHeight;
    this.fixedPosition = c.fixedPosition;
    this.idAssetUp = c.idAssetUp;
    this.assetUpUrl = Utils.urldecode(c.assetUpUrl);
    this.idAssetDown = c.idAssetDown;
    this.assetDownUrl = Utils.urldecode(c.assetDownUrl);
    this.idAssetLeft = c.idAssetLeft;
    this.assetLeftUrl = Utils.urldecode(c.assetLeftUrl);
    this.idAssetRight = c.idAssetRight;
    this.assetRightUrl = Utils.urldecode(c.assetRightUrl);
    this.type = c.type;
    this.health = c.health;
    this.attack = c.attack;
    this.defense = c.defense;
    this.speed = c.speed;
    this.dropIdItem = c.dropIdItem;
    this.dropAssetUrl = Utils.urldecode(c.dropAssetUrl);
    this.dropChance = c.dropChance;
    this.respawn = c.respawn;
    this.framesUp = c.framesUp.map((cf: CharacterFrame): CharacterFrame => {
      return new CharacterFrame().fromInterface(cf);
    });
    this.framesDown = c.framesDown.map((cf: CharacterFrame): CharacterFrame => {
      return new CharacterFrame().fromInterface(cf);
    });
    this.framesLeft = c.framesLeft.map((cf: CharacterFrame): CharacterFrame => {
      return new CharacterFrame().fromInterface(cf);
    });
    this.framesRight = c.framesRight.map(
      (cf: CharacterFrame): CharacterFrame => {
        return new CharacterFrame().fromInterface(cf);
      }
    );
    this.narratives = c.narratives.map((n: NarrativeInterface): Narrative => {
      return new Narrative().fromInterface(n);
    });

    return this;
  }

  toInterface(): CharacterInterface {
    return {
      id: this.id,
      name: this.name,
      width: this.width,
      blockWidth: this.blockWidth,
      height: this.height,
      blockHeight: this.blockHeight,
      fixedPosition: this.fixedPosition,
      idAssetUp: this.idAssetUp,
      assetUpUrl: this.assetUpUrl,
      idAssetDown: this.idAssetDown,
      assetDownUrl: this.assetDownUrl,
      idAssetLeft: this.idAssetLeft,
      assetLeftUrl: this.assetLeftUrl,
      idAssetRight: this.idAssetRight,
      assetRightUrl: this.assetRightUrl,
      type: this.type,
      health: this.health,
      attack: this.attack,
      defense: this.defense,
      speed: this.speed,
      dropIdItem: this.dropIdItem,
      dropAssetUrl: this.dropAssetUrl,
      dropChance: this.dropChance,
      respawn: this.respawn,
      framesUp: this.framesUp.map(
        (cf: CharacterFrame): CharacterFrameInterface => {
          return cf.toInterface();
        }
      ),
      framesDown: this.framesDown.map(
        (cf: CharacterFrame): CharacterFrameInterface => {
          return cf.toInterface();
        }
      ),
      framesLeft: this.framesLeft.map(
        (cf: CharacterFrame): CharacterFrameInterface => {
          return cf.toInterface();
        }
      ),
      framesRight: this.framesRight.map(
        (cf: CharacterFrame): CharacterFrameInterface => {
          return cf.toInterface();
        }
      ),
      narratives: this.narratives.map((n: Narrative): NarrativeInterface => {
        return n.toInterface();
      }),
    };
  }
}
