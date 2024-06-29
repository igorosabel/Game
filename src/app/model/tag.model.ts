import { TagInterface } from '@interfaces/asset.interfaces';
import Utils from '@shared/utils.class';

export default class Tag {
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
