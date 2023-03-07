import { PlayConnectionInterface } from 'src/app/interfaces/interfaces';

export class PlayConnection {
  constructor(
    public to: number = null,
    public x: number = null,
    public y: number = null,
    public idGame: number = null
  ) {}

  toInterface(): PlayConnectionInterface {
    const playConnection: PlayConnectionInterface = {
      to: this.to,
      x: this.x,
      y: this.y,
      idGame: this.idGame,
    };
    return playConnection;
  }
}
