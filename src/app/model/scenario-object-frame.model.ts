import { ScenarioObjectFrameInterface } from '@interfaces/scenario.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class ScenarioObjectFrame {
  constructor(
    public id: number = null,
    public idAsset: number = null,
    public assetUrl: string = null,
    public order: number = null
  ) {}

  fromInterface(sof: ScenarioObjectFrameInterface): ScenarioObjectFrame {
    this.id = sof.id;
    this.idAsset = sof.idAsset;
    this.assetUrl = urldecode(sof.assetUrl);
    this.order = sof.order;

    return this;
  }

  toInterface(): ScenarioObjectFrameInterface {
    return {
      id: this.id,
      idAsset: this.idAsset,
      assetUrl: urlencode(this.assetUrl),
      order: this.order,
    };
  }
}
