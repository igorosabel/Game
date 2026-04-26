export interface ItemFrameInterface {
  id: number | null;
  idAsset: number | null;
  assetUrl: string | null;
  order: number | null;
}

export interface ItemTypeInterface {
  id: number;
  name: string;
}

export interface ItemInterface {
  id: number | null;
  type: number | null;
  idAsset: number | null;
  assetUrl: string | null;
  name: string | null;
  money: number | null;
  health: number | null;
  attack: number | null;
  defense: number | null;
  speed: number | null;
  wearable: number | null;
  frames: ItemFrameInterface[];
}

export interface ItemResult {
  status: string;
  list: ItemInterface[];
}
