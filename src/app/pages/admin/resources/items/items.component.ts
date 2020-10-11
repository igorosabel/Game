import { Component, OnInit, ViewChild } from '@angular/core';
import { Item } from '../../../../model/item.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ClassMapperService } from '../../../../services/class-mapper.service';
import { AssetInterface } from '../../../../interfaces/interfaces';
import { AssetPickerComponent } from '../../../../components/asset-picker/asset-picker.component';

@Component({
	selector: 'game-items',
	templateUrl: './items.component.html',
	styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
	itemFilter: number = null;
	filterListOption: string = 'items';
	typeList = [
		{id: 0, name: 'Moneda'},
		{id: 1, name: 'Arma'},
		{id: 2, name: 'Poción'},
		{id: 3, name: 'Equipamiento'},
		{id: 4, name: 'Objeto'},
	];
	itemList: Item[] = [];
	itemListFiltered: Item[] = [];
	message: string = null;
	loadedItem: Item = new Item();
	showDetail: boolean = false;
	itemDetailHeader: string = '';
	savingItem: boolean = false;
	@ViewChild('assetPicker', { static: true }) assetPicker: AssetPickerComponent;

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}

	ngOnInit(): void {
		this.loadItems();
	}

	loadItems() {
		this.as.getItems().subscribe(result => {
			if (result.status=='ok') {
				this.itemList = this.cms.getItems(result.list);
				this.updateFilteredList();
			}
		});
	}

	updateFilteredList() {
		let filteredList = [];
		if (this.itemFilter===null) {
			filteredList = this.itemList;
		}
		else {
			filteredList = this.itemList.filter(x => x.type===this.itemFilter);
		}
		this.itemListFiltered = filteredList;
	}

	changeFilterListOption(ev, option) {
		ev && ev.preventDefault();
		this.filterListOption = option;
	}

	resetLoadedItem() {
		this.loadedItem = new Item();
	}

	showAddItem(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedItem();
			this.itemDetailHeader = 'Nuevo item';

			this.showDetail = true;
		}
		else {
			this.showDetail = false;
		}
	}

	selectedAsset(selectedAsset: AssetInterface) {
		this.loadedItem.idAsset = selectedAsset.id;
		this.loadedItem.assetUrl = selectedAsset.url;
		if (selectedAsset.name!='') {
			this.loadedItem.name = this.cs.urldecode(selectedAsset.name);
		}
	}

	saveItem() {
		let validate = true;
		if (this.loadedItem.name=='') {
			validate = false;
			alert('¡No puedes dejar el nombre del item en blanco!');
		}

		if (validate && this.loadedItem.idAsset===null) {
			validate = false;
			alert('¡No has elegido ningún recurso para el item!');
		}

		if (validate) {
			this.as.saveItem(this.loadedItem.toInterface()).subscribe(result => {
				if (result.status=='ok') {
					this.showAddItem();
					this.loadItems();
					this.assetPicker.resetSelected();
				}
				else {
					alert('¡Ocurrió un error al guardar el item!');
					this.message = 'ERROR: Ocurrió un error al guardar el item.';
				}
			});
		}
	}

	editItem(item: Item) {
		this.loadedItem = new Item(
			item.id,
			item.type,
			item.idAsset,
			item.assetUrl,
			item.name,
			item.money,
			item.health,
			item.attack,
			item.defense,
			item.speed,
			item.wearable
		);

		this.itemDetailHeader = 'Editar item';
		this.showDetail = true;
	}

	deleteItem(item: Item) {
		const conf = confirm('¿Estás seguro de querer borrar el item "'+this.cs.urldecode(item.name)+'"?');
		if (conf) {
			this.as.deleteItem(item.id).subscribe(result => {
				if (result.status=='ok') {
					this.loadItems();
				}
				if (result.status=='in-use') {
					alert('El item está siendo usado. Cámbialo o bórralo antes de poder borrar este item');
				}
				if (status=='error') {
					alert('¡Ocurrio un error al borrar el item!');
					this.message = 'ERROR: Ocurrió un error al borrar el item.';
				}
			});
		}
	}
}
