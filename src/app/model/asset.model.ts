import { AssetInterface } from '../interfaces/interfaces';
import { Tag } from './tag.model';

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

	get tagList() {
		if (this._tagList===null) {
			let str_tags = [];
			for (let t of this.tags) {
				str_tags.push(t.name);
			}
			this._tagList = str_tags.join(', ');
		}
		return this._tagList;
	}

	set tagList(str) {
		this._tagList = str;
	}

	set file(str: string) {
		this.modified = true;
		this.url = str;
	}

	get style() {
		if (this.url!==null && this.url!='') {
			return `url(${this.url}) no-repeat center center / 100% 100% transparent`;
		}
		else {
			return `none`;
		}
	}

	toInterface(withUrl: boolean = false): AssetInterface {
		const asset: AssetInterface = {
			id: this.id,
			idWorld: this.idWorld,
			name: this.name,
			url: (this.modified || withUrl) ? this.url : null,
			tags: [],
			tagList: this.tagList
		};
		for (let t of this.tags) {
			asset.tags.push(t.toInterface());
		}
		return asset;
	}
}
