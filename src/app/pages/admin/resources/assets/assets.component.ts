import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../../model/tag.model';
import { World } from '../../../../model/world.model';
import { Asset } from '../../../../model/asset.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ClassMapperService } from '../../../../services/class-mapper.service';

@Component({
	selector: 'game-assets',
	templateUrl: './assets.component.html',
	styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
	tagFilter: number = null;
	worldFilter: number = null;
	filterListOption: string = 'items';
	tagList: Tag[] = [];
	worldList: World[] = [];
	assetList: Asset[] = [];
	assetListFiltered: Asset[] = [];
	message: string = null;
	loadedAsset: Asset = new Asset();
	showDetail: boolean = false;
	assetDetailHeader: string = '';
	loadingFile: boolean = false;
	savingAsset: boolean = false;

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}

	ngOnInit(): void {
		this.loadTags();
		this.loadWorlds();
		this.loadAssets();
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

	changeFilterListOption(ev, option) {
		ev && ev.preventDefault();
		this.filterListOption = option;
	}

	resetLoadedAsset() {
		this.loadedAsset = new Asset();
	}

	showAddAsset(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedAsset();
			this.assetDetailHeader = 'Nuevo recurso';

			this.showDetail = true;
		}
		else {
			this.showDetail = false;
		}
	}

	openFile() {
		document.getElementById('asset-file').click();
	}

	onFileChange(event) {
		let reader = new FileReader();
		if ( (<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files.length > 0) {
			this.loadingFile = true;
			let file = (<HTMLInputElement>event.target).files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.loadedAsset.file = reader.result as string;
				(<HTMLInputElement>document.getElementById('asset-file')).value = '';
				this.loadingFile = false;
			};
		}
	}

	saveAsset() {
		let validate = true;
		if (this.loadedAsset.name=='') {
			validate = false;
			alert('¡No puedes dejar el nombre del recurso en blanco!');
		}

		if (validate) {
			this.savingAsset = true;
			this.as.saveAsset(this.loadedAsset.toInterface()).subscribe(result => {
				this.savingAsset = false;
				if (result.status=='ok') {
					this.showAddAsset();
					this.loadAssets();
				}
				else {
					alert('¡Ocurrió un error al guardar el recurso!');
					this.message = 'ERROR: Ocurrió un error al guardar el recurso.';
				}
			});
		}
	}

	editAsset(asset: Asset) {
		this.loadedAsset = new Asset(
			asset.id,
			asset.idWorld,
			asset.name,
			asset.url,
			[]
		);
		for (let t of asset.tags) {
			this.loadedAsset.tags.push(
				new Tag(
					t.id,
					t.name
				)
			);
		}

		this.assetDetailHeader = 'Editar mundo';
		this.showDetail = true;
	}

	deleteAsset(asset: Asset) {
		const conf = confirm('¿Estás seguro de querer borrar el recurso "'+asset.name+'"?');
		if (conf) {
			this.as.deleteAsset(asset.id).subscribe(result => {
				if (result.status=='ok') {
					this.loadAssets();
				}
				else {
					alert("¡Ocurrio un error al borrar el recurso!\n\n"+this.cs.urldecode(result.message));
					this.message = 'ERROR: Ocurrió un error al borrar el recurso.';
				}
			});
		}
	}
}
