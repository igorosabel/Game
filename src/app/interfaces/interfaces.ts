export interface StatusResult {
	status: string;
}

export interface LoginData {
	name: string;
	pass: string;
}

export interface LoginResult {
	status: string;
	id: number;
	name: string;
	token: string;
}

export interface WorldInterface {
	id: number;
	name: string;
	description: string;
	wordOne: string;
	wordTwo: string;
	wordThree: string;
	friendly: boolean;
}

export interface WorldResult {
	status: string;
	list: WorldInterface[];
}

export interface ScenarioInterface {
	id: number;
	idWorld: number;
	name: string;
	friendly: boolean;
}

export interface ScenarioResult {
	status: string;
	list: ScenarioInterface[];
}

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

export interface ItemFrameInterface {
	id: number;
	idAsset: number;
	assetUrl: string;
	order: number;
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
