export interface TagInterface {
  id: number | null;
  name: string | null;
}

export interface TagResult {
  status: string;
  list: TagInterface[];
}

export interface AssetInterface {
  id: number | null;
  idWorld: number | null;
  name: string | null;
  url: string | null;
  tags: TagInterface[];
  tagList?: string;
}

export interface AssetResult {
  status: string;
  list: AssetInterface[];
}
