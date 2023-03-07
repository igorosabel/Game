import { AssetInterface } from 'src/app/interfaces/interfaces';
import { Tag } from 'src/app/model/tag.model';
import { Utils } from 'src/app/modules/shared/utils.class';
import { TagInterface } from './../interfaces/interfaces';

export class Asset {
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
      let str_tags: string[] = [];
      for (let t of this.tags) {
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
    this.name = Utils.urldecode(a.name);
    this.url = Utils.urldecode(a.url);
    this.tags = a.tags.map((t: TagInterface): Tag => {
      return new Tag().fromInterface(t);
    });

    return this;
  }

  toInterface(withUrl: boolean = false): AssetInterface {
    return {
      id: this.id,
      idWorld: this.idWorld,
      name: Utils.urlencode(this.name),
      url: this.modified || withUrl ? Utils.urlencode(this.url) : null,
      tags: this.tags.map((t: Tag): TagInterface => {
        return t.toInterface();
      }),
      tagList: this.tagList,
    };
  }
}
