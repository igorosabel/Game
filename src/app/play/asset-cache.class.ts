import { Character } from 'src/app/model/character.model';
import { Equipment } from 'src/app/model/equipment.model';
import { ScenarioObject } from 'src/app/model/scenario-object.model';

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

  add(item: string): void {
    if (item === null || item === '') {
      return;
    }
    const ind: number = this._items.findIndex(
      (x: string): boolean => x === item
    );
    if (ind == -1) {
      this._items.push(item);
    }
  }

  addScenarioObjects(list: ScenarioObject[]): void {
    for (const so of list) {
      this.addScenarioObject(so);
    }
  }

  addScenarioObject(so: ScenarioObject): void {
    this.add(so.assetUrl);
    this.add(so.assetActiveUrl);
    for (const drop of so.drops) {
      this.add(drop.assetUrl);
    }
    for (const frame of so.frames) {
      this.add(frame.assetUrl);
    }
  }

  addCharacters(list: Character[]): void {
    for (const c of list) {
      this.addCharacter(c);
    }
  }

  addCharacter(c: Character): void {
    this.add(c.assetUpUrl);
    this.add(c.assetDownUrl);
    this.add(c.assetLeftUrl);
    this.add(c.assetRightUrl);
    this.add(c.dropAssetUrl);
    for (const frame of c.framesUp) {
      this.add(frame.assetUrl);
    }
    for (const frame of c.framesDown) {
      this.add(frame.assetUrl);
    }
    for (const frame of c.framesLeft) {
      this.add(frame.assetUrl);
    }
    for (const frame of c.framesRight) {
      this.add(frame.assetUrl);
    }
  }

  addEquipment(equipment: Equipment): void {
    if (equipment.head !== null) {
      this.add(equipment.head.assetUrl);
    }
    if (equipment.necklace !== null) {
      this.add(equipment.necklace.assetUrl);
    }
    if (equipment.body !== null) {
      this.add(equipment.body.assetUrl);
    }
    if (equipment.boots !== null) {
      this.add(equipment.boots.assetUrl);
    }
    if (equipment.weapon !== null) {
      this.add(equipment.weapon.assetUrl);
    }
  }

  load(): Promise<void> {
    return new Promise<void>((resolve): void => {
      this._toLoad = this._items.length;
      const loadHandler = (): void => {
        this._loaded += 1;
        if (this._toLoad === this._loaded) {
          this._toLoad = 0;
          this._loaded = 0;
          resolve();
        }
      };

      this._items.forEach((item: string): void => {
        const image = new Image();
        image.addEventListener('load', loadHandler, false);
        image.src = item;

        this._list[item] = image;
      });
    });
  }

  get(item: string): any {
    return this._list[item] ? this._list[item] : null;
  }
}
