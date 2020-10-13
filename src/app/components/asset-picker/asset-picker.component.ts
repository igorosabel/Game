import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Tag } from '../../model/tag.model';
import { World } from '../../model/world.model';
import { Asset } from '../../model/asset.model';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ClassMapperService } from '../../services/class-mapper.service';
import { AssetInterface } from '../../interfaces/interfaces';

@Component({
	selector: 'game-asset-picker',
	templateUrl: './asset-picker.component.html',
	styleUrls: ['./asset-picker.component.scss']
})
export class AssetPickerComponent implements OnInit {
	show: boolean = false;
	tagFilter: number = null;
	worldFilter: number = null;
	tagList: Tag[] = [];
	worldList: World[] = [];
	assetList: Asset[] = [];
	assetListFiltered: Asset[] = [];
	nameCopy: boolean = true;
	selectedItem: number = null;

	@Output() selectAssetEvent = new EventEmitter<AssetInterface>();

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}
	ngOnInit(): void {
		this.loadTags();
		this.loadWorlds();
		this.loadAssets();
	}

	showPicker() {
		this.show = true;
	}

	loadTags() {
		this.as.getTags().subscribe(result => {
			if (result.status=='ok') {
				this.tagList = this.cms.getTags(result.list);
			}
		});
	}

	loadWorlds() {
		this.as.getWorlds().subscribe(result => {
			if (result.status=='ok') {
				this.worldList = this.cms.getWorlds(result.list);
			}
		});
	}

	loadAssets() {
			this.as.getAssets().subscribe(result => {
			if (result.status=='ok') {
				this.assetList = this.cms.getAssets(result.list);
				this.updateFilteredList();
			}
		});
	}

	updateFilteredList() {
		let filteredList = [];
		if (this.tagFilter===null && this.worldFilter===null) {
			filteredList = this.assetList;
		}
		else {
			if (this.tagFilter!==null && this.worldFilter!==null) {
				filteredList = this.assetList.filter(x => {
					let tagsFiltered = x.tags.filter(t => t.id===this.tagFilter);
					return (tagsFiltered.length > 0);
				});
				filteredList = filteredList.filter(x => x.idWorld===this.worldFilter);
			}
			else {
				if (this.tagFilter!==null) {
					filteredList = this.assetList.filter(x => {
						let tagsFiltered = x.tags.filter(t => t.id===this.tagFilter);
						return (tagsFiltered.length > 0);
					});
				}
				if (this.worldFilter!==null) {
					filteredList = this.assetList.filter(x => x.idWorld===this.worldFilter);
				}
			}
		}
		this.assetListFiltered = filteredList;
	}

	selectAsset(asset: Asset) {
		this.selectedItem = asset.id;
		const selectedAsset = asset.toInterface(true);
		if (!this.nameCopy) {
			selectedAsset.name = '';
		}
		this.show = false;
		this.selectAssetEvent.emit(selectedAsset);
	}

	resetSelected() {
		this.tagFilter = null;
		this.worldFilter = null;
		this.selectedItem = null;
	}
}
