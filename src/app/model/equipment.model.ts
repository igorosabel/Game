import { EquipmentInterface } from 'src/app/interfaces/interfaces';
import { Item } from 'src/app/model/item.model';

export class Equipment {
  constructor(
    public head: Item = null,
    public necklace: Item = null,
    public body: Item = null,
    public boots: Item = null,
    public weapon: Item = null
  ) {}

  fromInterface(e: EquipmentInterface): Equipment {
    this.head = e.head !== null ? new Item().fromInterface(e.head) : null;
    this.necklace =
      e.necklace !== null ? new Item().fromInterface(e.necklace) : null;
    this.body = e.body !== null ? new Item().fromInterface(e.body) : null;
    this.boots = e.boots !== null ? new Item().fromInterface(e.boots) : null;
    this.weapon = e.weapon !== null ? new Item().fromInterface(e.weapon) : null;

    return this;
  }

  toInterface(): EquipmentInterface {
    return {
      head: this.head === null ? null : this.head.toInterface(),
      necklace: this.necklace === null ? null : this.necklace.toInterface(),
      body: this.body === null ? null : this.body.toInterface(),
      boots: this.boots === null ? null : this.boots.toInterface(),
      weapon: this.weapon === null ? null : this.weapon.toInterface(),
    };
  }
}
