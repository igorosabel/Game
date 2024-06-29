import { NarrativeInterface } from '@interfaces/character.interfaces';
import Utils from '@shared/utils.class';

export default class Narrative {
  constructor(
    public id: number = null,
    public dialog: string = null,
    public order: number = null
  ) {}

  fromInterface(n: NarrativeInterface): Narrative {
    this.id = n.id;
    this.dialog = Utils.urldecode(n.dialog);
    this.order = n.order;

    return this;
  }

  toInterface(): NarrativeInterface {
    return {
      id: this.id,
      dialog: Utils.urlencode(this.dialog),
      order: this.order,
    };
  }
}
