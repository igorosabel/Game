import { CharacterFrameInterface } from '@interfaces/character.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class CharacterFrame {
  constructor(
    public id: number | null = null,
    public idAsset: number | null = null,
    public assetUrl: string | null = null,
    public orientation: string | null = null,
    public order: number | null = null,
  ) {}

  fromInterface(cf: CharacterFrameInterface): CharacterFrame {
    this.id = cf.id;
    this.idAsset = cf.idAsset;
    this.assetUrl = urldecode(cf.assetUrl);
    this.orientation = cf.orientation;
    this.order = cf.order;

    return this;
  }

  toInterface(): CharacterFrameInterface {
    return {
      id: this.id,
      idAsset: this.idAsset,
      assetUrl: urlencode(this.assetUrl),
      orientation: this.orientation,
      order: this.order,
    };
  }
}
