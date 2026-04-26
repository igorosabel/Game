import { CharacterInterface } from '@interfaces/character.interfaces';
import {
  EquipmentInterface,
  InventoryInterface,
  PositionInterface,
} from '@interfaces/player.interfaces';
import { ScenarioDataInterface, ScenarioObjectInterface } from '@interfaces/scenario.interfaces';
import Key from '@model/key.model';

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
  down: Key | null;
  up: Key | null;
  left: Key | null;
  right: Key | null;
  doAction: Key | null;
  openInventory: Key | null;
  hit: Key | null;
  esc: Key | null;
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
