import { BackgroundInterface } from '@interfaces/background.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Background {
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
    this.assetUrl = urldecode(b.assetUrl);
    this.name = urldecode(b.name);
    this.crossable = b.crossable;

    return this;
  }

  toInterface(): BackgroundInterface {
    return {
      id: this.id,
      idBackgroundCategory: this.idBackgroundCategory,
      idAsset: this.idAsset,
      assetUrl: urlencode(this.assetUrl),
      name: urlencode(this.name),
      crossable: this.crossable,
    };
  }
}
