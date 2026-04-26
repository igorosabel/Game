export interface CharacterFrameInterface {
  id: number | null;
  idAsset: number | null;
  assetUrl: string | null;
  orientation: string | null;
  order: number | null;
}

export interface NarrativeInterface {
  id: number | null;
  dialog: string | null;
  order: number | null;
}

export interface AnimationImageInterface {
  up: string;
  down: string;
  left: string;
  right: string;
}

export interface AnimationNumInterface {
  up: number | undefined;
  down: number | undefined;
  left: number | undefined;
  right: number | undefined;
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
  id: number | null;
  name: string | null;
  width: number | null;
  blockWidth: number | null;
  height: number | null;
  blockHeight: number | null;
  fixedPosition: boolean;
  idAssetUp: number | null;
  assetUpUrl: string | null;
  idAssetDown: number | null;
  assetDownUrl: string | null;
  idAssetLeft: number | null;
  assetLeftUrl: string | null;
  idAssetRight: number | null;
  assetRightUrl: string | null;
  type: number | null;
  health: number | null;
  attack: number | null;
  defense: number | null;
  speed: number | null;
  dropIdItem: number | null;
  dropChance: number | null;
  dropAssetUrl: string | null;
  respawn: number | null;
  framesUp: CharacterFrameInterface[];
  framesDown: CharacterFrameInterface[];
  framesLeft: CharacterFrameInterface[];
  framesRight: CharacterFrameInterface[];
  narratives: NarrativeInterface[];
}

export type CharacterFrameDirection = 'Up' | 'Down' | 'Left' | 'Right';

export type CharacterSpriteOption =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'death'
  | 'hit-up'
  | 'hit-down'
  | 'hit-left'
  | 'hit-right';

export interface CharacterResult {
  status: string;
  list: CharacterInterface[];
}
