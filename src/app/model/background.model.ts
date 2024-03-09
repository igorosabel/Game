import { BackgroundInterface } from 'src/app/interfaces/background.interfaces';
import { Utils } from 'src/app/modules/shared/utils.class';

export class Background {
  constructor(
    public id: number = null,
    public idBackgroundCategory: number = null,
    public idAsset: number = null,
    public assetUrl: string = null,
    public name: string = null,
    public crossable: boolean = true
  ) {}

  fromInterface(b: BackgroundInterface): Background {
    this.id = b.id;
    this.idBackgroundCategory = b.idBackgroundCategory;
    this.idAsset = b.idAsset;
    this.assetUrl = Utils.urldecode(b.assetUrl);
    this.name = Utils.urldecode(b.name);
    this.crossable = b.crossable;

    return this;
  }

  toInterface(): BackgroundInterface {
    return {
      id: this.id,
      idBackgroundCategory: this.idBackgroundCategory,
      idAsset: this.idAsset,
      assetUrl: Utils.urlencode(this.assetUrl),
      name: Utils.urlencode(this.name),
      crossable: this.crossable,
    };
  }
}
