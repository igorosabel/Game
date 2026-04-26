import { GameInterface } from '@interfaces/game.interfaces';
import { Orientation } from '@interfaces/interfaces';
import { InventoryInterface } from '@interfaces/player.interfaces';
import Equipment from '@model/equipment.model';
import Inventory from '@model/inventory.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class Game {
  constructor(
    public id: number | null = null,
    public name: string | null = null,
    public idScenario: number | null = null,
    public positionX: number | null = null,
    public positionY: number | null = null,
    public orientation: Orientation | null = null,
    public money: number | null = null,
    public health: number | null = null,
    public maxHealth: number | null = null,
    public attack: number | null = null,
    public defense: number | null = null,
    public speed: number | null = null,
    public items: Inventory[] = [],
    public equipment: Equipment | null = null,
  ) {}

  fromInterface(g: GameInterface): Game {
    this.id = g.id;
    this.name = urldecode(g.name);
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
    this.equipment = g.equipment !== null ? new Equipment().fromInterface(g.equipment) : null;

    return this;
  }

  toInterface(): GameInterface {
    return {
      id: this.id,
      name: urlencode(this.name),
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
      equipment: this.equipment !== null ? this.equipment.toInterface() : null,
    };
  }
}
