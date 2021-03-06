import { ScenarioObject } from '../model/scenario-object.model';
import { Character }      from '../model/character.model';
import { Equipment }      from '../model/equipment.model';

export class AssetCache {
	_items: string[];
	_toLoad: number;
	_loaded: number;
	_list;

	constructor() {
		this._items = [];
		this._toLoad = 0;
		this._loaded = 0;
		this._list = {};
	}

	add(item: string) {
		if (item===null || item===''){
			return;
		}
		const ind = this._items.findIndex(x => x===item);
		if (ind==-1) {
			this._items.push(item);
		}
	}

	addScenarioObjects(list: ScenarioObject[]) {
		for (let so of list) {
			this.addScenarioObject(so);
		}
	}

	addScenarioObject(so: ScenarioObject) {
		this.add(so.assetUrl);
		this.add(so.assetActiveUrl);
		for (let drop of so.drops) {
			this.add(drop.assetUrl);
		}
		for (let frame of so.frames) {
			this.add(frame.assetUrl);
		}
	}

	addCharacters(list: Character[]) {
		for (let c of list) {
			this.addCharacter(c);
		}
	}

	addCharacter(c: Character) {
		this.add(c.assetUpUrl);
		this.add(c.assetDownUrl);
		this.add(c.assetLeftUrl);
		this.add(c.assetRightUrl);
		this.add(c.dropAssetUrl);
		for (let frame of c.framesUp) {
			this.add(frame.assetUrl);
		}
		for (let frame of c.framesDown) {
			this.add(frame.assetUrl);
		}
		for (let frame of c.framesLeft) {
			this.add(frame.assetUrl);
		}
		for (let frame of c.framesRight) {
			this.add(frame.assetUrl);
		}
	}

	addEquipment(equipment: Equipment) {
		if (equipment.head!==null) {
			this.add(equipment.head.assetUrl);
		}
		if (equipment.necklace!==null) {
			this.add(equipment.necklace.assetUrl);
		}
		if (equipment.body!==null) {
			this.add(equipment.body.assetUrl);
		}
		if (equipment.boots!==null) {
			this.add(equipment.boots.assetUrl);
		}
		if (equipment.weapon!==null) {
			this.add(equipment.weapon.assetUrl);
		}
	}

	load() {
		return new Promise<void>(resolve => {
			this._toLoad = this._items.length;
			let loadHandler = () => {
				this._loaded += 1;
				if (this._toLoad === this._loaded) {
					this._toLoad = 0;
					this._loaded = 0;
					resolve();
				}
			};

			this._items.forEach(item => {
				const image = new Image();
				image.addEventListener('load', loadHandler, false);
				image.src = item;

				this._list[item] = image;
			});
		});
	}

	get(item: string) {
		return this._list[item] ? this._list[item] : null;
	}
}
