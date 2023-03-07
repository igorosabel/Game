import { NarrativeInterface } from 'src/app/interfaces/interfaces';
import { Utils } from 'src/app/modules/shared/utils.class';

export class Narrative {
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
