import {
  ItemFrameInterface,
  ItemInterface,
} from 'src/app/interfaces/item.interfaces';
import { ItemFrame } from 'src/app/model/item-frame.model';
import { Utils } from 'src/app/modules/shared/utils.class';

export class Item {
  constructor(
    public id: number = null,
    public type: number = null,
    public idAsset: number = null,
    public assetUrl: string = null,
    public name: string = null,
    public money: number = null,
    public health: number = null,
    public attack: number = null,
    public defense: number = null,
    public speed: number = null,
    public wearable: number = null,
    public frames: ItemFrame[] = []
  ) {}

  get allFrames(): string[] {
    const frameList: string[] = [];
    frameList.push(this.assetUrl);
    for (const frame of this.frames) {
      frameList.push(frame.assetUrl);
    }
    return frameList;
  }

  fromInterface(i: ItemInterface): Item {
    this.id = i.id;
    this.type = i.type;
    this.idAsset = i.idAsset;
    this.assetUrl = Utils.urldecode(i.assetUrl);
    this.name = Utils.urldecode(i.name);
    this.money = i.money;
    this.health = i.health;
    this.attack = i.attack;
    this.defense = i.defense;
    this.speed = i.speed;
    this.wearable = i.wearable;
    this.frames = i.frames.map((itf: ItemFrame): ItemFrame => {
      return new ItemFrame().fromInterface(itf);
    });

    return this;
  }

  toInterface(): ItemInterface {
    return {
      id: this.id,
      type: this.type,
      idAsset: this.idAsset,
      assetUrl: Utils.urlencode(this.assetUrl),
      name: Utils.urlencode(this.name),
      money: this.money,
      health: this.health,
      attack: this.attack,
      defense: this.defense,
      speed: this.speed,
      wearable: this.wearable,
      frames: this.frames.map((itf: ItemFrame): ItemFrameInterface => {
        return itf.toInterface();
      }),
    };
  }
}
