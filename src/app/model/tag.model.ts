import { TagInterface } from '@interfaces/asset.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Tag {
  constructor(
    public id: number | null = null,
    public name: string | null = null,
  ) {}

  fromInterface(t: TagInterface): Tag {
    this.id = t.id;
    this.name = urldecode(t.name);

    return this;
  }

  toInterface(): TagInterface {
    return {
      id: this.id,
      name: urlencode(this.name),
    };
  }
}
