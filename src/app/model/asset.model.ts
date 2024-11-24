import { AssetInterface, TagInterface } from '@interfaces/asset.interfaces';
import Tag from '@model/tag.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class Asset {
  _tagList: string;
  modified: boolean;

  constructor(
    public id: number = null,
    public idWorld: number = null,
    public name: string = null,
    public url: string = null,
    public tags: Tag[] = []
  ) {
    this._tagList = null;
    this.modified = false;
  }

  get tagList(): string {
    if (this._tagList === null) {
      const str_tags: string[] = [];
      for (const t of this.tags) {
        str_tags.push(t.name);
      }
      this._tagList = str_tags.join(', ');
    }
    return this._tagList;
  }

  set tagList(str: string) {
    this._tagList = str;
  }

  set file(str: string) {
    this.modified = true;
    this.url = str;
  }

  get style(): string {
    if (this.url !== null && this.url != '') {
      return `url(${this.url}) no-repeat center center / 100% 100% transparent`;
    } else {
      return `none`;
    }
  }

  fromInterface(a: AssetInterface): Asset {
    this.id = a.id;
    this.idWorld = a.idWorld;
    this.name = urldecode(a.name);
    this.url = urldecode(a.url);
    this.tags = a.tags.map((t: TagInterface): Tag => {
      return new Tag().fromInterface(t);
    });

    return this;
  }

  toInterface(withUrl: boolean = false): AssetInterface {
    return {
      id: this.id,
      idWorld: this.idWorld,
      name: urlencode(this.name),
      url: this.modified || withUrl ? urlencode(this.url) : null,
      tags: this.tags.map((t: Tag): TagInterface => {
        return t.toInterface();
      }),
      tagList: this.tagList,
    };
  }
}
