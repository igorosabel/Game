import { PlayConnectionInterface } from '@interfaces/scenario.interfaces';

export default class PlayConnection {
  constructor(
    public to: number | null = null,
    public x: number | null = null,
    public y: number | null = null,
    public idGame: number | null = null,
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
