import { PlayConnectionInterface } from '@interfaces/scenario.interfaces';

export default class PlayConnection {
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
