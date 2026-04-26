export interface BackgroundCategoryInterface {
  id: number | null;
  name: string | null;
}

export interface BackgroundCategoryResult {
  status: string;
  list: BackgroundCategoryInterface[];
}

export interface BackgroundInterface {
  id: number | null;
  idBackgroundCategory: number | null;
  idAsset: number | null;
  assetUrl: string | null;
  name: string | null;
  crossable: boolean;
}

export interface BackgroundResult {
  status: string;
  list: BackgroundInterface[];
}
