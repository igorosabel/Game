import { CharacterFrameInterface } from '@interfaces/character.interfaces';
import Utils from '@shared/utils.class';

export default class CharacterFrame {
  constructor(
    public id: number = null,
    public idAsset: number = null,
    public assetUrl: string = null,
    public orientation: string = null,
    public order: number = null
  ) {}

  fromInterface(cf: CharacterFrameInterface): CharacterFrame {
    this.id = cf.id;
    this.idAsset = cf.idAsset;
    this.assetUrl = Utils.urldecode(cf.assetUrl);
    this.orientation = cf.orientation;
    this.order = cf.order;

    return this;
  }

  toInterface(): CharacterFrameInterface {
    return {
      id: this.id,
      idAsset: this.idAsset,
      assetUrl: Utils.urlencode(this.assetUrl),
      orientation: this.orientation,
      order: this.order,
    };
  }
}
