import { NgClass } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ItemInterface,
  ItemResult,
  ItemTypeInterface,
} from 'src/app/interfaces/item.interfaces';
import { Item } from 'src/app/model/item.model';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Component({
  standalone: true,
  selector: 'game-item-picker',
  templateUrl: './item-picker.component.html',
  styleUrls: ['./item-picker.component.scss'],
  imports: [NgClass, FormsModule],
})
export class ItemPickerComponent implements OnInit {
  show: boolean = false;
  itemFilter: number = null;
  typeList: ItemTypeInterface[] = [
    { id: 0, name: 'Moneda' },
    { id: 1, name: 'Arma' },
    { id: 2, name: 'Poción' },
    { id: 3, name: 'Equipamiento' },
    { id: 4, name: 'Objeto' },
  ];
  itemList: Item[] = [];
  itemListFiltered: Item[] = [];
  selected: number = null;

  @Output() selectItemEvent: EventEmitter<ItemInterface> =
    new EventEmitter<ItemInterface>();

  constructor(private as: ApiService, private cms: ClassMapperService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  showPicker(): void {
    this.show = true;
  }

  loadItems(): void {
    this.as.getItems().subscribe((result: ItemResult): void => {
      if (result.status == 'ok') {
        this.itemList = this.cms.getItems(result.list);
        this.updateFilteredList();
      }
    });
  }

  updateFilteredList(): void {
    let filteredList: Item[] = [];
    if (this.itemFilter === null) {
      filteredList = this.itemList;
    } else {
      filteredList = this.itemList.filter(
        (x: Item): boolean => x.type === this.itemFilter
      );
    }
    this.itemListFiltered = filteredList;
  }

  selectItem(item: Item): void {
    this.selected = item.id;
    const selectedItem: ItemInterface = item.toInterface();
    this.show = false;
    this.selectItemEvent.emit(selectedItem);
  }

  resetSelected(): void {
    this.itemFilter = null;
    this.selected = null;
    this.updateFilteredList();
  }

  getItemById(id: number): ItemInterface {
    const itemFind: Item[] = this.itemList.filter(
      (x: Item): boolean => x.id === id
    );
    if (itemFind.length == 0) {
      return null;
    } else {
      return itemFind[0].toInterface();
    }
  }
}
