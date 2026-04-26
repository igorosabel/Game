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
  id: number | null;
  idScenario: number | null;
  x: number | null;
  y: number | null;
  idBackground: number | null;
  backgroundName: string | null;
  backgroundAssetUrl: string | null;
  idScenarioObject: number | null;
  scenarioObjectName: string | null;
  scenarioObjectAssetUrl: string | null;
  scenarioObjectWidth: number | null;
  scenarioObjectHeight: number | null;
  scenarioObjectBlockWidth: number | null;
  scenarioObjectBlockHeight: number | null;
  idCharacter: number | null;
  characterName: string | null;
  characterAssetUrl: string | null;
  characterWidth: number | null;
  characterHeight: number | null;
  characterBlockWidth: number | null;
  characterBlockHeight: number | null;
  characterHealth: number | null;
}

export interface ConnectionListInterface {
  up: Connection | null;
  down: Connection | null;
  left: Connection | null;
  right: Connection | null;
}

export type Orientation = 'up' | 'down' | 'left' | 'right';

export interface ConnectionInterface {
  from: number | null;
  fromName: string | null;
  to: number | null;
  toName: string | null;
  orientation: Orientation | null;
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
