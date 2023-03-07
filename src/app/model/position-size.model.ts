import { PositionSizeInterface } from 'src/app/interfaces/interfaces';
import { Position } from 'src/app/model/position.model';

export class PositionSize {
  constructor(
    public x: number = null,
    public y: number = null,
    public width: number = null,
    public height: number = null
  ) {}

  getCenter(): Position {
    return new Position(this.x + this.width / 2, this.y + this.height / 2);
  }

  distance(pos2: PositionSize): number {
    const obj1: Position = this.getCenter();
    const obj2: Position = pos2.getCenter();

    return Math.sqrt(
      Math.pow(obj2.x - obj1.x, 2) + Math.pow(obj2.y - obj1.y, 2)
    );
  }

  fromInterface(p: PositionSizeInterface): PositionSize {
    this.x = p.x;
    this.y = p.y;
    this.width = p.width;
    this.height = p.height;

    return this;
  }

  toInterface(): PositionSizeInterface {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
