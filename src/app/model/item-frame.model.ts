import { ItemFrameInterface } from '@interfaces/item.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

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
    this.assetUrl = urldecode(itf.assetUrl);
    this.order = itf.order;

    return this;
  }

  toInterface(): ItemFrameInterface {
    return {
      id: this.id,
      idAsset: this.idAsset,
      assetUrl: urlencode(this.assetUrl),
      order: this.order,
    };
  }
}
