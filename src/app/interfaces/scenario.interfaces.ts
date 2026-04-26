import { Orientation } from '@interfaces/interfaces';
import Connection from '@model/connection.model';

export interface ScenarioTriggerTypeInterface {
  id: number;
  name: string;
}

export interface ScenarioInterface {
  id: number | null;
  idWorld: number | null;
  name: string | null;
  startX: number | null;
  startY: number | null;
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
  to: number | null;
  x: number | null;
  y: number | null;
  idGame: number | null;
}

export interface ScenarioDataResult {
  status: string;
  scenario: ScenarioInterface;
  data: ScenarioDataInterface[];
  connection: ConnectionInterface[];
}

export interface ScenarioObjectDropInterface {
  id: number | null;
  idItem: number | null;
  itemName: string | null;
  assetUrl: string | null;
  num: number | null;
}

export interface ScenarioObjectFrameInterface {
  id: number | null;
  idAsset: number | null;
  assetUrl: string | null;
  order: number | null;
}

export interface ScenarioObjectInterface {
  id: number | null;
  name: string | null;
  idAsset: number | null;
  assetUrl: string | null;
  width: number | null;
  blockWidth: number | null;
  height: number | null;
  blockHeight: number | null;
  crossable: boolean;
  activable: boolean;
  idAssetActive: number | null;
  assetActiveUrl: string | null;
  activeTime: number | null;
  activeTrigger: number | null;
  activeTriggerCustom: string | null;
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
