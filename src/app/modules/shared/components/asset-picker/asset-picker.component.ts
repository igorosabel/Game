import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AssetInterface,
  AssetResult,
  TagResult,
  WorldResult,
} from 'src/app/interfaces/interfaces';
import { Asset } from 'src/app/model/asset.model';
import { Tag } from 'src/app/model/tag.model';
import { World } from 'src/app/model/world.model';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Component({
  standalone: true,
  selector: 'game-asset-picker',
  templateUrl: './asset-picker.component.html',
  styleUrls: ['./asset-picker.component.scss'],
  imports: [CommonModule, FormsModule],
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

  @Output() selectAssetEvent: EventEmitter<AssetInterface> =
    new EventEmitter<AssetInterface>();

  constructor(private as: ApiService, private cms: ClassMapperService) {}

  ngOnInit(): void {
    this.loadTags();
    this.loadWorlds();
    this.loadAssets();
  }

  showPicker(): void {
    this.show = true;
  }

  loadTags(): void {
    this.as.getTags().subscribe((result: TagResult): void => {
      if (result.status == 'ok') {
        this.tagList = this.cms.getTags(result.list);
      }
    });
  }

  loadWorlds(): void {
    this.as.getWorlds().subscribe((result: WorldResult): void => {
      if (result.status == 'ok') {
        this.worldList = this.cms.getWorlds(result.list);
      }
    });
  }

  loadAssets(): void {
    this.as.getAssets().subscribe((result: AssetResult): void => {
      if (result.status == 'ok') {
        this.assetList = this.cms.getAssets(result.list);
        this.updateFilteredList();
      }
    });
  }

  updateFilteredList(): void {
    let filteredList: Asset[] = [];
    if (this.tagFilter === null && this.worldFilter === null) {
      filteredList = this.assetList;
    } else {
      if (this.tagFilter !== null && this.worldFilter !== null) {
        filteredList = this.assetList.filter((x: Asset): boolean => {
          let tagsFiltered: Tag[] = x.tags.filter(
            (t: Tag): boolean => t.id === this.tagFilter
          );
          return tagsFiltered.length > 0;
        });
        filteredList = filteredList.filter(
          (x: Asset): boolean => x.idWorld === this.worldFilter
        );
      } else {
        if (this.tagFilter !== null) {
          filteredList = this.assetList.filter((x: Asset): boolean => {
            let tagsFiltered: Tag[] = x.tags.filter(
              (t: Tag): boolean => t.id === this.tagFilter
            );
            return tagsFiltered.length > 0;
          });
        }
        if (this.worldFilter !== null) {
          filteredList = this.assetList.filter(
            (x: Asset): boolean => x.idWorld === this.worldFilter
          );
        }
      }
    }
    this.assetListFiltered = filteredList;
  }

  selectAsset(asset: Asset): void {
    this.selectedItem = asset.id;
    const selectedAsset: AssetInterface = asset.toInterface(true);
    if (!this.nameCopy) {
      selectedAsset.name = '';
    }
    this.show = false;
    this.selectAssetEvent.emit(selectedAsset);
  }

  resetSelected(): void {
    this.tagFilter = null;
    this.worldFilter = null;
    this.selectedItem = null;
    this.updateFilteredList();
  }

  getAssetById(id: number): AssetInterface {
    const assetFind: Asset[] = this.assetList.filter(
      (x: Asset): boolean => x.id === id
    );
    if (assetFind.length == 0) {
      return null;
    } else {
      return assetFind[0].toInterface();
    }
  }
}
