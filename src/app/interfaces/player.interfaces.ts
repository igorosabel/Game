import { ItemInterface } from '@interfaces/item.interfaces';

export interface InventoryInterface {
  id: number | null;
  idGame: number | null;
  idItem: number | null;
  item: ItemInterface | null;
  order: number | null;
  num: number | null;
}

export interface EquipmentInterface {
  head: ItemInterface | null;
  necklace: ItemInterface | null;
  body: ItemInterface | null;
  boots: ItemInterface | null;
  weapon: ItemInterface | null;
}

export interface PositionInterface {
  x: number | null;
  y: number | null;
}

export interface PositionSizeInterface {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
}

export interface NPCData {
  isNPC: boolean;
  isEnemy: boolean;
  status: string;
  timer: number | undefined;
  remainingTime: number;
}

export type KeyHandler = () => void;
