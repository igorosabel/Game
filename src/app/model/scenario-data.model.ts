import { ScenarioDataInterface } from '@interfaces/scenario.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class ScenarioData {
  constructor(
    public id: number | null = null,
    public idScenario: number | null = null,
    public x: number | null = null,
    public y: number | null = null,
    public idBackground: number | null = null,
    public backgroundName: string | null = null,
    public backgroundAssetUrl: string | null = null,
    public idScenarioObject: number | null = null,
    public scenarioObjectName: string | null = null,
    public scenarioObjectAssetUrl: string | null = null,
    public scenarioObjectWidth: number | null = null,
    public scenarioObjectHeight: number | null = null,
    public scenarioObjectBlockWidth: number | null = null,
    public scenarioObjectBlockHeight: number | null = null,
    public idCharacter: number | null = null,
    public characterName: string | null = null,
    public characterAssetUrl: string | null = null,
    public characterWidth: number | null = null,
    public characterHeight: number | null = null,
    public characterBlockWidth: number | null = null,
    public characterBlockHeight: number | null = null,
    public characterHealth: number | null = null,
  ) {}

  fromInterface(sd: ScenarioDataInterface): ScenarioData {
    this.id = sd.id;
    this.idScenario = sd.idScenario;
    this.x = sd.x;
    this.y = sd.y;
    this.idBackground = sd.idBackground;
    this.backgroundName = urldecode(sd.backgroundName);
    this.backgroundAssetUrl = urldecode(sd.backgroundAssetUrl);
    this.idScenarioObject = sd.idScenarioObject;
    this.scenarioObjectName = urldecode(sd.scenarioObjectName);
    this.scenarioObjectAssetUrl = urldecode(sd.scenarioObjectAssetUrl);
    this.scenarioObjectWidth = sd.scenarioObjectWidth;
    this.scenarioObjectHeight = sd.scenarioObjectHeight;
    this.scenarioObjectBlockWidth = sd.scenarioObjectBlockWidth;
    this.scenarioObjectBlockHeight = sd.scenarioObjectBlockHeight;
    this.idCharacter = sd.idCharacter;
    this.characterName = urldecode(sd.characterName);
    this.characterAssetUrl = urldecode(sd.characterAssetUrl);
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
      backgroundName: urlencode(this.backgroundName),
      backgroundAssetUrl: urlencode(this.backgroundAssetUrl),
      idScenarioObject: this.idScenarioObject,
      scenarioObjectName: urlencode(this.scenarioObjectName),
      scenarioObjectAssetUrl: urlencode(this.scenarioObjectAssetUrl),
      scenarioObjectWidth: this.scenarioObjectWidth,
      scenarioObjectHeight: this.scenarioObjectHeight,
      scenarioObjectBlockWidth: this.scenarioObjectBlockWidth,
      scenarioObjectBlockHeight: this.scenarioObjectBlockHeight,
      idCharacter: this.idCharacter,
      characterName: urlencode(this.characterName),
      characterAssetUrl: urlencode(this.characterAssetUrl),
      characterWidth: this.characterWidth,
      characterHeight: this.characterHeight,
      characterBlockWidth: this.characterBlockWidth,
      characterBlockHeight: this.characterBlockHeight,
      characterHealth: this.characterHealth,
    };
  }
}
