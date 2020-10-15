import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Item }                                    from '../../model/item.model';
import { ApiService }                              from '../../services/api.service';
import { CommonService }                           from '../../services/common.service';
import { ClassMapperService }                      from '../../services/class-mapper.service';
import { ItemInterface }                           from '../../interfaces/interfaces';

@Component({
	selector: 'game-item-picker',
	templateUrl: './item-picker.component.html',
	styleUrls: ['./item-picker.component.scss']
})
export class ItemPickerComponent implements OnInit {
	show: boolean = false;
	itemFilter: number = null;
	typeList = [
		{id: 0, name: 'Moneda'},
		{id: 1, name: 'Arma'},
		{id: 2, name: 'Poción'},
		{id: 3, name: 'Equipamiento'},
		{id: 4, name: 'Objeto'}
	];
	itemList: Item[] = [];
	itemListFiltered: Item[] = [];
	selected: number = null;
	
	@Output() selectItemEvent = new EventEmitter<ItemInterface>();

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}
	ngOnInit(): void {
		this.loadItems();
	}
	
	showPicker() {
		this.show = true;
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
	
	selectItem(item: Item) {
		this.selected = item.id;
		const selectedItem = item.toInterface();
		this.show = false;
		this.selectItemEvent.emit(selectedItem);
	}

	resetSelected() {
		this.itemFilter = null;
		this.selected = null;
		this.updateFilteredList();
	}
	
	getItemById(id: number) {
		const itemFind = this.itemList.filter(x => x.id===id);
		if (itemFind.length==0) {
			return null;
		}
		else {
			return itemFind[0].toInterface();
		}
	}
}