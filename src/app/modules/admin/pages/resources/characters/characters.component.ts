import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetInterface } from '@interfaces/asset.interfaces';
import {
  CharacterFrameDirection,
  CharacterResult,
  CharacterTypeInterface,
} from '@interfaces/character.interfaces';
import { StatusMessageResult, StatusResult } from '@interfaces/interfaces';
import { ItemInterface } from '@interfaces/item.interfaces';
import CharacterFrame from '@model/character-frame.model';
import Character from '@model/character.model';
import Key from '@model/key.model';
import Narrative from '@model/narrative.model';
import { urldecode } from '@osumi/tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import PlayService from '@services/play.service';
import AssetPickerComponent from '@shared/components/asset-picker/asset-picker.component';
import HeaderComponent from '@shared/components/header/header.component';
import ItemPickerComponent from '@shared/components/item-picker/item-picker.component';

type AnimationDirection = 'up' | 'down' | 'left' | 'right';
type AnimationImages = Record<AnimationDirection, string>;
type AnimationIndexes = Record<AnimationDirection, number>;
type AnimationTimers = Record<AnimationDirection, number | null>;
type CharacterAssetIdKey = 'idAssetUp' | 'idAssetDown' | 'idAssetLeft' | 'idAssetRight';
type CharacterAssetUrlKey = 'assetUpUrl' | 'assetDownUrl' | 'assetLeftUrl' | 'assetRightUrl';
type CharacterFrameKey = 'framesUp' | 'framesDown' | 'framesLeft' | 'framesRight';
type CharacterAllFramesKey = 'allFramesUp' | 'allFramesDown' | 'allFramesLeft' | 'allFramesRight';
type AssetPickerWhere = AnimationDirection | CharacterFrameKey;

@Component({
  selector: 'game-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss', '../../scss/resources.scss'],
  imports: [FormsModule, HeaderComponent, AssetPickerComponent, ItemPickerComponent],
})
export default class CharactersComponent implements OnInit {
  private readonly as: ApiService = inject(ApiService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly play: PlayService = inject(PlayService);

  characterFilter: number | null = null;
  filterListOption: string = 'items';
  typeList: CharacterTypeInterface[] = [
    { id: 0, name: 'NPC' },
    { id: 1, name: 'Enemigo' },
  ];
  characterList: Character[] = [];
  characterListFiltered: WritableSignal<Character[]> = signal<Character[]>([]);
  message: WritableSignal<string | null> = signal<string | null>(null);
  loadedCharacter: Character = new Character();
  showDetail: WritableSignal<boolean> = signal<boolean>(false);
  detailtTab: string = 'data';
  characterDetailHeader: WritableSignal<string> = signal<string>('');
  dropItemName: WritableSignal<string> = signal<string>('');
  savingCharacter: WritableSignal<boolean> = signal<boolean>(false);
  assetPickerWhere: AssetPickerWhere | null = null;
  assetPicker: Signal<AssetPickerComponent> =
    viewChild.required<AssetPickerComponent>('assetPicker');
  itemPicker: Signal<ItemPickerComponent> = viewChild.required<ItemPickerComponent>('itemPicker');
  animationImage: AnimationImages = {
    up: '',
    down: '',
    left: '',
    right: '',
  };
  animationInd: AnimationIndexes = {
    up: -1,
    down: -1,
    left: -1,
    right: -1,
  };
  animationTimer: AnimationTimers = {
    up: null,
    down: null,
    left: null,
    right: null,
  };
  private readonly animationDirections: AnimationDirection[] = ['up', 'down', 'left', 'right'];
  private readonly characterDirections: Record<AnimationDirection, CharacterFrameDirection> = {
    up: 'Up',
    down: 'Down',
    left: 'Left',
    right: 'Right',
  };

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
      if (result.status === 'ok') {
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
        (x: Character): boolean => x.type === this.characterFilter,
      );
    }
    this.characterListFiltered.set(filteredList);
  }

  changeFilterListOption(ev: MouseEvent, option: string): void {
    if (ev) {
      ev.preventDefault();
    }
    this.filterListOption = option;
  }

  resetLoadedCharacter(): void {
    for (const sent of this.animationDirections) {
      this.clearAnimationTimer(sent);
    }
    this.loadedCharacter = new Character();
    this.loadedCharacter.dropAssetUrl = '/admin/no-asset.svg';
    this.dropItemName.set('Elige un item');
    this.loadedCharacter.assetUpUrl = '/admin/no-asset.svg';
    this.animationImage.up = '/admin/no-asset.svg';
    this.loadedCharacter.assetDownUrl = '/admin/no-asset.svg';
    this.animationImage.down = '/admin/no-asset.svg';
    this.loadedCharacter.assetLeftUrl = '/admin/no-asset.svg';
    this.animationImage.left = '/admin/no-asset.svg';
    this.loadedCharacter.assetRightUrl = '/admin/no-asset.svg';
    this.animationImage.right = '/admin/no-asset.svg';
  }

  showAddCharacter(ev: MouseEvent | null = null): void {
    if (ev) {
      ev.preventDefault();
    }
    if (!this.showDetail()) {
      this.resetLoadedCharacter();
      this.characterDetailHeader.set('Nuevo personaje');
      this.detailtTab = 'data';

      this.showDetail.set(true);
    } else {
      this.showDetail.set(false);
      this.resetLoadedCharacter();
    }
  }

  changeTab(tab: string): void {
    this.detailtTab = tab;
  }

  openItemPicker(): void {
    this.itemPicker().showPicker();
  }

  selectedItem(selectedItem: ItemInterface): void {
    this.loadedCharacter.dropIdItem = selectedItem.id;
    this.loadedCharacter.dropAssetUrl = selectedItem.assetUrl;
    this.dropItemName.set(selectedItem.name as string);
  }

  removeSelectedDropItem(ev: MouseEvent): void {
    if (ev) {
      ev.preventDefault();
    }
    this.loadedCharacter.dropIdItem = null;
    this.loadedCharacter.dropAssetUrl = '/admin/no-asset.svg';
    this.dropItemName.set('Elige un item');
  }

  openAssetPicker(where: string): void {
    if (!this.isAssetPickerWhere(where)) {
      return;
    }

    if (this.isFrameKey(where)) {
      const direction: CharacterFrameDirection = this.getFrameKeyDirection(where);
      if (this.loadedCharacter[this.getAssetIdKey(direction)] === null) {
        alert('Antes de añadir un frame tienes que elegir una imagen principal.');
        return;
      }
    }
    this.assetPickerWhere = where;
    this.assetPicker().showPicker();
  }

  selectedAsset(selectedAsset: AssetInterface): void {
    if (this.assetPickerWhere === null) {
      return;
    }

    if (this.isFrameKey(this.assetPickerWhere)) {
      const orientation: AnimationDirection = this.getFrameKeyDirection(
        this.assetPickerWhere,
      ).toLowerCase() as AnimationDirection;
      const frame: CharacterFrame = new CharacterFrame(
        null,
        selectedAsset.id,
        selectedAsset.url,
        orientation,
        this.loadedCharacter[this.assetPickerWhere].length,
      );
      this.loadedCharacter[this.assetPickerWhere].push(frame);
    } else {
      const direction: CharacterFrameDirection = this.characterDirections[this.assetPickerWhere];
      this.loadedCharacter[this.getAssetIdKey(direction)] = selectedAsset.id;
      this.loadedCharacter[this.getAssetUrlKey(direction)] = selectedAsset.url;
    }
    this.startAnimation();
  }

  startAnimation(): void {
    for (const sent of this.animationDirections) {
      this.clearAnimationTimer(sent);
      const direction: CharacterFrameDirection = this.characterDirections[sent];
      const allFrames: string[] = this.loadedCharacter[this.getAllFramesKey(direction)];

      if (allFrames.length > 1) {
        this.animationTimer[sent] = window.setInterval((): void => {
          this.animatePreview(sent);
        }, 300);
      } else {
        this.animationImage[sent] =
          this.loadedCharacter[this.getAssetUrlKey(direction)] ?? '/admin/no-asset.svg';
      }
    }
  }

  animatePreview(sent: AnimationDirection): void {
    const direction: CharacterFrameDirection = this.characterDirections[sent];
    const allFrames: string[] = this.loadedCharacter[this.getAllFramesKey(direction)];

    this.animationInd[sent]++;
    if (this.animationInd[sent] >= allFrames.length) {
      this.animationInd[sent] = 0;
    }
    this.animationImage[sent] = allFrames[this.animationInd[sent]] ?? '/admin/no-asset.svg';
  }

  frameDelete(sent: AnimationDirection, frame: CharacterFrame): void {
    const conf: boolean = confirm('¿Estás seguro de querer borrar este frame?');
    if (conf) {
      const direction: CharacterFrameDirection = this.characterDirections[sent];
      const frames: CharacterFrame[] = this.loadedCharacter[this.getFrameKey(direction)];
      const ind: number = frames.findIndex(
        (x: CharacterFrame): boolean =>
          String(x.id) + String(x.idAsset) === String(frame.id) + String(frame.idAsset),
      );
      frames.splice(ind, 1);
      this.updateFrameOrders(direction);
    }
  }

  frameLeft(sent: AnimationDirection, frame: CharacterFrame): void {
    const direction: CharacterFrameDirection = this.characterDirections[sent];
    const frames: CharacterFrame[] = this.loadedCharacter[this.getFrameKey(direction)];
    const ind: number = frames.findIndex(
      (x: CharacterFrame): boolean =>
        String(x.id) + String(x.idAsset) === String(frame.id) + String(frame.idAsset),
    );
    if (ind === 0) {
      return;
    }
    const aux: CharacterFrame = frames[ind];
    frames[ind] = frames[ind - 1];
    frames[ind - 1] = aux;
    this.updateFrameOrders(direction);
  }

  frameRight(sent: AnimationDirection, frame: CharacterFrame): void {
    const direction: CharacterFrameDirection = this.characterDirections[sent];
    const frames: CharacterFrame[] = this.loadedCharacter[this.getFrameKey(direction)];
    const ind: number = frames.findIndex(
      (x: CharacterFrame): boolean =>
        String(x.id) + String(x.idAsset) === String(frame.id) + String(frame.idAsset),
    );
    if (ind === frames.length - 1) {
      return;
    }
    const aux: CharacterFrame = frames[ind];
    frames[ind] = frames[ind + 1];
    frames[ind + 1] = aux;
    this.updateFrameOrders(direction);
  }

  updateFrameOrders(sent: CharacterFrameDirection): void {
    const frames: CharacterFrame[] = this.loadedCharacter[this.getFrameKey(sent)];
    frames.forEach((frame: CharacterFrame, frameOrder: number): void => {
      frame.order = frameOrder;
    });
  }

  addNarrative(): void {
    this.loadedCharacter.narratives.push(
      new Narrative(null, '', this.loadedCharacter.narratives.length + 1),
    );
  }

  moveNarrative(narrative: Narrative, sent: string): void {
    const ind: number = this.loadedCharacter.narratives.findIndex(
      (x: Narrative): boolean => x.order == narrative.order,
    );
    const aux: Narrative = this.loadedCharacter.narratives[ind];
    if (sent === 'up') {
      if (ind === 0) {
        return;
      }
      this.loadedCharacter.narratives[ind] = this.loadedCharacter.narratives[ind - 1];
      this.loadedCharacter.narratives[ind - 1] = aux;
    }
    if (sent === 'down') {
      if (ind === this.loadedCharacter.narratives.length - 1) {
        return;
      }
      this.loadedCharacter.narratives[ind] = this.loadedCharacter.narratives[ind + 1];
      this.loadedCharacter.narratives[ind + 1] = aux;
    }
    this.updateNarrativeOrders();
  }

  deleteNarrative(narrative: Narrative): void {
    const conf: boolean = confirm('¿Estás seguro de querer borrar este diálogo?');
    if (conf) {
      const ind: number = this.loadedCharacter.narratives.findIndex(
        (x: Narrative): boolean => x.order === narrative.order,
      );
      this.loadedCharacter.narratives.splice(ind, 1);
      this.updateNarrativeOrders();
    }
  }

  updateNarrativeOrders(): void {
    for (const narrativeOrder in this.loadedCharacter.narratives) {
      this.loadedCharacter.narratives[narrativeOrder].order = parseInt(narrativeOrder) + 1;
    }
  }

  saveCharacter(): void {
    let validate: boolean = true;
    if (this.loadedCharacter.type === null) {
      alert('¡Tienes que elegir el tipo de personaje!');
      validate = false;
    }

    if (validate && this.loadedCharacter.name === null) {
      alert('¡No puedes dejar el nombre del personaje en blanco!');
      validate = false;
    }

    if (validate && this.loadedCharacter.width === null) {
      alert('¡No puedes dejar la anchura del personaje en blanco!');
      validate = false;
    }

    if (validate && this.loadedCharacter.height === null) {
      alert('¡No puedes dejar la altura del personaje en blanco!');
      validate = false;
    }

    if (this.loadedCharacter.type === 1) {
      if (validate && this.loadedCharacter.health === null) {
        alert('¡No puedes dejar la salud del enemigo en blanco!');
        validate = false;
      }

      if (validate && this.loadedCharacter.attack === null) {
        alert('¡No puedes dejar el ataque del enemigo en blanco!');
        validate = false;
      }

      if (validate && this.loadedCharacter.defense === null) {
        alert('¡No puedes dejar la defensa del enemigo en blanco!');
        validate = false;
      }

      if (validate && this.loadedCharacter.speed === null) {
        alert('¡No puedes dejar la velocidad del enemigo en blanco!');
        validate = false;
      }

      if (validate && this.loadedCharacter.respawn === null) {
        alert('¡No puedes dejar el tiempo de reaparición del enemigo en blanco!');
        validate = false;
      }

      if (
        validate &&
        this.loadedCharacter.dropIdItem !== null &&
        this.loadedCharacter.dropChance === null
      ) {
        alert(
          '¡Has elegido un item para el enemigo, pero no has indicado el porcentaje de obtención!',
        );
        validate = false;
      }

      if (
        validate &&
        this.loadedCharacter.dropChance !== null &&
        this.loadedCharacter.dropIdItem === null
      ) {
        alert('¡Has indicado el porcentaje de obtención de un item pero no has elegido ninguno!');
        validate = false;
      }

      if (
        validate &&
        this.loadedCharacter.dropChance !== null &&
        this.loadedCharacter.dropChance > 100
      ) {
        alert('¡El porcentaje de obtención de un item no puede ser superior a 100%!');
        this.loadedCharacter.dropChance = 100;
        validate = false;
      }
    }

    if (validate && this.loadedCharacter.idAssetDown === null) {
      alert('Tienes que elegir por lo menos una imagen hacia abajo para el personaje');
      validate = false;
    }

    if (
      validate &&
      this.loadedCharacter.type === 1 &&
      (this.loadedCharacter.idAssetDown === null ||
        this.loadedCharacter.idAssetUp === null ||
        this.loadedCharacter.idAssetLeft === null ||
        this.loadedCharacter.idAssetRight === null)
    ) {
      alert('Para un enemigo tienes que elegir por lo menos una imagen en cada sentido.');
      validate = false;
    }

    if (validate) {
      this.savingCharacter.set(true);
      this.as.saveCharacter(this.loadedCharacter.toInterface()).subscribe({
        next: (result: StatusResult): void => {
          this.savingCharacter.set(false);
          if (result.status === 'ok') {
            this.showAddCharacter();
            this.loadCharacters();
            this.itemPicker().resetSelected();
            this.assetPicker().resetSelected();
          } else {
            alert('¡Ocurrió un error al guardar el personaje!');
            this.message.set('ERROR: Ocurrió un error al guardar el personaje.');
          }
        },
        error: (): void => {
          this.savingCharacter.set(false);
          alert('¡Ocurrió un error al guardar el personaje!');
          this.message.set('ERROR: Ocurrió un error al guardar el personaje.');
        },
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
      character.assetUpUrl !== null ? character.assetUpUrl : '/admin/no-asset.svg',
      character.idAssetDown,
      character.assetDownUrl,
      character.idAssetLeft,
      character.assetLeftUrl !== null ? character.assetLeftUrl : '/admin/no-asset.svg',
      character.idAssetRight,
      character.assetRightUrl !== null ? character.assetRightUrl : '/admin/no-asset.svg',
      character.type,
      character.health,
      character.attack,
      character.defense,
      character.speed,
      character.dropIdItem,
      character.dropAssetUrl !== null ? character.dropAssetUrl : '/admin/no-asset.svg',
      character.dropChance,
      character.respawn,
      [],
      [],
      [],
      [],
      character.narratives,
    );
    const sentList: CharacterFrameDirection[] = ['Up', 'Down', 'Left', 'Right'];
    for (const sent of sentList) {
      for (const frame of character[this.getFrameKey(sent)]) {
        this.loadedCharacter[this.getFrameKey(sent)].push(frame);
      }

      const animationDirection: AnimationDirection = sent.toLowerCase() as AnimationDirection;
      const assetUrl: string | null = this.loadedCharacter[this.getAssetUrlKey(sent)];
      this.animationImage[animationDirection] = assetUrl ?? '/admin/no-asset.svg';
      this.animationInd[animationDirection] = -1;
      this.clearAnimationTimer(animationDirection);
    }

    this.assetPickerWhere = null;
    this.changeTab('data');
    this.startAnimation();

    if (character.dropIdItem !== null) {
      const dropItem: ItemInterface | null = this.itemPicker().getItemById(character.dropIdItem);
      this.dropItemName.set(dropItem?.name ?? 'Elige un item');
    } else {
      this.dropItemName.set('Elige un item');
    }

    this.characterDetailHeader.set('Editar personaje');
    this.showDetail.set(true);
  }

  deleteCharacter(character: Character): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar el personaje "' + character.name + '"?',
    );
    if (conf && character.id !== null) {
      this.as.deleteCharacter(character.id).subscribe({
        next: (result: StatusMessageResult): void => {
          if (result.status === 'ok') {
            this.loadCharacters();
          }
          if (result.status === 'in-use') {
            alert(
              'El personaje está siendo usado. Cámbialo o bórralo antes de poder borrarlo.\n\n' +
                urldecode(result.message),
            );
          }
          if (result.status === 'error') {
            alert('¡Ocurrio un error al borrar el personaje!');
            this.message.set('ERROR: Ocurrió un error al borrar el personaje.');
          }
        },
        error: (): void => {
          alert('¡Ocurrio un error al borrar el personaje!');
          this.message.set('ERROR: Ocurrió un error al borrar el personaje.');
        },
      });
    }
  }

  private clearAnimationTimer(sent: AnimationDirection): void {
    if (this.animationTimer[sent] !== null) {
      clearInterval(this.animationTimer[sent]);
      this.animationTimer[sent] = null;
    }
  }

  private getAssetIdKey(direction: CharacterFrameDirection): CharacterAssetIdKey {
    return `idAsset${direction}` as CharacterAssetIdKey;
  }

  private getAssetUrlKey(direction: CharacterFrameDirection): CharacterAssetUrlKey {
    return `asset${direction}Url` as CharacterAssetUrlKey;
  }

  private getFrameKey(direction: CharacterFrameDirection): CharacterFrameKey {
    return `frames${direction}` as CharacterFrameKey;
  }

  private getAllFramesKey(direction: CharacterFrameDirection): CharacterAllFramesKey {
    return `allFrames${direction}` as CharacterAllFramesKey;
  }

  private getFrameKeyDirection(frameKey: CharacterFrameKey): CharacterFrameDirection {
    return frameKey.replace('frames', '') as CharacterFrameDirection;
  }

  private isAssetPickerWhere(where: string): where is AssetPickerWhere {
    return this.animationDirections.includes(where as AnimationDirection) || this.isFrameKey(where);
  }

  private isFrameKey(where: string): where is CharacterFrameKey {
    return ['framesUp', 'framesDown', 'framesLeft', 'framesRight'].includes(where);
  }
}
