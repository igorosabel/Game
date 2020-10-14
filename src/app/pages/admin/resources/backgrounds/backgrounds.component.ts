import { Component, OnInit, ViewChild } from '@angular/core';
import { BackgroundCategory } from '../../../../model/background-category.model';
import { Background } from '../../../../model/background.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ClassMapperService } from '../../../../services/class-mapper.service';
import { AssetInterface } from '../../../../interfaces/interfaces';
import { AssetPickerComponent } from '../../../../components/asset-picker/asset-picker.component';

@Component({
	selector: 'game-backgrounds',
	templateUrl: './backgrounds.component.html',
	styleUrls: ['./backgrounds.component.scss']
})
export class BackgroundsComponent implements OnInit {
	backgroundCategoryFilter: number = null;
	filterListOption: string = 'items';
	backgroundCategoryList: BackgroundCategory[] = [];
	backgroundList: Background[] = [];
	backgroundListFiltered: Background[] = [];
	message: string = null;
	loadedBackground: Background = new Background();
	showDetail: boolean = false;
	backgroundDetailHeader: string = '';
	savingBackground: boolean = false;
	@ViewChild('assetPicker', { static: true }) assetPicker: AssetPickerComponent;

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}

	ngOnInit(): void {
		this.loadBackgroundCategories();
		this.loadBackgrounds();
	}

	loadBackgroundCategories() {
		this.as.getBackgroundCategories().subscribe(result => {
			if (result.status=='ok') {
				this.backgroundCategoryList = this.cms.getBackgroundCategories(result.list);
			}
		});
	}

	loadBackgrounds() {
		this.as.getBackgrounds().subscribe(result => {
			if (result.status=='ok') {
				this.backgroundList = this.cms.getBackgrounds(result.list);
				this.updateFilteredList();
			}
		});
	}

	updateFilteredList() {
		let filteredList = [];
		if (this.backgroundCategoryFilter===null) {
			filteredList = this.backgroundList;
		}
		else {
			filteredList = this.backgroundList.filter(x => x.idBackgroundCategory===this.backgroundCategoryFilter);
		}
		this.backgroundListFiltered = filteredList;
	}

	changeFilterListOption(ev, option) {
		ev && ev.preventDefault();
		this.filterListOption = option;
	}

	resetLoadedBackground() {
		this.loadedBackground = new Background();
		this.loadedBackground.assetUrl = '/assets/no-asset.svg';
	}

	showAddBackground(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedBackground();
			this.backgroundDetailHeader = 'Nuevo fondo';

			this.showDetail = true;
		}
		else {
			this.showDetail = false;
		}
	}

	openAssetPicker() {
		this.assetPicker.showPicker();
	}

	selectedAsset(selectedAsset: AssetInterface) {
		this.loadedBackground.idAsset = selectedAsset.id;
		this.loadedBackground.assetUrl = this.cs.urldecode(selectedAsset.url);
		if (selectedAsset.name!='') {
			this.loadedBackground.name = this.cs.urldecode(selectedAsset.name);
		}
	}

	saveBackground() {
		let validate = true;
		if (this.loadedBackground.name=='') {
			validate = false;
			alert('¡No puedes dejar el nombre del fondo en blanco!');
		}

    if (validate && this.loadedBackground.idBackgroundCategory===null) {
		validate = false;
		alert('¡No has elegido ninguna categoría para el fondo!');
    }

		if (validate && this.loadedBackground.idAsset===null) {
			validate = false;
			alert('¡No has elegido ningún recurso para el fondo!');
		}

		if (validate) {
			this.as.saveBackground(this.loadedBackground.toInterface()).subscribe(result => {
				if (result.status=='ok') {
					this.showAddBackground();
					this.loadBackgrounds();
					this.assetPicker.resetSelected();
				}
				else {
					alert('¡Ocurrió un error al guardar el fondo!');
					this.message = 'ERROR: Ocurrió un error al guardar el fondo.';
				}
			});
		}
	}

	editBackground(background: Background) {
		this.loadedBackground = new Background(
			background.id,
			background.idBackgroundCategory,
			background.idAsset,
			this.cs.urldecode(background.assetUrl),
			this.cs.urldecode(background.name),
			background.crossable
		);

		this.backgroundDetailHeader = 'Editar fondo';
		this.showDetail = true;
	}

	deleteBackground(background: Background) {
		const conf = confirm('¿Estás seguro de querer borrar el fondo "'+this.cs.urldecode(background.name)+'"?');
		if (conf) {
			this.as.deleteBackground(background.id).subscribe(result => {
				if (result.status=='ok') {
					this.loadBackgrounds();
				}
				if (result.status=='in-use') {
					alert('El fondo está siendo usado en un escenario. Cámbialo o bórralo antes de poder borrar este fondo');
				}
				if (status=='error') {
					alert('¡Ocurrio un error al borrar el fondo!');
					this.message = 'ERROR: Ocurrió un error al borrar el fondo.';
				}
			});
		}
	}
}
