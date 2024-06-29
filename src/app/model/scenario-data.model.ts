import { ScenarioDataInterface } from '@interfaces/scenario.interfaces';
import Utils from '@shared/utils.class';

export default class ScenarioData {
  constructor(
    public id: number = null,
    public idScenario: number = null,
    public x: number = null,
    public y: number = null,
    public idBackground: number = null,
    public backgroundName: string = null,
    public backgroundAssetUrl: string = null,
    public idScenarioObject: number = null,
    public scenarioObjectName: string = null,
    public scenarioObjectAssetUrl: string = null,
    public scenarioObjectWidth: number = null,
    public scenarioObjectHeight: number = null,
    public scenarioObjectBlockWidth: number = null,
    public scenarioObjectBlockHeight: number = null,
    public idCharacter: number = null,
    public characterName: string = null,
    public characterAssetUrl: string = null,
    public characterWidth: number = null,
    public characterHeight: number = null,
    public characterBlockWidth: number = null,
    public characterBlockHeight: number = null,
    public characterHealth: number = null
  ) {}

  fromInterface(sd: ScenarioDataInterface): ScenarioData {
    this.id = sd.id;
    this.idScenario = sd.idScenario;
    this.x = sd.x;
    this.y = sd.y;
    this.idBackground = sd.idBackground;
    this.backgroundName = Utils.urldecode(sd.backgroundName);
    this.backgroundAssetUrl = Utils.urldecode(sd.backgroundAssetUrl);
    this.idScenarioObject = sd.idScenarioObject;
    this.scenarioObjectName = Utils.urldecode(sd.scenarioObjectName);
    this.scenarioObjectAssetUrl = Utils.urldecode(sd.scenarioObjectAssetUrl);
    this.scenarioObjectWidth = sd.scenarioObjectWidth;
    this.scenarioObjectHeight = sd.scenarioObjectHeight;
    this.scenarioObjectBlockWidth = sd.scenarioObjectBlockWidth;
    this.scenarioObjectBlockHeight = sd.scenarioObjectBlockHeight;
    this.idCharacter = sd.idCharacter;
    this.characterName = Utils.urldecode(sd.characterName);
    this.characterAssetUrl = Utils.urldecode(sd.characterAssetUrl);
    this.characterWidth = sd.characterWidth;
    this.characterHeight = sd.characterHeight;
    this.characterBlockWidth = sd.characterBlockWidth;
    this.characterBlockHeight = sd.characterBlockHeight;
    this.characterHealth = sd.characterHealth;

    return this;
  }

  toInterface(): ScenarioDataInterface {
    return {
      id: this.id,
      idScenario: this.idScenario,
      x: this.x,
      y: this.y,
      idBackground: this.idBackground,
      backgroundName: this.backgroundName,
      backgroundAssetUrl: this.backgroundAssetUrl,
      idScenarioObject: this.idScenarioObject,
      scenarioObjectName: this.scenarioObjectName,
      scenarioObjectAssetUrl: this.scenarioObjectAssetUrl,
      scenarioObjectWidth: this.scenarioObjectWidth,
      scenarioObjectHeight: this.scenarioObjectHeight,
      scenarioObjectBlockWidth: this.scenarioObjectBlockWidth,
      scenarioObjectBlockHeight: this.scenarioObjectBlockHeight,
      idCharacter: this.idCharacter,
      characterName: this.characterName,
      characterAssetUrl: this.characterAssetUrl,
      characterWidth: this.characterWidth,
      characterHeight: this.characterHeight,
      characterBlockWidth: this.characterBlockWidth,
      characterBlockHeight: this.characterBlockHeight,
      characterHealth: this.characterHealth,
    };
  }
}
