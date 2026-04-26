import { NarrativeInterface } from '@interfaces/character.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Narrative {
  constructor(
    public id: number | null = null,
    public dialog: string | null = null,
    public order: number | null = null,
  ) {}

  fromInterface(n: NarrativeInterface): Narrative {
    this.id = n.id;
    this.dialog = urldecode(n.dialog);
    this.order = n.order;

    return this;
  }

  toInterface(): NarrativeInterface {
    return {
      id: this.id,
      dialog: urlencode(this.dialog),
      order: this.order,
    };
  }
}
