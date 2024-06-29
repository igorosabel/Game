import { ItemFrameInterface } from '@interfaces/item.interfaces';
import Utils from '@shared/utils.class';

export default class ItemFrame {
  constructor(
    public id: number = null,
    public idAsset: number = null,
    public assetUrl: string = null,
    public order: number = null
  ) {}

  fromInterface(itf: ItemFrameInterface): ItemFrame {
    this.id = itf.id;
    this.idAsset = itf.idAsset;
    this.assetUrl = Utils.urldecode(itf.assetUrl);
    this.order = itf.order;

    return this;
  }

  toInterface(): ItemFrameInterface {
    return {
      id: this.id,
      idAsset: this.idAsset,
      assetUrl: Utils.urlencode(this.assetUrl),
      order: this.order,
    };
  }
}
