import { BackgroundCategoryInterface } from '@interfaces/background.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class BackgroundCategory {
  constructor(public id: number = null, public name: string = null) {}

  fromInterface(bc: BackgroundCategoryInterface): BackgroundCategory {
    this.id = bc.id;
    this.name = urldecode(bc.name);

    return this;
  }

  toInterface(): BackgroundCategoryInterface {
    return {
      id: this.id,
      name: urlencode(this.name),
    };
  }
}
