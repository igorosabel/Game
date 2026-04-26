import { ScenarioInterface } from '@interfaces/scenario.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Scenario {
  constructor(
    public id: number | null = null,
    public idWorld: number | null = null,
    public name: string | null = null,
    public startX: number | null = null,
    public startY: number | null = null,
    public initial: boolean = false,
    public friendly: boolean = false,
  ) {}

  fromInterface(s: ScenarioInterface): Scenario {
    this.id = s.id;
    this.idWorld = s.idWorld;
    this.name = urldecode(s.name);
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
      name: urlencode(this.name),
      startX: this.startX,
      startY: this.startY,
      initial: this.initial,
      friendly: this.friendly,
    };
  }
}
