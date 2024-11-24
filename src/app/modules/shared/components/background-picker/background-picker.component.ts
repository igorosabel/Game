import { NgClass } from '@angular/common';
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
import {
  BackgroundCategoryResult,
  BackgroundInterface,
  BackgroundResult,
} from '@interfaces/background.interfaces';
import BackgroundCategory from '@model/background-category.model';
import Background from '@model/background.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';

@Component({
  selector: 'game-background-picker',
  templateUrl: './background-picker.component.html',
  styleUrls: ['./background-picker.component.scss'],
  imports: [NgClass, FormsModule],
})
export default class BackgroundPickerComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);

  show: WritableSignal<boolean> = signal<boolean>(false);
  backgroundFilter: number = null;
  backgroundCategoryList: BackgroundCategory[] = [];
  backgroundList: Background[] = [];
  backgroundListFiltered: WritableSignal<Background[]> = signal<Background[]>(
    []
  );
  selected: number = null;

  selectBackgroundEvent: OutputEmitterRef<BackgroundInterface> =
    output<BackgroundInterface>();

  ngOnInit(): void {
    this.loadBackgroundCategories();
    this.loadBackgrounds();
  }

  showPicker(): void {
    this.show.set(true);
  }

  closePicker(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.show.set(false);
  }

  loadBackgroundCategories(): void {
    this.as
      .getBackgroundCategories()
      .subscribe((result: BackgroundCategoryResult): void => {
        if (result.status == 'ok') {
          this.backgroundCategoryList = this.cms.getBackgroundCategories(
            result.list
          );
        }
      });
  }

  loadBackgrounds(): void {
    this.as.getBackgrounds().subscribe((result: BackgroundResult): void => {
      if (result.status == 'ok') {
        this.backgroundList = this.cms.getBackgrounds(result.list);
        this.updateFilteredList();
      }
    });
  }

  updateFilteredList(): void {
    let filteredList: Background[] = [];
    if (this.backgroundFilter === null) {
      filteredList = this.backgroundList;
    } else {
      filteredList = this.backgroundList.filter(
        (x: Background): boolean =>
          x.idBackgroundCategory === this.backgroundFilter
      );
    }
    this.backgroundListFiltered.set(filteredList);
  }

  selectBackground(background: Background): void {
    this.selected = background.id;
    const selectedBackground: BackgroundInterface = background.toInterface();
    this.show.set(false);
    this.selectBackgroundEvent.emit(selectedBackground);
  }

  resetSelected(): void {
    this.backgroundFilter = null;
    this.selected = null;
    this.updateFilteredList();
  }

  getBackgroundById(id: number): BackgroundInterface {
    const backgroundFind: Background[] = this.backgroundList.filter(
      (x: Background): boolean => x.id === id
    );
    if (backgroundFind.length == 0) {
      return null;
    } else {
      return backgroundFind[0].toInterface();
    }
  }
}
