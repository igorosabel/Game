export interface StatusResult {
	status: string;
}

export interface StatusMessageResult {
	status: string;
	message: string;
}

export interface StatusIdResult {
	status: string;
	id: number;
}

export interface LoginData {
	email: string;
	pass: string;
}

export interface RegisterData {
	email: string;
	conf: string;
	pass: string;
}

export interface LoginResult {
	status: string;
	id: number;
	email: string;
	token: string;
}

export interface InventoryInterface {
	id: number;
	idGame: number;
	idItem: number;
	item: ItemInterface;
	order: number;
	num: number;
}

export interface GameInterface {
	id: number;
	name: string;
	idScenario: number;
	positionX: number;
	positionY: number;
	money: number;
	health: number;
	maxHealth: number;
	attack: number;
	defense: number;
	speed: number;
	items: InventoryInterface[];
}

export interface GameResult {
	status: string;
	list: GameInterface[];
}

export interface NewGameInterface {
	idGame: number;
	name: string;
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
	startX: number;
	startY: number;
	initial: boolean;
	friendly: boolean;
}

export interface ScenarioResult {
	status: string;
	list: ScenarioInterface[];
}

export interface ScenarioDataInterface {
	id: number;
	idScenario: number;
	x: number;
	y: number;
	idBackground: number;
	backgroundName: string;
	backgroundAssetUrl: string;
	idScenarioObject: number;
	scenarioObjectName: string;
	scenarioObjectAssetUrl: string;
	scenarioObjectWidth: number;
	scenarioObjectHeight: number;
	idCharacter: number;
	characterName: string;
	characterAssetUrl: string;
	characterWidth: number;
	characterHeight: number;
}

export interface ConnectionInterface {
	from: number;
	fromName: string;
	to: number;
	toName: string;
	orientation: string;
}

export interface ScenarioDataResult {
	status: string;
	scenario: ScenarioInterface;
	data: ScenarioDataInterface[];
	connection: ConnectionInterface[];
}

export interface BlockerInterface {
	x: number;
	y: number;
}

export interface PlayResult {
	status: string;
	idWorld: number;
	worldName: string;
	worldDescription: string;
	idScenario: number;
	scenarioName: string;
	mapBackground: string;
	game: GameInterface;
	blockers: BlockerInterface[];
	scenarioDatas: ScenarioDataInterface[];
	scenarioObjects: ScenarioObjectInterface[];
	characters: CharacterInterface[];
}

export interface WorldStartInterface {
	idScenario: number;
	x: number;
	y: number;
	check: boolean;
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

export interface CharacterInterface {
	id: number;
	name: string;
	width: number;
	height: number;
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

export interface ScenarioObjectDropInterface {
	id: number;
	idItem: number;
	itemName: string;
	assetUrl: string;
	num: number;
}

export interface ScenarioObjectFrameInterface {
	id: number;
	idAsset: number;
	assetUrl: string;
	order: number;
}

export interface ScenarioObjectInterface {
	id: number;
	name: string;
	idAsset: number;
	assetUrl: string;
	width: number;
	height: number;
	crossable: boolean;
	activable: boolean;
	idAssetActive: number;
	assetActiveUrl: string;
	activeTime: number;
	activeTrigger: number;
	activeTriggerCustom: string;
	pickable: boolean;
	grabbable: boolean;
	breakable: boolean;
	drops: ScenarioObjectDropInterface[];
	frames: ScenarioObjectFrameInterface[];
}

export interface ScenarioObjectResult {
	status: string;
	list: ScenarioObjectInterface[];
}
