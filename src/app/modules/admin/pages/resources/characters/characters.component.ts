import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AnimationImageInterface,
  AnimationNumInterface,
  AssetInterface,
  CharacterResult,
  CharacterTypeInterface,
  ItemInterface,
  StatusMessageResult,
  StatusResult,
} from 'src/app/interfaces/interfaces';
import { CharacterFrame } from 'src/app/model/character-frame.model';
import { Character } from 'src/app/model/character.model';
import { Key } from 'src/app/model/key.model';
import { Narrative } from 'src/app/model/narrative.model';
import { AssetPickerComponent } from 'src/app/modules/shared/components/asset-picker/asset-picker.component';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';
import { ItemPickerComponent } from 'src/app/modules/shared/components/item-picker/item-picker.component';
import { Utils } from 'src/app/modules/shared/utils.class';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { PlayService } from 'src/app/services/play.service';

@Component({
  standalone: true,
  selector: 'game-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss', '../../scss/resources.scss'],
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    AssetPickerComponent,
    ItemPickerComponent,
  ],
})
export default class CharactersComponent implements OnInit {
  characterFilter: number = null;
  filterListOption: string = 'items';
  typeList: CharacterTypeInterface[] = [
    { id: 0, name: 'NPC' },
    { id: 1, name: 'Enemigo' },
  ];
  characterList: Character[] = [];
  characterListFiltered: Character[] = [];
  message: string = null;
  loadedCharacter: Character = new Character();
  showDetail: boolean = false;
  detailtTab: string = 'data';
  characterDetailHeader: string = '';
  dropItemName: string = '';
  savingCharacter: boolean = false;
  assetPickerWhere: string = null;
  @ViewChild('assetPicker', { static: true }) assetPicker: AssetPickerComponent;
  @ViewChild('itemPicker', { static: true }) itemPicker: ItemPickerComponent;
  animationImage: AnimationImageInterface = {
    up: '',
    down: '',
    left: '',
    right: '',
  };
  animationInd: AnimationNumInterface = {
    up: -1,
    down: -1,
    left: -1,
    right: -1,
  };
  animationTimer: AnimationNumInterface = {
    up: null,
    down: null,
    left: null,
    right: null,
  };

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    private play: PlayService
  ) {}

  ngOnInit(): void {
    this.loadCharacters();

    const esc: Key = this.play.keyboard('Escape');
    esc.onlyEsc = true;
    esc.press = (): void => {
      this.showAddCharacter();
    };
  }

  loadCharacters(): void {
    this.as.getCharacters().subscribe((result: CharacterResult): void => {
      if (result.status == 'ok') {
        this.characterList = this.cms.getCharacters(result.list);
        this.updateFilteredList();
      }
    });
  }

  updateFilteredList(): void {
    let filteredList: Character[] = [];
    if (this.characterFilter === null) {
      filteredList = this.characterList;
    } else {
      filteredList = this.characterList.filter(
        (x: Character): boolean => x.type === this.characterFilter
      );
    }
    this.characterListFiltered = filteredList;
  }

  changeFilterListOption(ev: MouseEvent, option: string): void {
    ev && ev.preventDefault();
    this.filterListOption = option;
  }

  resetLoadedCharacter(): void {
    clearInterval(this.animationTimer.up);
    clearInterval(this.animationTimer.down);
    clearInterval(this.animationTimer.left);
    clearInterval(this.animationTimer.right);
    this.loadedCharacter = new Character();
    this.loadedCharacter.dropAssetUrl = '/assets/admin/no-asset.svg';
    this.dropItemName = 'Elige un item';
    this.loadedCharacter.assetUpUrl = '/assets/admin/no-asset.svg';
    this.animationImage.up = '/assets/admin/no-asset.svg';
    this.loadedCharacter.assetDownUrl = '/assets/admin/no-asset.svg';
    this.animationImage.down = '/assets/admin/no-asset.svg';
    this.loadedCharacter.assetLeftUrl = '/assets/admin/no-asset.svg';
    this.animationImage.left = '/assets/admin/no-asset.svg';
    this.loadedCharacter.assetRightUrl = '/assets/admin/no-asset.svg';
    this.animationImage.right = '/assets/admin/no-asset.svg';
  }

  showAddCharacter(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    if (!this.showDetail) {
      this.resetLoadedCharacter();
      this.characterDetailHeader = 'Nuevo personaje';
      this.detailtTab = 'data';

      this.showDetail = true;
    } else {
      this.showDetail = false;
      this.resetLoadedCharacter();
    }
  }

  changeTab(tab: string): void {
    this.detailtTab = tab;
  }

  openItemPicker(): void {
    this.itemPicker.showPicker();
  }

  selectedItem(selectedItem: ItemInterface): void {
    this.loadedCharacter.dropIdItem = selectedItem.id;
    this.loadedCharacter.dropAssetUrl = selectedItem.assetUrl;
    this.dropItemName = selectedItem.name;
  }

  removeSelectedDropItem(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.loadedCharacter.dropIdItem = null;
    this.loadedCharacter.dropAssetUrl = '/assets/admin/no-asset.svg';
    this.dropItemName = 'Elige un item';
  }

  openAssetPicker(where: string): void {
    if (where.indexOf('frames') != -1) {
      const orientation: string = where.replace('frames', '').toLowerCase();
      const whereCheck: string =
        orientation.substring(0, 1).toUpperCase() + orientation.substring(1);
      if (this.loadedCharacter['idAsset' + whereCheck] == null) {
        alert(
          'Antes de añadir un frame tienes que elegir una imagen principal.'
        );
        return;
      }
    }
    this.assetPickerWhere = where;
    this.assetPicker.showPicker();
  }

  selectedAsset(selectedAsset: AssetInterface): void {
    if (this.assetPickerWhere.indexOf('frames') != -1) {
      const orientation: string = this.assetPickerWhere
        .replace('frames', '')
        .toLowerCase();
      const frame: CharacterFrame = new CharacterFrame(
        null,
        selectedAsset.id,
        selectedAsset.url,
        orientation,
        this.loadedCharacter[this.assetPickerWhere].length
      );
      this.loadedCharacter[this.assetPickerWhere].push(frame);
    } else {
      const where: string =
        this.assetPickerWhere.substring(0, 1).toUpperCase() +
        this.assetPickerWhere.substring(1);
      this.loadedCharacter['idAsset' + where] = selectedAsset.id;
      this.loadedCharacter['asset' + where + 'Url'] = selectedAsset.url;
    }
    this.startAnimation();
  }

  startAnimation(): void {
    const sentList: string[] = ['up', 'down', 'left', 'right'];
    for (const sent of sentList) {
      clearInterval(this.animationTimer[sent]);
      const sentUpper: string =
        sent.substring(0, 1).toUpperCase() + sent.substring(1);

      if (this.loadedCharacter['allFrames' + sentUpper].length > 1) {
        this.animationTimer[sent] = setInterval((): void => {
          this.animatePreview(sent);
        }, 300);
      } else {
        this.animationImage[sent] =
          this.loadedCharacter['asset' + sentUpper + 'Url'];
      }
    }
  }

  animatePreview(sent: string): void {
    const sentUpper: string =
      sent.substring(0, 1).toUpperCase() + sent.substring(1);
    this.animationInd[sent]++;
    if (
      this.animationInd[sent] >=
      this.loadedCharacter['allFrames' + sentUpper].length
    ) {
      this.animationInd[sent] = 0;
    }
    this.animationImage[sent] =
      this.loadedCharacter['allFrames' + sentUpper][this.animationInd[sent]];
  }

  frameDelete(sent: string, frame: CharacterFrame): void {
    const conf: boolean = confirm('¿Estás seguro de querer borrar este frame?');
    if (conf) {
      const sentUpper: string =
        sent.substring(0, 1).toUpperCase() + sent.substring(1);
      const ind: number = this.loadedCharacter['frames' + sentUpper].findIndex(
        (x: CharacterFrame): boolean =>
          x.id + x.idAsset.toString() == frame.id + frame.idAsset.toString()
      );
      this.loadedCharacter['frames' + sentUpper].splice(ind, 1);
      this.updateFrameOrders(sentUpper);
    }
  }

  frameLeft(sent: string, frame: CharacterFrame): void {
    const sentUpper: string =
      sent.substring(0, 1).toUpperCase() + sent.substring(1);
    const ind: number = this.loadedCharacter['frames' + sentUpper].findIndex(
      (x: CharacterFrame): boolean =>
        x.id + x.idAsset.toString() == frame.id + frame.idAsset.toString()
    );
    if (ind == 0) {
      return;
    }
    const aux: CharacterFrame = this.loadedCharacter['frames' + sentUpper][ind];
    this.loadedCharacter['frames' + sentUpper][ind] =
      this.loadedCharacter['frames' + sentUpper][ind - 1];
    this.loadedCharacter['frames' + sentUpper][ind - 1] = aux;
    this.updateFrameOrders(sentUpper);
  }

  frameRight(sent: string, frame: CharacterFrame): void {
    const sentUpper: string =
      sent.substring(0, 1).toUpperCase() + sent.substring(1);
    const ind: number = this.loadedCharacter['frames' + sentUpper].findIndex(
      (x: CharacterFrame): boolean =>
        x.id + x.idAsset.toString() == frame.id + frame.idAsset.toString()
    );
    if (ind == this.loadedCharacter['frames' + sentUpper].length - 1) {
      return;
    }
    const aux: CharacterFrame = this.loadedCharacter['frames' + sentUpper][ind];
    this.loadedCharacter['frames' + sentUpper][ind] =
      this.loadedCharacter['frames' + sentUpper][ind + 1];
    this.loadedCharacter['frames' + sentUpper][ind + 1] = aux;
    this.updateFrameOrders(sentUpper);
  }

  updateFrameOrders(sent: string): void {
    for (const frameOrder in this.loadedCharacter['frames' + sent]) {
      this.loadedCharacter['frames' + sent][frameOrder].order =
        parseInt(frameOrder);
    }
  }

  addNarrative(): void {
    this.loadedCharacter.narratives.push(
      new Narrative(null, '', this.loadedCharacter.narratives.length + 1)
    );
  }

  moveNarrative(narrative: Narrative, sent: string): void {
    const ind: number = this.loadedCharacter.narratives.findIndex(
      (x: Narrative): boolean => x.order == narrative.order
    );
    const aux: Narrative = this.loadedCharacter.narratives[ind];
    if (sent == 'up') {
      if (ind == 0) {
        return;
      }
      this.loadedCharacter.narratives[ind] =
        this.loadedCharacter.narratives[ind - 1];
      this.loadedCharacter.narratives[ind - 1] = aux;
    }
    if (sent == 'down') {
      if (ind == this.loadedCharacter.narratives.length - 1) {
        return;
      }
      this.loadedCharacter.narratives[ind] =
        this.loadedCharacter.narratives[ind + 1];
      this.loadedCharacter.narratives[ind + 1] = aux;
    }
    this.updateNarrativeOrders();
  }

  deleteNarrative(narrative: Narrative): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar este diálogo?'
    );
    if (conf) {
      const ind: number = this.loadedCharacter.narratives.findIndex(
        (x: Narrative): boolean => x.order == narrative.order
      );
      this.loadedCharacter.narratives.splice(ind, 1);
      this.updateNarrativeOrders();
    }
  }

  updateNarrativeOrders(): void {
    for (const narrativeOrder in this.loadedCharacter.narratives) {
      this.loadedCharacter.narratives[narrativeOrder].order =
        parseInt(narrativeOrder) + 1;
    }
  }

  saveCharacter(): void {
    let validate: boolean = true;
    if (this.loadedCharacter.type == null) {
      alert('¡Tienes que elegir el tipo de personaje!');
      validate = false;
    }

    if (validate && this.loadedCharacter.name == null) {
      alert('¡No puedes dejar el nombre del personaje en blanco!');
      validate = false;
    }

    if (validate && this.loadedCharacter.width == null) {
      alert('¡No puedes dejar la anchura del personaje en blanco!');
      validate = false;
    }

    if (validate && this.loadedCharacter.height == null) {
      alert('¡No puedes dejar la altura del personaje en blanco!');
      validate = false;
    }

    if (this.loadedCharacter.type == 1) {
      if (validate && this.loadedCharacter.health == null) {
        alert('¡No puedes dejar la salud del enemigo en blanco!');
        validate = false;
      }

      if (validate && this.loadedCharacter.attack == null) {
        alert('¡No puedes dejar el ataque del enemigo en blanco!');
        validate = false;
      }

      if (validate && this.loadedCharacter.defense == null) {
        alert('¡No puedes dejar la defensa del enemigo en blanco!');
        validate = false;
      }

      if (validate && this.loadedCharacter.speed == null) {
        alert('¡No puedes dejar la velocidad del enemigo en blanco!');
        validate = false;
      }

      if (validate && this.loadedCharacter.respawn == null) {
        alert(
          '¡No puedes dejar el tiempo de reaparición del enemigo en blanco!'
        );
        validate = false;
      }

      if (
        validate &&
        this.loadedCharacter.dropIdItem != null &&
        this.loadedCharacter.dropChance == null
      ) {
        alert(
          '¡Has elegido un item para el enemigo, pero no has indicado el porcentaje de obtención!'
        );
        validate = false;
      }

      if (
        validate &&
        this.loadedCharacter.dropChance != null &&
        this.loadedCharacter.dropIdItem == null
      ) {
        alert(
          '¡Has indicado el porcentaje de obtención de un item pero no has elegido ninguno!'
        );
        validate = false;
      }

      if (
        validate &&
        this.loadedCharacter.dropChance != null &&
        this.loadedCharacter.dropChance > 100
      ) {
        alert(
          '¡El porcentaje de obtención de un item no puede ser superior a 100%!'
        );
        this.loadedCharacter.dropChance = 100;
        validate = false;
      }
    }

    if (validate && this.loadedCharacter.idAssetDown == null) {
      alert(
        'Tienes que elegir por lo menos una imagen hacia abajo para el personaje'
      );
      validate = false;
    }

    if (
      validate &&
      this.loadedCharacter.type == 1 &&
      (this.loadedCharacter.idAssetDown == null ||
        this.loadedCharacter.idAssetUp == null ||
        this.loadedCharacter.idAssetLeft == null ||
        this.loadedCharacter.idAssetRight == null)
    ) {
      alert(
        'Para un enemigo tienes que elegir por lo menos una imagen en cada sentido.'
      );
      validate = false;
    }

    if (validate) {
      this.savingCharacter = true;
      this.as
        .saveCharacter(this.loadedCharacter.toInterface())
        .subscribe((result: StatusResult): void => {
          this.savingCharacter = false;
          if (result.status == 'ok') {
            this.showAddCharacter();
            this.loadCharacters();
            this.itemPicker.resetSelected();
            this.assetPicker.resetSelected();
          } else {
            alert('¡Ocurrió un error al guardar el personaje!');
            this.message = 'ERROR: Ocurrió un error al guardar el personaje.';
          }
        });
    }
  }

  editCharacter(character: Character): void {
    this.loadedCharacter = new Character(
      character.id,
      character.name,
      character.width,
      character.blockWidth,
      character.height,
      character.blockHeight,
      character.fixedPosition,
      character.idAssetUp,
      character.assetUpUrl != null
        ? character.assetUpUrl
        : '/assets/admin/no-asset.svg',
      character.idAssetDown,
      character.assetDownUrl,
      character.idAssetLeft,
      character.assetLeftUrl != null
        ? character.assetLeftUrl
        : '/assets/admin/no-asset.svg',
      character.idAssetRight,
      character.assetRightUrl != null
        ? character.assetRightUrl
        : '/assets/admin/no-asset.svg',
      character.type,
      character.health,
      character.attack,
      character.defense,
      character.speed,
      character.dropIdItem,
      character.dropAssetUrl != null
        ? character.dropAssetUrl
        : '/assets/admin/no-asset.svg',
      character.dropChance,
      character.respawn,
      [],
      [],
      [],
      [],
      character.narratives
    );
    const sentList: string[] = ['Up', 'Down', 'Left', 'Right'];
    for (const sent of sentList) {
      for (const frame of character['frames' + sent]) {
        this.loadedCharacter['frames' + sent].push(frame);
      }

      this.animationImage[sent.toLowerCase()] =
        this.loadedCharacter['asset' + sent + 'Url'] != null
          ? this.loadedCharacter['asset' + sent + 'Url']
          : '/assets/admin/no-asset.svg';
      this.animationInd[sent.toLowerCase()] = -1;
      clearInterval(this.animationTimer[sent.toLowerCase()]);
      this.animationTimer[sent.toLowerCase()] = null;
    }

    this.assetPickerWhere = null;
    this.changeTab('data');
    this.startAnimation();

    if (character.dropIdItem !== null) {
      const dropItem: ItemInterface = this.itemPicker.getItemById(
        character.dropIdItem
      );
      this.dropItemName = dropItem.name;
    } else {
      this.dropItemName = 'Elige un item';
    }

    this.characterDetailHeader = 'Editar personaje';
    this.showDetail = true;
  }

  deleteCharacter(character: Character): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar el personaje "' + character.name + '"?'
    );
    if (conf) {
      this.as
        .deleteCharacter(character.id)
        .subscribe((result: StatusMessageResult): void => {
          if (result.status == 'ok') {
            this.loadCharacters();
          }
          if (result.status == 'in-use') {
            alert(
              'El personaje está siendo usado. Cámbialo o bórralo antes de poder borrarlo.\n\n' +
                Utils.urldecode(result.message)
            );
          }
          if (result.status == 'error') {
            alert('¡Ocurrio un error al borrar el personaje!');
            this.message = 'ERROR: Ocurrió un error al borrar el personaje.';
          }
        });
    }
  }
}
