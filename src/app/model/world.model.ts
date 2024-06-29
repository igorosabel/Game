import { WorldInterface } from '@interfaces/world.interfaces';
import Utils from '@shared/utils.class';

export default class World {
  constructor(
    public id: number = null,
    public name: string = null,
    public description: string = null,
    public wordOne: string = null,
    public wordTwo: string = null,
    public wordThree: string = null,
    public friendly: boolean = false
  ) {}

  fromInterface(w: WorldInterface): World {
    this.id = w.id;
    this.name = Utils.urldecode(w.name);
    this.description = Utils.urldecode(w.description);
    this.wordOne = Utils.urldecode(w.wordOne);
    this.wordTwo = Utils.urldecode(w.wordTwo);
    this.wordThree = Utils.urldecode(w.wordThree);
    this.friendly = w.friendly;

    return this;
  }

  toInterface(): WorldInterface {
    const world: WorldInterface = {
      id: this.id,
      name: this.name,
      description: this.description,
      wordOne: this.wordOne,
      wordTwo: this.wordTwo,
      wordThree: this.wordThree,
      friendly: this.friendly,
    };
    return world;
  }
}
