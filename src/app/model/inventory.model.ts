import { InventoryInterface } from '@interfaces/player.interfaces';
import Item from '@model/item.model';

export default class Inventory {
  constructor(
    public id: number = null,
    public idGame: number = null,
    public idItem: number = null,
    public item: Item = null,
    public order: number = null,
    public num: number = null
  ) {}

  fromInterface(i: InventoryInterface): Inventory {
    this.id = i.id;
    this.idGame = i.idGame;
    this.idItem = i.idItem;
    this.item = new Item().fromInterface(i.item);
    this.order = i.order;
    this.num = i.num;

    return this;
  }

  toInterface(): InventoryInterface {
    const inventory: InventoryInterface = {
      id: this.id,
      idGame: this.idGame,
      idItem: this.idItem,
      item: this.item.toInterface(),
      order: this.order,
      num: this.num,
    };
    return inventory;
  }
}
