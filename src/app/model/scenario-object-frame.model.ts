import { ScenarioObjectFrameInterface } from '@interfaces/scenario.interfaces';
import Utils from '@shared/utils.class';

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
    this.assetUrl = Utils.urldecode(sof.assetUrl);
    this.order = sof.order;

    return this;
  }

  toInterface(): ScenarioObjectFrameInterface {
    return {
      id: this.id,
      idAsset: this.idAsset,
      assetUrl: Utils.urlencode(this.assetUrl),
      order: this.order,
    };
  }
}
