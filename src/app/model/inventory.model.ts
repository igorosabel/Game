import { InventoryInterface } from '@interfaces/player.interfaces';
import Item from '@model/item.model';

export default class Inventory {
  constructor(
    public id: number | null = null,
    public idGame: number | null = null,
    public idItem: number | null = null,
    public item: Item | null = null,
    public order: number | null = null,
    public num: number | null = null,
  ) {}

  fromInterface(i: InventoryInterface): Inventory {
    this.id = i.id;
    this.idGame = i.idGame;
    this.idItem = i.idItem;
    this.item = i.item !== null ? new Item().fromInterface(i.item) : null;
    this.order = i.order;
    this.num = i.num;

    return this;
  }

  toInterface(): InventoryInterface {
    const inventory: InventoryInterface = {
      id: this.id,
      idGame: this.idGame,
      idItem: this.idItem,
      item: this.item === null ? null : this.item.toInterface(),
      order: this.order,
      num: this.num,
    };
    return inventory;
  }
}
