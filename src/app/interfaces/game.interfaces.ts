import { CharacterInterface } from 'src/app/interfaces/character.interfaces';
import {
  EquipmentInterface,
  InventoryInterface,
  PositionInterface,
} from 'src/app/interfaces/player.interfaces';
import {
  ScenarioDataInterface,
  ScenarioObjectInterface,
} from 'src/app/interfaces/scenario.interfaces';
import { Key } from 'src/app/model/key.model';

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
