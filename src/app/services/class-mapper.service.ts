import { Injectable }         from '@angular/core';
import { World }              from '../model/world.model';
import { Scenario }           from '../model/scenario.model';
import { Tag }                from '../model/tag.model';
import { Asset }              from '../model/asset.model';
import { BackgroundCategory } from '../model/background-category.model';
import { Background }         from '../model/background.model';
import {
	WorldInterface,
	ScenarioInterface,
	TagInterface,
	AssetInterface,
	BackgroundCategoryInterface,
	BackgroundInterface
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
		const world = new World(w.id, w.name, w.description, w.wordOne, w.wordTwo, w.wordThree, w.friendly);
		return world;
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
		const scenario = new Scenario(s.id, s.idWorld, s.name, s.friendly);
		return scenario;
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
		const tag = new Tag(t.id, t.name);
		return tag;
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
		const asset = new Asset(a.id, a.idWorld, a.name, a.url, []);
		for (let t of a.tags) {
			asset.tags.push(this.getTag(t));
		}
		return asset;
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
		const backgroundCategory = new BackgroundCategory(bc.id, bc.name);
		return backgroundCategory;
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
		const background = new Background(b.id, b.idBackgroundCategory, b.idAsset, b.assetUrl, b.name, b.crossable);
		return background;
	}
}