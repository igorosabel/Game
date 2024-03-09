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
