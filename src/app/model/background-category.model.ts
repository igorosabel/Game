import { BackgroundCategoryInterface } from 'src/app/interfaces/background.interfaces';
import { Utils } from 'src/app/modules/shared/utils.class';

export class BackgroundCategory {
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
