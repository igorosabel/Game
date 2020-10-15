import { Injectable }          from '@angular/core';
import { World }               from '../model/world.model';
import { Scenario }            from '../model/scenario.model';
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
			let world = this.getWorld(w);
			worlds.push(world);
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
			let scenario = this.getScenario(s);
			scenarios.push(scenario);
		}

		return scenarios;
	}

	getScenario(s: ScenarioInterface) {
		return new Scenario(
			s.id,
			s.idWorld,
			s.name,
			s.friendly
		);
	}

	getTags(response: TagInterface[]) {
		const tags: Tag[] = [];

		for (let t of response) {
			let tag = this.getTag(t);
			tags.push(tag);
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
			let asset = this.getAsset(a);
			assets.push(asset);
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
			let backgroundCategory = this.getBackgroundCategory(bc);
			backgroundCategories.push(backgroundCategory);
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
			let background = this.getBackground(b);
			backgrounds.push(background);
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
			let itemFrame = this.getItemFrame(itf);
			itemFrames.push(itemFrame);
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
			let item = this.getItem(i);
			items.push(item);
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
			let characterFrame = this.getCharacterFrame(cf);
			characterFrames.push(characterFrame);
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
			let character = this.getCharacter(c);
			characters.push(character);
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
			let scenarioObjectFrame = this.getScenarioObjectFrame(sof);
			scenarioObjectFrames.push(scenarioObjectFrame);
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
			let scenarioObjectDrop = this.getScenarioObjectDrop(sod);
			scenarioObjectDrops.push(scenarioObjectDrop);
		}

		return scenarioObjectDrops;
	}

	getScenarioObjectDrop(sod: ScenarioObjectDropInterface) {
		return new ScenarioObjectDrop(
			sod.id,
			sod.idAsset,
			sod.assetUrl,
			sod.num
		);
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
