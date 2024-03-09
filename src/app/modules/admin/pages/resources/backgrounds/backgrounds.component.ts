import { NgClass } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetInterface } from 'src/app/interfaces/asset.interfaces';
import {
  BackgroundCategoryResult,
  BackgroundResult,
} from 'src/app/interfaces/background.interfaces';
import {
  StatusMessageResult,
  StatusResult,
} from 'src/app/interfaces/interfaces';
import { BackgroundCategory } from 'src/app/model/background-category.model';
import { Background } from 'src/app/model/background.model';
import { Key } from 'src/app/model/key.model';
import { AssetPickerComponent } from 'src/app/modules/shared/components/asset-picker/asset-picker.component';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';
import { Utils } from 'src/app/modules/shared/utils.class';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { PlayService } from 'src/app/services/play.service';

@Component({
  standalone: true,
  selector: 'game-backgrounds',
  templateUrl: './backgrounds.component.html',
  styleUrls: ['./backgrounds.component.scss', '../../scss/resources.scss'],
  imports: [NgClass, FormsModule, HeaderComponent, AssetPickerComponent],
})
export default class BackgroundsComponent implements OnInit {
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

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    private play: PlayService
  ) {}

  ngOnInit(): void {
    this.loadBackgroundCategories();
    this.loadBackgrounds();

    const esc: Key = this.play.keyboard('Escape');
    esc.onlyEsc = true;
    esc.press = (): void => {
      this.showAddBackground();
    };
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
    if (this.backgroundCategoryFilter === null) {
      filteredList = this.backgroundList;
    } else {
      filteredList = this.backgroundList.filter(
        (x: Background): boolean =>
          x.idBackgroundCategory === this.backgroundCategoryFilter
      );
    }
    this.backgroundListFiltered = filteredList;
  }

  changeFilterListOption(ev: MouseEvent, option: string): void {
    ev && ev.preventDefault();
    this.filterListOption = option;
  }

  resetLoadedBackground(): void {
    this.loadedBackground = new Background();
    this.loadedBackground.assetUrl = '/assets/admin/no-asset.svg';
  }

  showAddBackground(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    if (!this.showDetail) {
      this.resetLoadedBackground();
      this.backgroundDetailHeader = 'Nuevo fondo';

      this.showDetail = true;
    } else {
      this.showDetail = false;
    }
  }

  openAssetPicker(): void {
    this.assetPicker.showPicker();
  }

  selectedAsset(selectedAsset: AssetInterface): void {
    this.loadedBackground.idAsset = selectedAsset.id;
    this.loadedBackground.assetUrl = selectedAsset.url;
    if (selectedAsset.name != '') {
      this.loadedBackground.name = selectedAsset.name;
    }
  }

  saveBackground(): void {
    let validate: boolean = true;
    if (this.loadedBackground.name == '') {
      validate = false;
      alert('¡No puedes dejar el nombre del fondo en blanco!');
    }

    if (validate && this.loadedBackground.idBackgroundCategory === null) {
      validate = false;
      alert('¡No has elegido ninguna categoría para el fondo!');
    }

    if (validate && this.loadedBackground.idAsset === null) {
      validate = false;
      alert('¡No has elegido ningún recurso para el fondo!');
    }

    if (validate) {
      this.as
        .saveBackground(this.loadedBackground.toInterface())
        .subscribe((result: StatusResult): void => {
          if (result.status == 'ok') {
            this.showAddBackground();
            this.loadBackgrounds();
            this.assetPicker.resetSelected();
          } else {
            alert('¡Ocurrió un error al guardar el fondo!');
            this.message = 'ERROR: Ocurrió un error al guardar el fondo.';
          }
        });
    }
  }

  editBackground(background: Background): void {
    this.loadedBackground = new Background(
      background.id,
      background.idBackgroundCategory,
      background.idAsset,
      background.assetUrl,
      background.name,
      background.crossable
    );

    this.backgroundDetailHeader = 'Editar fondo';
    this.showDetail = true;
  }

  deleteBackground(background: Background): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar el fondo "' + background.name + '"?'
    );
    if (conf) {
      this.as
        .deleteBackground(background.id)
        .subscribe((result: StatusMessageResult): void => {
          if (result.status == 'ok') {
            this.loadBackgrounds();
          }
          if (result.status == 'in-use') {
            alert(
              'El fondo está siendo usado en un escenario. Cámbialo o bórralo antes de poder borrar este fondo\n\n' +
                Utils.urldecode(result.message)
            );
          }
          if (result.status == 'error') {
            alert('¡Ocurrio un error al borrar el fondo!');
            this.message = 'ERROR: Ocurrió un error al borrar el fondo.';
          }
        });
    }
  }
}
