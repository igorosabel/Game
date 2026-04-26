import { CharacterInterface } from '@interfaces/character.interfaces';
import { Orientation } from '@interfaces/interfaces';
import {
  EquipmentInterface,
  InventoryInterface,
  PositionInterface,
} from '@interfaces/player.interfaces';
import { ScenarioDataInterface, ScenarioObjectInterface } from '@interfaces/scenario.interfaces';
import Key from '@model/key.model';

export interface GameInterface {
  id: number | null;
  name: string | null;
  idScenario: number | null;
  positionX: number | null;
  positionY: number | null;
  orientation: Orientation | null;
  money: number | null;
  health: number | null;
  maxHealth: number | null;
  attack: number | null;
  defense: number | null;
  speed: number | null;
  items: InventoryInterface[];
  equipment: EquipmentInterface | null;
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
