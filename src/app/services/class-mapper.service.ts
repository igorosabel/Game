import { Injectable }          from '@angular/core';
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
import { Character }           from '../model/character.model';
import { ScenarioObjectDrop }  from '../model/scenario-object-drop.model';
import { ScenarioObjectFrame } from '../model/scenario-object-frame.model';
import { ScenarioObject }      from '../model/scenario-object.model';
import {
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
	CharacterInterface,
	ScenarioObjectDropInterface,
	ScenarioObjectFrameInterface,
	ScenarioObjectInterface
} from '../interfaces/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ClassMapperService {
	constructor() {}

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
			w.name,
			w.description,
			w.wordOne,
			w.wordTwo,
			w.wordThree,
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
			s.name,
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
			sd.x,
			sd.y,
			sd.idBackground,
			sd.backgroundName,
			sd.backgroundAssetUrl,
			sd.idScenarioObject,
			sd.scenarioObjectName,
			sd.scenarioObjectAssetUrl,
			sd.idCharacter,
			sd.characterName,
			sd.characterAssetUrl
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
			c.to,
			c.toName,
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
			t.name
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
			a.name,
			a.url,
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
			bc.name
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
			b.assetUrl,
			b.name,
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
			itf.assetUrl,
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
			i.assetUrl,
			i.name,
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
			cf.assetUrl,
			cf.orientation,
			cf.order
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
			c.name,
			c.idAssetUp,
			c.assetUpUrl,
			c.idAssetDown,
			c.assetDownUrl,
			c.idAssetLeft,
			c.assetLeftUrl,
			c.idAssetRight,
			c.assetRightUrl,
			c.type,
			c.health,
			c.attack,
			c.defense,
			c.speed,
			c.dropIdItem,
			c.dropAssetUrl,
			c.dropChance,
			c.respawn,
			this.getCharacterFrames(c.framesUp),
			this.getCharacterFrames(c.framesDown),
			this.getCharacterFrames(c.framesLeft),
			this.getCharacterFrames(c.framesRight)
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
			sof.assetUrl,
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
			sod.itemName,
			sod.assetUrl,
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
			so.name,
			so.idAsset,
			so.assetUrl,
			so.width,
			so.height,
			so.crossable,
			so.activable,
			so.idAssetActive,
			so.assetActiveUrl,
			so.activeTime,
			so.activeTrigger,
			so.activeTriggerCustom,
			so.pickable,
			so.grabbable,
			so.breakable,
			this.getScenarioObjectDrops(so.drops),
			this.getScenarioObjectFrames(so.frames)
		);
	}
}