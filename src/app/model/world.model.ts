import { WorldInterface } from '@interfaces/world.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

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
    this.name = urldecode(w.name);
    this.description = urldecode(w.description);
    this.wordOne = urldecode(w.wordOne);
    this.wordTwo = urldecode(w.wordTwo);
    this.wordThree = urldecode(w.wordThree);
    this.friendly = w.friendly;

    return this;
  }

  toInterface(): WorldInterface {
    const world: WorldInterface = {
      id: this.id,
      name: urlencode(this.name),
      description: urlencode(this.description),
      wordOne: urlencode(this.wordOne),
      wordTwo: urlencode(this.wordTwo),
      wordThree: urlencode(this.wordThree),
      friendly: this.friendly,
    };
    return world;
  }
}
