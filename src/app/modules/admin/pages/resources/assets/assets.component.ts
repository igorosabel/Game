import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetResult, TagResult } from '@interfaces/asset.interfaces';
import { StatusMessageResult, StatusResult } from '@interfaces/interfaces';
import { WorldResult } from '@interfaces/world.interfaces';
import Asset from '@model/asset.model';
import Key from '@model/key.model';
import Tag from '@model/tag.model';
import World from '@model/world.model';
import { urldecode } from '@osumi/tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import PlayService from '@services/play.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'game-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss', '../../scss/resources.scss'],
  imports: [FormsModule, HeaderComponent],
})
export default class AssetsComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private play: PlayService = inject(PlayService);

  tagFilter: number = null;
  worldFilter: number = null;
  filterListOption: string = 'items';
  tagList: Tag[] = [];
  worldList: World[] = [];
  assetList: Asset[] = [];
  assetListFiltered: Asset[] = [];
  message: string = null;
  loadedAsset: Asset = new Asset();
  showDetail: boolean = false;
  assetDetailHeader: string = '';
  loadingFile: boolean = false;
  savingAsset: boolean = false;

  ngOnInit(): void {
    this.loadTags();
    this.loadWorlds();
    this.loadAssets();

    const esc: Key = this.play.keyboard('Escape');
    esc.onlyEsc = true;
    esc.press = (): void => {
      this.showAddAsset();
    };
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
          const tagsFiltered: Tag[] = x.tags.filter(
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
            const tagsFiltered: Tag[] = x.tags.filter(
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

  changeFilterListOption(ev: MouseEvent, option: string): void {
    if (ev) {
      ev.preventDefault();
    }
    this.filterListOption = option;
  }

  resetLoadedAsset(): void {
    this.loadedAsset = new Asset();
  }

  showAddAsset(ev = null): void {
    if (ev) {
      ev.preventDefault();
    }
    if (!this.showDetail) {
      this.resetLoadedAsset();
      this.assetDetailHeader = 'Nuevo recurso';

      this.showDetail = true;
    } else {
      this.showDetail = false;
    }
  }

  openFile(): void {
    document.getElementById('asset-file').click();
  }

  onFileChange(event: Event): void {
    const reader: FileReader = new FileReader();
    const files: FileList = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.loadingFile = true;
      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        this.loadedAsset.file = reader.result as string;
        (document.getElementById('asset-file') as HTMLInputElement).value = '';
        this.loadingFile = false;
      };
    }
  }

  saveAsset(): void {
    let validate: boolean = true;
    if (this.loadedAsset.name == '') {
      validate = false;
      alert('¡No puedes dejar el nombre del recurso en blanco!');
    }

    if (validate) {
      this.savingAsset = true;
      this.as
        .saveAsset(this.loadedAsset.toInterface())
        .subscribe((result: StatusResult): void => {
          this.savingAsset = false;
          if (result.status == 'ok') {
            this.showAddAsset();
            this.loadAssets();
          } else {
            alert('¡Ocurrió un error al guardar el recurso!');
            this.message = 'ERROR: Ocurrió un error al guardar el recurso.';
          }
        });
    }
  }

  editAsset(asset: Asset): void {
    this.loadedAsset = new Asset(
      asset.id,
      asset.idWorld,
      asset.name,
      asset.url,
      []
    );
    for (const t of asset.tags) {
      this.loadedAsset.tags.push(new Tag(t.id, t.name));
    }

    this.assetDetailHeader = 'Editar mundo';
    this.showDetail = true;
  }

  deleteAsset(asset: Asset): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar el recurso "' + asset.name + '"?'
    );
    if (conf) {
      this.as
        .deleteAsset(asset.id)
        .subscribe((result: StatusMessageResult): void => {
          if (result.status == 'ok') {
            this.loadAssets();
          } else {
            alert(
              '¡Ocurrio un error al borrar el recurso!\n\n' +
                urldecode(result.message)
            );
            this.message = 'ERROR: Ocurrió un error al borrar el recurso.';
          }
        });
    }
  }
}
