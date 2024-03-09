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
