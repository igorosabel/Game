import { BackgroundCategoryInterface } from '@interfaces/background.interfaces';
import Utils from '@shared/utils.class';

export default class BackgroundCategory {
  constructor(public id: number = null, public name: string = null) {}

  fromInterface(bc: BackgroundCategoryInterface): BackgroundCategory {
    this.id = bc.id;
    this.name = Utils.urldecode(bc.name);

    return this;
  }

  toInterface(): BackgroundCategoryInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
    };
  }
}
