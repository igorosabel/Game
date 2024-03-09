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
