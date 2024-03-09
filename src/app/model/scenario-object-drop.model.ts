import { ScenarioObjectDropInterface } from 'src/app/interfaces/scenario.interfaces';
import { Utils } from 'src/app/modules/shared/utils.class';

export class ScenarioObjectDrop {
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
    this.itemName = Utils.urldecode(sod.itemName);
    this.assetUrl = Utils.urldecode(sod.assetUrl);
    this.num = sod.num;

    return this;
  }

  toInterface(): ScenarioObjectDropInterface {
    return {
      id: this.id,
      idItem: this.idItem,
      itemName: Utils.urlencode(this.itemName),
      assetUrl: Utils.urlencode(this.assetUrl),
      num: this.num,
    };
  }
}
