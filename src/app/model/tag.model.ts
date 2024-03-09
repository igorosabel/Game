import { TagInterface } from 'src/app/interfaces/asset.interfaces';
import { Utils } from 'src/app/modules/shared/utils.class';

export class Tag {
  constructor(public id: number = null, public name: string = null) {}

  fromInterface(t: TagInterface): Tag {
    this.id = t.id;
    this.name = Utils.urldecode(t.name);

    return this;
  }

  toInterface(): TagInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
    };
  }
}
