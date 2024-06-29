import { ConnectionInterface } from '@interfaces/scenario.interfaces';
import Utils from '@shared/utils.class';

export default class Connection {
  constructor(
    public from: number = null,
    public fromName: string = null,
    public to: number = null,
    public toName: string = null,
    public orientation: string = null
  ) {}

  fromInterface(c: ConnectionInterface): Connection {
    this.from = c.from;
    this.fromName = Utils.urldecode(c.fromName);
    this.to = c.to;
    this.toName = Utils.urldecode(c.toName);
    this.orientation = c.orientation;

    return this;
  }

  toInterface(): ConnectionInterface {
    return {
      from: this.from,
      fromName: Utils.urlencode(this.fromName),
      to: this.to,
      toName: Utils.urlencode(this.toName),
      orientation: this.orientation,
    };
  }
}
