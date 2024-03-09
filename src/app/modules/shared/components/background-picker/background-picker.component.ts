import { NgClass } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BackgroundCategoryResult,
  BackgroundInterface,
  BackgroundResult,
} from 'src/app/interfaces/background.interfaces';
import { BackgroundCategory } from 'src/app/model/background-category.model';
import { Background } from 'src/app/model/background.model';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Component({
  standalone: true,
  selector: 'game-background-picker',
  templateUrl: './background-picker.component.html',
  styleUrls: ['./background-picker.component.scss'],
  imports: [NgClass, FormsModule],
})
export class BackgroundPickerComponent implements OnInit {
  show: boolean = false;
  backgroundFilter: number = null;
  backgroundCategoryList: BackgroundCategory[] = [];
  backgroundList: Background[] = [];
  backgroundListFiltered: Background[] = [];
  selected: number = null;

  @Output() selectBackgroundEvent: EventEmitter<BackgroundInterface> =
    new EventEmitter<BackgroundInterface>();

  constructor(private as: ApiService, private cms: ClassMapperService) {}

  ngOnInit(): void {
    this.loadBackgroundCategories();
    this.loadBackgrounds();
  }

  showPicker(): void {
    this.show = true;
  }

  closePicker(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.show = false;
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
    this.backgroundListFiltered = filteredList;
  }

  selectBackground(background: Background): void {
    this.selected = background.id;
    const selectedBackground: BackgroundInterface = background.toInterface();
    this.show = false;
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
