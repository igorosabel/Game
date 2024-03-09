import { ScenarioInterface } from 'src/app/interfaces/scenario.interfaces';
import { Utils } from 'src/app/modules/shared/utils.class';

export class Scenario {
  constructor(
    public id: number = null,
    public idWorld: number = null,
    public name: string = null,
    public startX: number = null,
    public startY: number = null,
    public initial: boolean = false,
    public friendly: boolean = false
  ) {}

  fromInterface(s: ScenarioInterface): Scenario {
    this.id = s.id;
    this.idWorld = s.idWorld;
    this.name = Utils.urldecode(s.name);
    this.startX = s.startX;
    this.startY = s.startY;
    this.initial = s.initial;
    this.friendly = s.friendly;

    return this;
  }

  toInterface(): ScenarioInterface {
    return {
      id: this.id,
      idWorld: this.idWorld,
      name: Utils.urlencode(this.name),
      startX: this.startX,
      startY: this.startY,
      initial: this.initial,
      friendly: this.friendly,
    };
  }
}
