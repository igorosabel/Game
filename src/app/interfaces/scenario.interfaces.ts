import Connection from '@model/connection.model';

export interface ScenarioTriggerTypeInterface {
  id: number;
  name: string;
}

export interface ScenarioInterface {
  id: number;
  idWorld: number;
  name: string;
  startX: number;
  startY: number;
  initial: boolean;
  friendly: boolean;
}

export interface ScenarioResult {
  status: string;
  list: ScenarioInterface[];
}

export interface SelectedScenarioDataInterface {
  selecting: string;
  idBackground: number;
  backgroundAssetUrl: string;
  idScenarioObject: number;
  scenarioObjectAssetUrl: string;
  scenarioObjectWidth: number;
  scenarioObjectHeight: number;
  idCharacter: number;
  characterAssetUrl: string;
  characterWidth: number;
  characterHeight: number;
  characterHealth: number;
}

export interface ScenarioDataInterface {
  id: number;
  idScenario: number;
  x: number;
  y: number;
  idBackground: number;
  backgroundName: string;
  backgroundAssetUrl: string;
  idScenarioObject: number;
  scenarioObjectName: string;
  scenarioObjectAssetUrl: string;
  scenarioObjectWidth: number;
  scenarioObjectHeight: number;
  scenarioObjectBlockWidth: number;
  scenarioObjectBlockHeight: number;
  idCharacter: number;
  characterName: string;
  characterAssetUrl: string;
  characterWidth: number;
  characterHeight: number;
  characterBlockWidth: number;
  characterBlockHeight: number;
  characterHealth: number;
}

export interface ConnectionListInterface {
  up: Connection;
  down: Connection;
  left: Connection;
  right: Connection;
}

export interface ConnectionInterface {
  from: number;
  fromName: string;
  to: number;
  toName: string;
  orientation: string;
}

export interface ConnectionResult {
  status: string;
  list: ConnectionInterface[];
}

export interface PlayConnectionInterface {
  to: number;
  x: number;
  y: number;
  idGame: number;
}

export interface ScenarioDataResult {
  status: string;
  scenario: ScenarioInterface;
  data: ScenarioDataInterface[];
  connection: ConnectionInterface[];
}

export interface ScenarioObjectDropInterface {
  id: number;
  idItem: number;
  itemName: string;
  assetUrl: string;
  num: number;
}

export interface ScenarioObjectFrameInterface {
  id: number;
  idAsset: number;
  assetUrl: string;
  order: number;
}

export interface ScenarioObjectInterface {
  id: number;
  name: string;
  idAsset: number;
  assetUrl: string;
  width: number;
  blockWidth: number;
  height: number;
  blockHeight: number;
  crossable: boolean;
  activable: boolean;
  idAssetActive: number;
  assetActiveUrl: string;
  activeTime: number;
  activeTrigger: number;
  activeTriggerCustom: string;
  pickable: boolean;
  grabbable: boolean;
  breakable: boolean;
  drops: ScenarioObjectDropInterface[];
  frames: ScenarioObjectFrameInterface[];
}

export interface ScenarioObjectResult {
  status: string;
  list: ScenarioObjectInterface[];
}
