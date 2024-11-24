import { ScenarioObjectDropInterface } from '@interfaces/scenario.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class ScenarioObjectDrop {
  constructor(
    public id: number = null,
    public idItem: number = null,
    public itemName: string = null,
    public assetUrl: string = null,
    public num: number = null
  ) {}

  fromInterface(sod: ScenarioObjectDropInterface): ScenarioObjectDrop {
    this.id = sod.id;
    this.idItem = sod.idItem;
    this.itemName = urldecode(sod.itemName);
    this.assetUrl = urldecode(sod.assetUrl);
    this.num = sod.num;

    return this;
  }

  toInterface(): ScenarioObjectDropInterface {
    return {
      id: this.id,
      idItem: this.idItem,
      itemName: urlencode(this.itemName),
      assetUrl: urlencode(this.assetUrl),
      num: this.num,
    };
  }
}
