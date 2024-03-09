import { ItemInterface } from 'src/app/interfaces/item.interfaces';

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

export interface NPCData {
  isNPC: boolean;
  isEnemy: boolean;
  status: string;
  timer: number;
  remainingTime: number;
}
