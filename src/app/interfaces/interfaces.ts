import { Connection } from 'src/app/model/connection.model';
import { Key } from 'src/app/model/key.model';

export interface StatusResult {
  status: string;
}

export interface StatusMessageResult {
  status: string;
  message: string;
}

export interface StatusIdResult {
  status: string;
  id: number;
}

export interface LoginData {
  email: string;
  pass: string;
}

export interface RegisterData {
  email: string;
  conf: string;
  pass: string;
}

export interface LoginResult {
  status: string;
  id: number;
  email: string;
  token: string;
}

export interface InventoryInterface {
  id: number;
  idGame: number;
  idItem: number;
  item: ItemInterface;
  order: number;
  num: number;
}

export interface EquipmentInterface {
  head: ItemInterface;
  necklace: ItemInterface;
  body: ItemInterface;
  boots: ItemInterface;
  weapon: ItemInterface;
}

export interface GameInterface {
  id: number;
  name: string;
  idScenario: number;
  positionX: number;
  positionY: number;
  orientation: string;
  money: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  items: InventoryInterface[];
  equipment: EquipmentInterface;
}

export interface GameResult {
  status: string;
  list: GameInterface[];
}

export interface NewGameInterface {
  idGame: number;
  name: string;
}

export interface WorldInterface {
  id: number;
  name: string;
  description: string;
  wordOne: string;
  wordTwo: string;
  wordThree: string;
  friendly: boolean;
}

export interface WorldResult {
  status: string;
  list: WorldInterface[];
}

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

export interface PositionInterface {
  x: number;
  y: number;
}

export interface PositionSizeInterface {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LoadingStatusInterface {
  assets: boolean;
  unlockedWorlds: boolean;
  connections: boolean;
}

export interface KeyboardLayoutInterface {
  down: Key;
  up: Key;
  left: Key;
  right: Key;
  doAction: Key;
  openInventory: Key;
  hit: Key;
  esc: Key;
}

export interface PlayResult {
  status: string;
  idWorld: number;
  worldName: string;
  worldDescription: string;
  idScenario: number;
  scenarioName: string;
  mapBackground: string;
  game: GameInterface;
  blockers: PositionInterface[];
  scenarioDatas: ScenarioDataInterface[];
  scenarioObjects: ScenarioObjectInterface[];
  characters: CharacterInterface[];
}

export interface WorldStartInterface {
  idScenario: number;
  x: number;
  y: number;
  check: boolean;
}

export interface NPCData {
  isNPC: boolean;
  isEnemy: boolean;
  status: string;
  timer: number;
  remainingTime: number;
}

export interface TagInterface {
  id: number;
  name: string;
}

export interface TagResult {
  status: string;
  list: TagInterface[];
}

export interface AssetInterface {
  id: number;
  idWorld: number;
  name: string;
  url: string;
  tags: TagInterface[];
  tagList?: string;
}

export interface AssetResult {
  status: string;
  list: AssetInterface[];
}

export interface BackgroundCategoryInterface {
  id: number;
  name: string;
}

export interface BackgroundCategoryResult {
  status: string;
  list: BackgroundCategoryInterface[];
}

export interface BackgroundInterface {
  id: number;
  idBackgroundCategory: number;
  idAsset: number;
  assetUrl: string;
  name: string;
  crossable: boolean;
}

export interface BackgroundResult {
  status: string;
  list: BackgroundInterface[];
}

export interface ItemFrameInterface {
  id: number;
  idAsset: number;
  assetUrl: string;
  order: number;
}

export interface ItemTypeInterface {
  id: number;
  name: string;
}

export interface ItemInterface {
  id: number;
  type: number;
  idAsset: number;
  assetUrl: string;
  name: string;
  money: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  wearable: number;
  frames: ItemFrameInterface[];
}

export interface ItemResult {
  status: string;
  list: ItemInterface[];
}

export interface CharacterFrameInterface {
  id: number;
  idAsset: number;
  assetUrl: string;
  orientation: string;
  order: number;
}

export interface NarrativeInterface {
  id: number;
  dialog: string;
  order: number;
}

export interface AnimationImageInterface {
  up: string;
  down: string;
  left: string;
  right: string;
}

export interface AnimationNumInterface {
  up: number;
  down: number;
  left: number;
  right: number;
}

export interface CharacterTypeInterface {
  id: number;
  name: string;
}

export interface CharacterSizeInterface {
  width: number;
  height: number;
}

export interface CharacterInterface {
  id: number;
  name: string;
  width: number;
  blockWidth: number;
  height: number;
  blockHeight: number;
  fixedPosition: boolean;
  idAssetUp: number;
  assetUpUrl: string;
  idAssetDown: number;
  assetDownUrl: string;
  idAssetLeft: number;
  assetLeftUrl: string;
  idAssetRight: number;
  assetRightUrl: string;
  type: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  dropIdItem: number;
  dropChance: number;
  dropAssetUrl: string;
  respawn: number;
  framesUp: CharacterFrameInterface[];
  framesDown: CharacterFrameInterface[];
  framesLeft: CharacterFrameInterface[];
  framesRight: CharacterFrameInterface[];
  narratives: NarrativeInterface[];
}

export interface CharacterResult {
  status: string;
  list: CharacterInterface[];
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
