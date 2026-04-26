import { ItemFrameInterface, ItemInterface } from '@interfaces/item.interfaces';
import ItemFrame from '@model/item-frame.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class Item {
  constructor(
    public id: number | null = null,
    public type: number | null = null,
    public idAsset: number | null = null,
    public assetUrl: string | null = null,
    public name: string | null = null,
    public money: number | null = null,
    public health: number | null = null,
    public attack: number | null = null,
    public defense: number | null = null,
    public speed: number | null = null,
    public wearable: number | null = null,
    public frames: ItemFrame[] = [],
  ) {}

  get allFrames(): string[] {
    const frameList: string[] = [];
    if (this.assetUrl !== null) {
      frameList.push(this.assetUrl);
    }
    for (const frame of this.frames) {
      if (frame.assetUrl !== null) {
        frameList.push(frame.assetUrl);
      }
    }
    return frameList;
  }

  fromInterface(i: ItemInterface): Item {
    this.id = i.id;
    this.type = i.type;
    this.idAsset = i.idAsset;
    this.assetUrl = urldecode(i.assetUrl);
    this.name = urldecode(i.name);
    this.money = i.money;
    this.health = i.health;
    this.attack = i.attack;
    this.defense = i.defense;
    this.speed = i.speed;
    this.wearable = i.wearable;
    this.frames = i.frames.map((itf: ItemFrameInterface): ItemFrame => {
      return new ItemFrame().fromInterface(itf);
    });

    return this;
  }

  toInterface(): ItemInterface {
    return {
      id: this.id,
      type: this.type,
      idAsset: this.idAsset,
      assetUrl: urlencode(this.assetUrl),
      name: urlencode(this.name),
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
