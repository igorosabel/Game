import { ConnectionInterface } from '@interfaces/scenario.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

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
    this.fromName = urldecode(c.fromName);
    this.to = c.to;
    this.toName = urldecode(c.toName);
    this.orientation = c.orientation;

    return this;
  }

  toInterface(): ConnectionInterface {
    return {
      from: this.from,
      fromName: urlencode(this.fromName),
      to: this.to,
      toName: urlencode(this.toName),
      orientation: this.orientation,
    };
  }
}
