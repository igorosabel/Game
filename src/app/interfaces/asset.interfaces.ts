export interface TagInterface {
  id: number;
  name: string;
}

export interface TagResult {
  status: string;
  list: TagInterface[];
}

export interface AssetInterface {
  id: number;
  idWorld: number;
  name: string;
  url: string;
  tags: TagInterface[];
  tagList?: string;
}

export interface AssetResult {
  status: string;
  list: AssetInterface[];
}
