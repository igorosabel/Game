import {
  ScenarioObjectDropInterface,
  ScenarioObjectFrameInterface,
  ScenarioObjectInterface,
} from '@interfaces/scenario.interfaces';
import ScenarioObjectDrop from '@model/scenario-object-drop.model';
import ScenarioObjectFrame from '@model/scenario-object-frame.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class ScenarioObject {
  constructor(
    public id: number = null,
    public name: string = null,
    public idAsset: number = null,
    public assetUrl: string = null,
    public width: number = null,
    public blockWidth: number = null,
    public height: number = null,
    public blockHeight: number = null,
    public crossable: boolean = false,
    public activable: boolean = false,
    public idAssetActive: number = null,
    public assetActiveUrl: string = null,
    public activeTime: number = null,
    public activeTrigger: number = null,
    public activeTriggerCustom: string = null,
    public pickable: boolean = false,
    public grabbable: boolean = false,
    public breakable: boolean = false,
    public drops: ScenarioObjectDrop[] = [],
    public frames: ScenarioObjectFrame[] = []
  ) {}

  get allFrames(): string[] {
    const frameList: string[] = [];
    frameList.push(this.assetUrl);
    for (const frame of this.frames) {
      frameList.push(frame.assetUrl);
    }
    return frameList;
  }

  fromInterface(so: ScenarioObjectInterface): ScenarioObject {
    this.id = so.id;
    this.name = urldecode(so.name);
    this.idAsset = so.idAsset;
    this.assetUrl = urldecode(so.assetUrl);
    this.width = so.width;
    this.blockWidth = so.blockWidth;
    this.height = so.height;
    this.blockHeight = so.blockHeight;
    this.crossable = so.crossable;
    this.activable = so.activable;
    this.idAssetActive = so.idAssetActive;
    this.assetActiveUrl = urldecode(so.assetActiveUrl);
    this.activeTime = so.activeTime;
    this.activeTrigger = so.activeTrigger;
    this.activeTriggerCustom =
      so.activeTriggerCustom != null ? urldecode(so.activeTriggerCustom) : null;
    this.pickable = so.pickable;
    this.grabbable = so.grabbable;
    this.breakable = so.breakable;
    this.drops = so.drops.map(
      (sod: ScenarioObjectDropInterface): ScenarioObjectDrop => {
        return new ScenarioObjectDrop().fromInterface(sod);
      }
    );
    this.frames = so.frames.map(
      (sof: ScenarioObjectFrameInterface): ScenarioObjectFrame => {
        return new ScenarioObjectFrame().fromInterface(sof);
      }
    );

    return this;
  }

  toInterface(): ScenarioObjectInterface {
    return {
      id: this.id,
      name: urlencode(this.name),
      idAsset: this.idAsset,
      assetUrl: urlencode(this.assetUrl),
      width: this.width,
      blockWidth: this.blockWidth,
      height: this.height,
      blockHeight: this.blockHeight,
      crossable: this.crossable,
      activable: this.activable,
      idAssetActive: this.idAssetActive,
      assetActiveUrl: urlencode(this.assetActiveUrl),
      activeTime: this.activeTime,
      activeTrigger: this.activeTrigger,
      activeTriggerCustom:
        this.activeTriggerCustom !== null
          ? urlencode(this.activeTriggerCustom)
          : null,
      pickable: this.pickable,
      grabbable: this.grabbable,
      breakable: this.breakable,
      drops: this.drops.map(
        (sod: ScenarioObjectDrop): ScenarioObjectDropInterface => {
          return sod.toInterface();
        }
      ),
      frames: this.frames.map(
        (sof: ScenarioObjectFrame): ScenarioObjectFrameInterface => {
          return sof.toInterface();
        }
      ),
    };
  }
}
