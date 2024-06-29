import { Injectable } from '@angular/core';
import { AssetInterface, TagInterface } from '@interfaces/asset.interfaces';
import {
  BackgroundCategoryInterface,
  BackgroundInterface,
} from '@interfaces/background.interfaces';
import {
  CharacterFrameInterface,
  CharacterInterface,
  NarrativeInterface,
} from '@interfaces/character.interfaces';
import { GameInterface } from '@interfaces/game.interfaces';
import { ItemFrameInterface, ItemInterface } from '@interfaces/item.interfaces';
import {
  EquipmentInterface,
  InventoryInterface,
  PositionInterface,
} from '@interfaces/player.interfaces';
import {
  ConnectionInterface,
  ScenarioDataInterface,
  ScenarioInterface,
  ScenarioObjectDropInterface,
  ScenarioObjectFrameInterface,
  ScenarioObjectInterface,
} from '@interfaces/scenario.interfaces';
import { WorldInterface } from '@interfaces/world.interfaces';
import Asset from '@model/asset.model';
import BackgroundCategory from '@model/background-category.model';
import Background from '@model/background.model';
import CharacterFrame from '@model/character-frame.model';
import Character from '@model/character.model';
import Connection from '@model/connection.model';
import Equipment from '@model/equipment.model';
import Game from '@model/game.model';
import Inventory from '@model/inventory.model';
import ItemFrame from '@model/item-frame.model';
import Item from '@model/item.model';
import Narrative from '@model/narrative.model';
import Position from '@model/position.model';
import ScenarioData from '@model/scenario-data.model';
import ScenarioObjectDrop from '@model/scenario-object-drop.model';
import ScenarioObjectFrame from '@model/scenario-object-frame.model';
import ScenarioObject from '@model/scenario-object.model';
import Scenario from '@model/scenario.model';
import Tag from '@model/tag.model';
import World from '@model/world.model';

@Injectable({
  providedIn: 'root',
})
export default class ClassMapperService {
  getInventories(is: InventoryInterface[]): Inventory[] {
    return is.map((i: InventoryInterface): Inventory => {
      return this.getInventory(i);
    });
  }

  getInventory(i: InventoryInterface): Inventory {
    return new Inventory().fromInterface(i);
  }

  getEquipment(e: EquipmentInterface): Equipment {
    return new Equipment().fromInterface(e);
  }

  getGames(gs: GameInterface[]): Game[] {
    return gs.map((g: GameInterface): Game => {
      return this.getGame(g);
    });
  }

  getGame(g: GameInterface): Game {
    return new Game().fromInterface(g);
  }

  getWorlds(ws: WorldInterface[]): World[] {
    return ws.map((w: WorldInterface): World => {
      return this.getWorld(w);
    });
  }

  getWorld(w: WorldInterface): World {
    return new World().fromInterface(w);
  }

  getScenarios(ss: ScenarioInterface[]): Scenario[] {
    return ss.map((s: ScenarioInterface): Scenario => {
      return this.getScenario(s);
    });
  }

  getScenario(s: ScenarioInterface): Scenario {
    return new Scenario().fromInterface(s);
  }

  getScenarioDatas(sds: ScenarioDataInterface[]): ScenarioData[] {
    return sds.map((sd: ScenarioDataInterface): ScenarioData => {
      return this.getScenarioData(sd);
    });
  }

  getScenarioData(sd: ScenarioDataInterface): ScenarioData {
    return new ScenarioData().fromInterface(sd);
  }

  getConnections(cs: ConnectionInterface[]): Connection[] {
    return cs.map((c: ConnectionInterface): Connection => {
      return this.getConnection(c);
    });
  }

  getConnection(c: ConnectionInterface): Connection {
    return new Connection().fromInterface(c);
  }

  getTags(ts: TagInterface[]): Tag[] {
    return ts.map((t: TagInterface): Tag => {
      return this.getTag(t);
    });
  }

  getTag(t: TagInterface): Tag {
    return new Tag().fromInterface(t);
  }

  getAssets(as: AssetInterface[]): Asset[] {
    return as.map((a: AssetInterface): Asset => {
      return this.getAsset(a);
    });
  }

  getAsset(a: AssetInterface): Asset {
    return new Asset().fromInterface(a);
  }

  getBackgroundCategories(
    bcs: BackgroundCategoryInterface[]
  ): BackgroundCategory[] {
    return bcs.map((bc: BackgroundCategoryInterface): BackgroundCategory => {
      return this.getBackgroundCategory(bc);
    });
  }

  getBackgroundCategory(bc: BackgroundCategoryInterface): BackgroundCategory {
    return new BackgroundCategory().fromInterface(bc);
  }

  getBackgrounds(bs: BackgroundInterface[]): Background[] {
    return bs.map((b: BackgroundInterface): Background => {
      return this.getBackground(b);
    });
  }

  getBackground(b: BackgroundInterface): Background {
    return new Background().fromInterface(b);
  }

  getItemFrames(itfs: ItemFrameInterface[]): ItemFrame[] {
    return itfs.map((itf: ItemFrameInterface): ItemFrame => {
      return this.getItemFrame(itf);
    });
  }

  getItemFrame(itf: ItemFrameInterface): ItemFrame {
    return new ItemFrame().fromInterface(itf);
  }

  getItems(is: ItemInterface[]): Item[] {
    return is.map((i: ItemInterface): Item => {
      return this.getItem(i);
    });
  }

  getItem(i: ItemInterface): Item {
    return new Item().fromInterface(i);
  }

  getCharacterFrames(cfs: CharacterFrameInterface[]): CharacterFrame[] {
    return cfs.map((cf: CharacterFrameInterface): CharacterFrame => {
      return this.getCharacterFrame(cf);
    });
  }

  getCharacterFrame(cf: CharacterFrameInterface): CharacterFrame {
    return new CharacterFrame().fromInterface(cf);
  }

  getNarratives(ns: NarrativeInterface[]): Narrative[] {
    return ns.map((n: NarrativeInterface): Narrative => {
      return this.getNarrative(n);
    });
  }

  getNarrative(n: NarrativeInterface): Narrative {
    return new Narrative().fromInterface(n);
  }

  getCharacters(cs: CharacterInterface[]): Character[] {
    return cs.map((c: CharacterInterface): Character => {
      return this.getCharacter(c);
    });
  }

  getCharacter(c: CharacterInterface): Character {
    return new Character().fromInterface(c);
  }

  getScenarioObjectFrames(
    sofs: ScenarioObjectFrameInterface[]
  ): ScenarioObjectFrame[] {
    return sofs.map(
      (sof: ScenarioObjectFrameInterface): ScenarioObjectFrame => {
        return this.getScenarioObjectFrame(sof);
      }
    );
  }

  getScenarioObjectFrame(
    sof: ScenarioObjectFrameInterface
  ): ScenarioObjectFrame {
    return new ScenarioObjectFrame().fromInterface(sof);
  }

  getScenarioObjectDrops(
    sods: ScenarioObjectDropInterface[]
  ): ScenarioObjectDrop[] {
    return sods.map((sod: ScenarioObjectDropInterface): ScenarioObjectDrop => {
      return this.getScenarioObjectDrop(sod);
    });
  }

  getScenarioObjectDrop(sod: ScenarioObjectDropInterface): ScenarioObjectDrop {
    return new ScenarioObjectDrop().fromInterface(sod);
  }

  getScenarioObjects(sos: ScenarioObjectInterface[]): ScenarioObject[] {
    return sos.map((so: ScenarioObjectInterface): ScenarioObject => {
      return this.getScenarioObject(so);
    });
  }

  getScenarioObject(so: ScenarioObjectInterface): ScenarioObject {
    return new ScenarioObject().fromInterface(so);
  }

  getPositions(ps: PositionInterface[]): Position[] {
    return ps.map((p: PositionInterface): Position => {
      return this.getPosition(p);
    });
  }

  getPosition(p: PositionInterface): Position {
    return new Position().fromInterface(p);
  }
}
