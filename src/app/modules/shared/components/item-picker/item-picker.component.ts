import {
  Component,
  OnInit,
  OutputEmitterRef,
  WritableSignal,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Constants from '@app/constants';
import {
  ItemInterface,
  ItemResult,
  ItemTypeInterface,
} from '@interfaces/item.interfaces';
import Item from '@model/item.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';

@Component({
  selector: 'game-item-picker',
  templateUrl: './item-picker.component.html',
  styleUrls: ['./item-picker.component.scss'],
  imports: [FormsModule],
})
export default class ItemPickerComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);

  show: WritableSignal<boolean> = signal<boolean>(false);
  itemFilter: number = null;
  typeList: ItemTypeInterface[] = Constants.ITEM_TYPE_LIST;
  itemList: Item[] = [];
  itemListFiltered: WritableSignal<Item[]> = signal<Item[]>([]);
  selected: number = null;

  selectItemEvent: OutputEmitterRef<ItemInterface> = output<ItemInterface>();

  ngOnInit(): void {
    this.loadItems();
  }

  showPicker(): void {
    this.show.set(true);
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
    this.itemListFiltered.set(filteredList);
  }

  selectItem(item: Item): void {
    this.selected = item.id;
    const selectedItem: ItemInterface = item.toInterface();
    this.show.set(false);
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
