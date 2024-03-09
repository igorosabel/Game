import { Injectable } from '@angular/core';
import {
  AssetInterface,
  TagInterface,
} from 'src/app/interfaces/asset.interfaces';
import {
  BackgroundCategoryInterface,
  BackgroundInterface,
} from 'src/app/interfaces/background.interfaces';
import {
  CharacterFrameInterface,
  CharacterInterface,
  NarrativeInterface,
} from 'src/app/interfaces/character.interfaces';
import { GameInterface } from 'src/app/interfaces/game.interfaces';
import {
  ItemFrameInterface,
  ItemInterface,
} from 'src/app/interfaces/item.interfaces';
import {
  EquipmentInterface,
  InventoryInterface,
  PositionInterface,
} from 'src/app/interfaces/player.interfaces';
import {
  ConnectionInterface,
  ScenarioDataInterface,
  ScenarioInterface,
  ScenarioObjectDropInterface,
  ScenarioObjectFrameInterface,
  ScenarioObjectInterface,
} from 'src/app/interfaces/scenario.interfaces';
import { WorldInterface } from 'src/app/interfaces/world.interfaces';
import { Asset } from 'src/app/model/asset.model';
import { BackgroundCategory } from 'src/app/model/background-category.model';
import { Background } from 'src/app/model/background.model';
import { CharacterFrame } from 'src/app/model/character-frame.model';
import { Character } from 'src/app/model/character.model';
import { Connection } from 'src/app/model/connection.model';
import { Equipment } from 'src/app/model/equipment.model';
import { Game } from 'src/app/model/game.model';
import { Inventory } from 'src/app/model/inventory.model';
import { ItemFrame } from 'src/app/model/item-frame.model';
import { Item } from 'src/app/model/item.model';
import { Narrative } from 'src/app/model/narrative.model';
import { Position } from 'src/app/model/position.model';
import { ScenarioData } from 'src/app/model/scenario-data.model';
import { ScenarioObjectDrop } from 'src/app/model/scenario-object-drop.model';
import { ScenarioObjectFrame } from 'src/app/model/scenario-object-frame.model';
import { ScenarioObject } from 'src/app/model/scenario-object.model';
import { Scenario } from 'src/app/model/scenario.model';
import { Tag } from 'src/app/model/tag.model';
import { World } from 'src/app/model/world.model';

@Injectable({
  providedIn: 'root',
})
export class ClassMapperService {
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
