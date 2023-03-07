import {
  GameInterface,
  InventoryInterface,
} from 'src/app/interfaces/interfaces';
import { Equipment } from 'src/app/model/equipment.model';
import { Inventory } from 'src/app/model/inventory.model';
import { Utils } from 'src/app/modules/shared/utils.class';

export class Game {
  constructor(
    public id: number = null,
    public name: string = null,
    public idScenario: number = null,
    public positionX: number = null,
    public positionY: number = null,
    public orientation: string = null,
    public money: number = null,
    public health: number = null,
    public maxHealth: number = null,
    public attack: number = null,
    public defense: number = null,
    public speed: number = null,
    public items: Inventory[] = [],
    public equipment: Equipment = null
  ) {}

  fromInterface(g: GameInterface): Game {
    this.id = g.id;
    this.name = Utils.urldecode(g.name);
    this.idScenario = g.idScenario;
    this.positionX = g.positionX;
    this.positionY = g.positionY;
    this.orientation = g.orientation;
    this.money = g.money;
    this.health = g.health;
    this.maxHealth = g.maxHealth;
    this.attack = g.attack;
    this.defense = g.defense;
    this.speed = g.speed;
    this.items = g.items.map((i: InventoryInterface): Inventory => {
      return new Inventory().fromInterface(i);
    });
    this.equipment = new Equipment().fromInterface(g.equipment);

    return this;
  }

  toInterface(): GameInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
      idScenario: this.idScenario,
      positionX: this.positionX,
      positionY: this.positionY,
      orientation: this.orientation,
      money: this.money,
      health: this.health,
      maxHealth: this.maxHealth,
      attack: this.attack,
      defense: this.defense,
      speed: this.speed,
      items: this.items.map((i: Inventory): InventoryInterface => {
        return i.toInterface();
      }),
      equipment: this.equipment.toInterface(),
    };
  }
}
