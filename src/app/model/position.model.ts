import { PositionInterface } from '@interfaces/player.interfaces';

export default class Position {
  constructor(public x: number = null, public y: number = null) {}

  fromInterface(p: PositionInterface): Position {
    this.x = p.x;
    this.y = p.y;

    return this;
  }

  toInterface(): PositionInterface {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
