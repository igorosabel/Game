import { Component, OnInit, ViewChild } from '@angular/core';
import { Item }                         from '../../../../model/item.model';
import { ItemFrame }                    from '../../../../model/item-frame.model';
import { ApiService }                   from '../../../../services/api.service';
import { CommonService }                from '../../../../services/common.service';
import { ClassMapperService }           from '../../../../services/class-mapper.service';
import { PlayService }                  from '../../../../services/play.service';
import { AssetInterface }               from '../../../../interfaces/interfaces';
import { AssetPickerComponent }         from '../../../../components/asset-picker/asset-picker.component';

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
		{id: 4, name: 'Objeto'}
	];
	wearableList = [
		{id: 0, name: 'Cabeza'},
		{id: 1, name: 'Cuello'},
		{id: 2, name: 'Cuerpo'},
		{id: 3, name: 'Botas'}
	];
	itemList: Item[] = [];
	itemListFiltered: Item[] = [];
	message: string = null;
	loadedItem: Item = new Item();
	showDetail: boolean = false;
	detailtTab: string = 'data';
	itemDetailHeader: string = '';
	savingItem: boolean = false;
	@ViewChild('assetPicker', { static: true }) assetPicker: AssetPickerComponent;
	assetPickerWhere: string = null;
	animationImage: string = null;
	animationInd: number = -1;
	animationTimer: number = null;

	constructor(
		private as: ApiService,
		private cs: CommonService,
		private cms: ClassMapperService,
		private play: PlayService
	) {}

	ngOnInit(): void {
		this.loadItems();

		let esc = this.play.keyboard(27);
		esc.press = () => { this.showAddItem() };
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
		this.loadedItem.assetUrl = '/assets/no-asset.svg';
		this.animationImage = '/assets/no-asset.svg';
		this.assetPickerWhere = null;
		this.changeTab('data');
		this.animationInd = -1;
		if (this.animationTimer!==null) {
			clearInterval(this.animationTimer);
			this.animationTimer = null;
		}
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
			this.resetLoadedItem();
		}
	}

	changeTab(tab: string) {
		this.detailtTab = tab;
	}

	openAssetPicker(type: string) {
		if (type=='frame' && this.loadedItem.idAsset==null) {
			alert('Primero tienes que elegir un recurso para el item. Una vez hecho esto podrás añadir frames a la animación.');
			return;
		}
		this.assetPickerWhere = type;
		this.assetPicker.showPicker();
	}

	selectedAsset(selectedAsset: AssetInterface) {
		if (this.assetPickerWhere=='item') {
			this.loadedItem.idAsset = selectedAsset.id;
			this.loadedItem.assetUrl = selectedAsset.url;
			if (selectedAsset.name!='') {
				this.loadedItem.name = selectedAsset.name;
			}
		}
		if (this.assetPickerWhere=='frame') {
			let frame = new ItemFrame(null, selectedAsset.id, selectedAsset.url, this.loadedItem.frames.length);
			this.loadedItem.frames.push(frame);
		}

		if (this.animationTimer!==null) {
			clearInterval(this.animationTimer);
			this.animationTimer = null;
		}
		this.startAnimation();

		this.assetPicker.resetSelected();
	}

	startAnimation() {
		if (this.loadedItem.allFrames.length>1) {
			this.animationTimer = setInterval(() => { this.animatePreview() }, 300);
		}
		else {
			this.animationImage = this.loadedItem.assetUrl;
		}
	}

	animatePreview() {
		this.animationInd++;
		if (this.animationInd >= this.loadedItem.allFrames.length) {
			this.animationInd = 0;
		}
		this.animationImage = this.loadedItem.allFrames[this.animationInd];
	}

	frameDelete(frame: ItemFrame) {
		const conf = confirm('¿Estás seguro de querer borrar este frame?');
		if (conf) {
			const ind = this.loadedItem.frames.findIndex(x => (x.id+x.idAsset.toString())==(frame.id+frame.idAsset.toString()));
			this.loadedItem.frames.splice(ind, 1);
			this.updateFrameOrders();
		}
	}

	frameLeft(frame: ItemFrame) {
		const ind = this.loadedItem.frames.findIndex(x => (x.id+x.idAsset.toString())==(frame.id+frame.idAsset.toString()));
		if (ind==0) {
			return;
		}
		const aux = this.loadedItem.frames[ind];
		this.loadedItem.frames[ind] = this.loadedItem.frames[ind -1];
		this.loadedItem.frames[ind -1] = aux;
		this.updateFrameOrders();
	}

	frameRight(frame: ItemFrame) {
		const ind = this.loadedItem.frames.findIndex(x => (x.id+x.idAsset.toString())==(frame.id+frame.idAsset.toString()));
		if (ind==(this.loadedItem.frames.length-1)) {
			return;
		}
		const aux = this.loadedItem.frames[ind];
		this.loadedItem.frames[ind] = this.loadedItem.frames[ind +1];
		this.loadedItem.frames[ind +1] = aux;
		this.updateFrameOrders();
	}

	updateFrameOrders() {
		for (let frameOrder in this.loadedItem.frames) {
			this.loadedItem.frames[frameOrder].order = parseInt(frameOrder);
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

		if (validate && this.loadedItem.type==null) {
			validate = false;
			alert('¡No has elegido ningún tipo!');
		}

		if (validate && this.loadedItem.type==1 && this.loadedItem.attack===null) {
			validate = false;
			alert('¡Has indicado que es un arma pero no has marcado cuanto daño hace!');
		}

		if (validate && this.loadedItem.type==2 && this.loadedItem.health===null) {
			validate = false;
			alert('¡Has indicado que es una poción pero no has marcado cuanta salud recupera!');
		}

		if (validate && this.loadedItem.type==3 && (this.loadedItem.defense===null || this.loadedItem.speed===null || this.loadedItem.wearable==null)) {
			validate = false;
			alert('¡Has indicado que es un equipo pero no has rellenado su defensa, equipo o donde va!');
		}

		if (validate) {
			// Arma
			if (this.loadedItem.type==1) {
				this.loadedItem.health = null;
				this.loadedItem.defense = null;
				this.loadedItem.speed = null;
				this.loadedItem.wearable = null;
			}
			// Poción
			if (this.loadedItem.type==2) {
				this.loadedItem.attack = null;
				this.loadedItem.defense = null;
				this.loadedItem.speed = null;
				this.loadedItem.wearable = null;
			}
			// Equipo
			if (this.loadedItem.type==3) {
				this.loadedItem.attack = null;
				this.loadedItem.health = null;
			}
			// Objeto
			if (this.loadedItem.type==4) {
				this.loadedItem.attack = null;
				this.loadedItem.health = null;
				this.loadedItem.defense = null;
				this.loadedItem.speed = null;
				this.loadedItem.wearable = null;
			}

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
			item.wearable,
			[]
		);
		for (let frame of item.frames) {
			frame.assetUrl = frame.assetUrl;
			this.loadedItem.frames.push(frame);
		}

		this.animationImage = this.loadedItem.assetUrl;
		this.assetPickerWhere = null;
		this.changeTab('data');
		this.animationInd = -1;
		if (this.animationTimer!==null) {
			clearInterval(this.animationTimer);
			this.animationTimer = null;
		}
		if (this.loadedItem.frames.length>1) {
			this.startAnimation();
		}

		this.itemDetailHeader = 'Editar item';
		this.showDetail = true;
	}

	deleteItem(item: Item) {
		const conf = confirm('¿Estás seguro de querer borrar el item "'+item.name+'"?');
		if (conf) {
			this.as.deleteItem(item.id).subscribe(result => {
				if (result.status=='ok') {
					this.loadItems();
				}
				if (result.status=='in-use') {
					alert("El item está siendo usado. Cámbialo o bórralo antes de poder borrar este item.\n\n"+this.cs.urldecode(result.message));
				}
				if (status=='error') {
					alert('¡Ocurrio un error al borrar el item!');
					this.message = 'ERROR: Ocurrió un error al borrar el item.';
				}
			});
		}
	}
}
