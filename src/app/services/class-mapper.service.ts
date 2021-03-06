import { Injectable }          from '@angular/core';
import { Inventory }           from '../model/inventory.model';
import { Game }                from '../model/game.model';
import { Equipment }           from '../model/equipment.model';
import { World }               from '../model/world.model';
import { Scenario }            from '../model/scenario.model';
import { ScenarioData }        from '../model/scenario-data.model';
import { Connection }          from '../model/connection.model';
import { Tag }                 from '../model/tag.model';
import { Asset }               from '../model/asset.model';
import { BackgroundCategory }  from '../model/background-category.model';
import { Background }          from '../model/background.model';
import { ItemFrame }           from '../model/item-frame.model';
import { Item }                from '../model/item.model';
import { CharacterFrame }      from '../model/character-frame.model';
import { Narrative }           from '../model/narrative.model';
import { Character }           from '../model/character.model';
import { ScenarioObjectDrop }  from '../model/scenario-object-drop.model';
import { ScenarioObjectFrame } from '../model/scenario-object-frame.model';
import { ScenarioObject }      from '../model/scenario-object.model';
import { Position }            from '../model/position.model';
import { CommonService }       from './common.service';
import {
	InventoryInterface,
	GameInterface,
	EquipmentInterface,
	WorldInterface,
	ScenarioInterface,
	ScenarioDataInterface,
	ConnectionInterface,
	TagInterface,
	AssetInterface,
	BackgroundCategoryInterface,
	BackgroundInterface,
	ItemFrameInterface,
	ItemInterface,
	CharacterFrameInterface,
	NarrativeInterface,
	CharacterInterface,
	ScenarioObjectDropInterface,
	ScenarioObjectFrameInterface,
	ScenarioObjectInterface,
	PositionInterface
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ClassMapperService {
	constructor(private cs: CommonService) {}

	getInventories(response: InventoryInterface[]): Inventory[] {
		const inventories: Inventory[] = [];

		for (let i of response) {
			inventories.push( this.getInventory(i) );
		}

		return inventories;
	}

	getInventory(i: InventoryInterface): Inventory {
		return new Inventory(
			i.id,
			i.idGame,
			i.idItem,
			this.getItem(i.item),
			i.order,
			i.num
		);
	}

	getEquipment(e: EquipmentInterface): Equipment {
		return new Equipment(
			(e.head===null) ? null : this.getItem(e.head),
			(e.necklace===null) ? null : this.getItem(e.necklace),
			(e.body===null) ? null : this.getItem(e.body),
			(e.boots===null) ? null : this.getItem(e.boots),
			(e.weapon===null) ? null : this.getItem(e.weapon)
		);
	}

	getGames(response: GameInterface[]) {
		const games: Game[] = [];

		for (let g of response) {
			games.push( this.getGame(g) );
		}

		return games;
	}

	getGame(g: GameInterface) {
		return new Game(
			g.id,
			this.cs.urldecode(g.name),
			g.idScenario,
			g.positionX,
			g.positionY,
			g.orientation,
			g.money,
			g.health,
			g.maxHealth,
			g.attack,
			g.defense,
			g.speed,
			this.getInventories(g.items),
			this.getEquipment(g.equipment)
		);
	}

	getWorlds(response: WorldInterface[]) {
		const worlds: World[] = [];

		for (let w of response) {
			worlds.push( this.getWorld(w) );
		}

		return worlds;
	}

	getWorld(w: WorldInterface) {
		return new World(
			w.id,
			this.cs.urldecode(w.name),
			this.cs.urldecode(w.description),
			this.cs.urldecode(w.wordOne),
			this.cs.urldecode(w.wordTwo),
			this.cs.urldecode(w.wordThree),
			w.friendly
		);
	}

	getScenarios(response: ScenarioInterface[]) {
		const scenarios: Scenario[] = [];

		for (let s of response) {
			scenarios.push( this.getScenario(s) );
		}

		return scenarios;
	}

	getScenario(s: ScenarioInterface) {
		return new Scenario(
			s.id,
			s.idWorld,
			this.cs.urldecode(s.name),
			s.startX,
			s.startY,
			s.initial,
			s.friendly
		);
	}

	getScenarioDatas(response: ScenarioDataInterface[]) {
		const scenarioDatas: ScenarioData[] = [];

		for (let sd of response) {
			scenarioDatas.push( this.getScenarioData(sd) );
		}

		return scenarioDatas;
	}

	getScenarioData(sd: ScenarioDataInterface) {
		return new ScenarioData(
			sd.id,
			sd.idScenario,
			sd.x,
			sd.y,
			sd.idBackground,
			this.cs.urldecode(sd.backgroundName),
			this.cs.urldecode(sd.backgroundAssetUrl),
			sd.idScenarioObject,
			this.cs.urldecode(sd.scenarioObjectName),
			this.cs.urldecode(sd.scenarioObjectAssetUrl),
			sd.scenarioObjectWidth,
			sd.scenarioObjectHeight,
			sd.scenarioObjectBlockWidth,
			sd.scenarioObjectBlockHeight,
			sd.idCharacter,
			this.cs.urldecode(sd.characterName),
			this.cs.urldecode(sd.characterAssetUrl),
			sd.characterWidth,
			sd.characterHeight,
			sd.characterBlockWidth,
			sd.characterBlockHeight,
			sd.characterHealth
		);
	}

	getConnections(response: ConnectionInterface[]) {
		const connections: Connection[] = [];

		for (let c of response) {
			connections.push( this.getConnection(c) );
		}

		return connections;
	}

	getConnection(c: ConnectionInterface) {
		return new Connection(
			c.from,
			this.cs.urldecode(c.fromName),
			c.to,
			this.cs.urldecode(c.toName),
			c.orientation
		);
	}

	getTags(response: TagInterface[]) {
		const tags: Tag[] = [];

		for (let t of response) {
			tags.push( this.getTag(t) );
		}

		return tags;
	}

	getTag(t: TagInterface) {
		return new Tag(
			t.id,
			this.cs.urldecode(t.name)
		);
	}

	getAssets(response: AssetInterface[]) {
		const assets: Asset[] = [];

		for (let a of response) {
			assets.push( this.getAsset(a) );
		}

		return assets;
	}

	getAsset(a: AssetInterface) {
		return new Asset(
			a.id,
			a.idWorld,
			this.cs.urldecode(a.name),
			this.cs.urldecode(a.url),
			this.getTags(a.tags)
		);
	}

	getBackgroundCategories(response: BackgroundCategoryInterface[]) {
		const backgroundCategories: BackgroundCategory[] = [];

		for (let bc of response) {
			backgroundCategories.push( this.getBackgroundCategory(bc) );
		}

		return backgroundCategories;
	}

	getBackgroundCategory(bc: BackgroundCategoryInterface) {
		return new BackgroundCategory(
			bc.id,
			this.cs.urldecode(bc.name)
		);
	}

	getBackgrounds(response: BackgroundInterface[]) {
		const backgrounds: Background[] = [];

		for (let b of response) {
			backgrounds.push( this.getBackground(b) );
		}

		return backgrounds;
	}

	getBackground(b: BackgroundInterface) {
		return new Background(
			b.id,
			b.idBackgroundCategory,
			b.idAsset,
			this.cs.urldecode(b.assetUrl),
			this.cs.urldecode(b.name),
			b.crossable
		);
	}

	getItemFrames(response: ItemFrameInterface[]) {
		const itemFrames: ItemFrame[] = [];

		for (let itf of response) {
			itemFrames.push( this.getItemFrame(itf) );
		}

		return itemFrames;
	}

	getItemFrame(itf: ItemFrameInterface) {
		return new ItemFrame(
			itf.id,
			itf.idAsset,
			this.cs.urldecode(itf.assetUrl),
			itf.order
		);
	}

	getItems(response: ItemInterface[]) {
		const items: Item[] = [];

		for (let i of response) {
			items.push( this.getItem(i) );
		}

		return items;
	}

	getItem(i: ItemInterface) {
		return new Item(
			i.id,
			i.type,
			i.idAsset,
			this.cs.urldecode(i.assetUrl),
			this.cs.urldecode(i.name),
			i.money,
			i.health,
			i.attack,
			i.defense,
			i.speed,
			i.wearable,
			this.getItemFrames(i.frames)
		);
	}

	getCharacterFrames(response: CharacterFrameInterface[]) {
		const characterFrames: CharacterFrame[] = [];

		for (let cf of response) {
			characterFrames.push( this.getCharacterFrame(cf) );
		}

		return characterFrames;
	}

	getCharacterFrame(cf: CharacterFrameInterface) {
		return new CharacterFrame(
			cf.id,
			cf.idAsset,
			this.cs.urldecode(cf.assetUrl),
			cf.orientation,
			cf.order
		);
	}

	getNarratives(response: NarrativeInterface[]) {
		const narratives: Narrative[] = [];

		for (let n of response) {
			narratives.push( this.getNarrative(n) );
		}

		return narratives;
	}

	getNarrative(n: NarrativeInterface) {
		return new Narrative(
			n.id,
			this.cs.urldecode(n.dialog),
			n.order
		);
	}

	getCharacters(response: CharacterInterface[]) {
		const characters: Character[] = [];

		for (let c of response) {
			characters.push( this.getCharacter(c) );
		}

		return characters;
	}

	getCharacter(c: CharacterInterface) {
		return new Character(
			c.id,
			this.cs.urldecode(c.name),
			c.width,
			c.blockWidth,
			c.height,
			c.blockHeight,
			c.fixedPosition,
			c.idAssetUp,
			this.cs.urldecode(c.assetUpUrl),
			c.idAssetDown,
			this.cs.urldecode(c.assetDownUrl),
			c.idAssetLeft,
			this.cs.urldecode(c.assetLeftUrl),
			c.idAssetRight,
			this.cs.urldecode(c.assetRightUrl),
			c.type,
			c.health,
			c.attack,
			c.defense,
			c.speed,
			c.dropIdItem,
			this.cs.urldecode(c.dropAssetUrl),
			c.dropChance,
			c.respawn,
			this.getCharacterFrames(c.framesUp),
			this.getCharacterFrames(c.framesDown),
			this.getCharacterFrames(c.framesLeft),
			this.getCharacterFrames(c.framesRight),
			this.getNarratives(c.narratives)
		);
	}

	getScenarioObjectFrames(response: ScenarioObjectFrameInterface[]) {
		const scenarioObjectFrames: ScenarioObjectFrame[] = [];

		for (let sof of response) {
			scenarioObjectFrames.push( this.getScenarioObjectFrame(sof) );
		}

		return scenarioObjectFrames;
	}

	getScenarioObjectFrame(sof: ScenarioObjectFrameInterface) {
		return new ScenarioObjectFrame(
			sof.id,
			sof.idAsset,
			this.cs.urldecode(sof.assetUrl),
			sof.order
		);
	}

	getScenarioObjectDrops(response: ScenarioObjectDropInterface[]) {
		const scenarioObjectDrops: ScenarioObjectDrop[] = [];

		for (let sod of response) {
			scenarioObjectDrops.push( this.getScenarioObjectDrop(sod) );
		}

		return scenarioObjectDrops;
	}

	getScenarioObjectDrop(sod: ScenarioObjectDropInterface) {
		return new ScenarioObjectDrop(
			sod.id,
			sod.idItem,
			this.cs.urldecode(sod.itemName),
			this.cs.urldecode(sod.assetUrl),
			sod.num
		);
	}

	getScenarioObjects(response: ScenarioObjectInterface[]) {
		const scenarioObjects: ScenarioObject[] = [];

		for (let so of response) {
			scenarioObjects.push( this.getScenarioObject(so) );
		}

		return scenarioObjects;
	}

	getScenarioObject(so: ScenarioObjectInterface) {
		return new ScenarioObject(
			so.id,
			this.cs.urldecode(so.name),
			so.idAsset,
			this.cs.urldecode(so.assetUrl),
			so.width,
			so.blockWidth,
			so.height,
			so.blockHeight,
			so.crossable,
			so.activable,
			so.idAssetActive,
			this.cs.urldecode(so.assetActiveUrl),
			so.activeTime,
			so.activeTrigger,
			(so.activeTriggerCustom!=null) ? this.cs.urldecode(so.activeTriggerCustom) : null,
			so.pickable,
			so.grabbable,
			so.breakable,
			this.getScenarioObjectDrops(so.drops),
			this.getScenarioObjectFrames(so.frames)
		);
	}

	getPositions(response: PositionInterface[]) {
		const positions: Position[] = [];

		for (let p of response) {
			positions.push( this.getPosition(p) );
		}

		return positions;
	}

	getPosition(p: PositionInterface) {
		return new Position(
			p.x,
			p.y
		);
	}
}
