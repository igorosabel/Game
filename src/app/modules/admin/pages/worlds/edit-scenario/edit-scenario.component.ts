import { NgClass, NgStyle } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Constants from '@app/constants';
import { BackgroundInterface } from '@interfaces/background.interfaces';
import { CharacterInterface } from '@interfaces/character.interfaces';
import {
  StatusIdResult,
  StatusMessageResult,
  StatusResult,
} from '@interfaces/interfaces';
import {
  ConnectionListInterface,
  ScenarioDataResult,
  ScenarioObjectInterface,
  ScenarioResult,
  SelectedScenarioDataInterface,
} from '@interfaces/scenario.interfaces';
import { WorldStartInterface } from '@interfaces/world.interfaces';
import Connection from '@model/connection.model';
import Key from '@model/key.model';
import ScenarioData from '@model/scenario-data.model';
import Scenario from '@model/scenario.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import PlayService from '@services/play.service';
import BackgroundPickerComponent from '@shared/components/background-picker/background-picker.component';
import CharacterPickerComponent from '@shared/components/character-picker/character-picker.component';
import HeaderComponent from '@shared/components/header/header.component';
import ScenarioObjectPickerComponent from '@shared/components/scenario-object-picker/scenario-object-picker.component';
import Utils from '@shared/utils.class';

@Component({
  standalone: true,
  selector: 'game-edit-scenario',
  templateUrl: './edit-scenario.component.html',
  styleUrls: ['./edit-scenario.component.scss'],
  imports: [
    NgClass,
    NgStyle,
    FormsModule,
    HeaderComponent,
    BackgroundPickerComponent,
    ScenarioObjectPickerComponent,
    CharacterPickerComponent,
  ],
})
export default class EditScenarioComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private play: PlayService = inject(PlayService);

  selected: SelectedScenarioDataInterface = {
    selecting: null,
    idBackground: null,
    backgroundAssetUrl: '/admin/color-picker.svg',
    idScenarioObject: null,
    scenarioObjectAssetUrl: '/admin/color-picker.svg',
    scenarioObjectWidth: null,
    scenarioObjectHeight: null,
    idCharacter: null,
    characterAssetUrl: '/admin/color-picker.svg',
    characterWidth: null,
    characterHeight: null,
    characterHealth: null,
  };
  startSelecting: boolean = false;
  mapGenerating: string = '/admin/create-map.svg';
  showDebug: boolean = false;
  worldId: number = null;
  scenarioId: number = null;
  scenarioWidth: number = Constants.SCENARIO_COLS;
  scenarioHeight: number = Constants.SCENARIO_ROWS;
  scenario: ScenarioData[][] = [];
  loadedScenario: Scenario = null;
  loadedCell: ScenarioData = new ScenarioData();
  showCellDetail: boolean = false;
  savingCell: boolean = false;
  connections: ConnectionListInterface = {
    up: null,
    down: null,
    left: null,
    right: null,
  };
  scenarioList: Scenario[] = [];
  showConnectionsDetail: boolean = false;
  connectWhere: string = null;
  @ViewChild('backgroundPicker', { static: true })
  backgroundPicker: BackgroundPickerComponent;
  @ViewChild('scenarioObjectPicker', { static: true })
  scenarioObjectPicker: ScenarioObjectPickerComponent;
  @ViewChild('characterPicker', { static: true })
  characterPicker: CharacterPickerComponent;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.worldId = params.id_world;
      this.scenarioId = params.id_scenario;
      this.loadScenario();
      this.loadScenarioList();

      const esc: Key = this.play.keyboard('Escape');
      esc.press = (): void => {
        this.openCell();
      };
    });
  }

  loadScenario(): void {
    this.as
      .getScenario(this.scenarioId)
      .subscribe((result: ScenarioDataResult): void => {
        this.loadedScenario = this.cms.getScenario(result.scenario);
        for (let y: number = 0; y < this.scenarioHeight; y++) {
          this.scenario[y] = [];
          for (let x: number = 0; x < this.scenarioWidth; x++) {
            this.scenario[y][x] = new ScenarioData(null, this.scenarioId, x, y);
          }
        }
        const scenarioDataList: ScenarioData[] = this.cms.getScenarioDatas(
          result.data
        );
        for (const scenarioData of scenarioDataList) {
          this.scenario[scenarioData.y][scenarioData.x] = scenarioData;
        }
        this.connections = {
          up: null,
          down: null,
          left: null,
          right: null,
        };
        const connections: Connection[] = this.cms.getConnections(
          result.connection
        );
        for (const connection of connections) {
          this.connections[connection.orientation] = connection;
        }
      });
  }

  loadScenarioList(): void {
    this.as
      .getScenarios(this.worldId)
      .subscribe((result: ScenarioResult): void => {
        const scenarios: Scenario[] = this.cms.getScenarios(result.list);
        this.scenarioList = scenarios.filter(
          (x: Scenario): boolean => x.id != this.scenarioId
        );
      });
  }

  copyCell(mode: string): void {
    if (this.selected.selecting == mode) {
      this.selected.selecting = null;
    } else {
      this.selected.selecting = mode;
    }
  }

  cancelCopyCell(ev: MouseEvent, mode: string): void {
    ev && ev.preventDefault();
    const firstUpper: string =
      mode.substring(0, 1).toUpperCase() + mode.substring(1);
    this.selected['id' + firstUpper] = null;
    this.selected[mode + 'AssetUrl'] = '/admin/color-picker.svg';
    if (mode == 'scenarioObject' || mode == 'character') {
      this.selected[mode + 'Width'] = null;
      this.selected[mode + 'Height'] = null;
    }
  }

  selectStart(): void {
    this.startSelecting = !this.startSelecting;
  }

  selectWorldStart(cell: ScenarioData, check: boolean = true): void {
    const params: WorldStartInterface = {
      idScenario: this.scenarioId,
      x: cell.x,
      y: cell.y,
      check: check,
    };
    this.as
      .selectWorldStart(params)
      .subscribe((result: StatusMessageResult): void => {
        if (result.status == 'in-use') {
          const conf: boolean = confirm(
            '¡Atención! Este mundo tiene ya un punto de inicio en otro escenario ("' +
              Utils.urldecode(result.message) +
              '"). ¿Estás seguro de querer marcar este punto como inicio?'
          );
          if (conf) {
            this.selectWorldStart(cell, false);
          }
        }
        if (result.status == 'ok') {
          this.loadedScenario.startX = cell.x;
          this.loadedScenario.startY = cell.y;
          this.startSelecting = false;
        }
        if (result.status == 'error') {
          alert('ERROR: Ocurrió un error al marcar el punto de inicio.');
        }
      });
  }

  createMap(): void {
    this.mapGenerating = '/img/loading.svg';
    this.as
      .generateMap(this.scenarioId)
      .subscribe((result: StatusResult): void => {
        this.mapGenerating = '/admin/create-map.svg';
        if (result.status == 'ok') {
          alert('¡Mapa creado!');
        } else {
          alert('¡Ocurrió un error al crear el mapa!');
        }
      });
  }

  openCell(ev = null, cell: ScenarioData = null): void {
    ev && ev.preventDefault();
    if (cell != null) {
      if (this.startSelecting) {
        this.selectWorldStart(cell);
        return;
      }

      if (this.selected.selecting != null) {
        const mode: string = this.selected.selecting;
        const firstUpper: string =
          mode.substring(0, 1).toUpperCase() + mode.substring(1);
        if (cell['id' + firstUpper] != null) {
          this.selected['id' + firstUpper] = cell['id' + firstUpper];
          this.selected[mode + 'AssetUrl'] = cell[mode + 'AssetUrl'];
          if (mode == 'scenarioObject' || mode == 'character') {
            this.selected[mode + 'Width'] = cell[mode + 'Width'];
            this.selected[mode + 'Height'] = cell[mode + 'Height'];
            this.selected.characterHealth = cell.characterHealth;
          }
          this.selected.selecting = null;
        }
        return;
      }

      this.loadedCell = new ScenarioData(
        cell.id,
        cell.idScenario,
        cell.x,
        cell.y,
        cell.idBackground,
        cell.idBackground != null ? cell.backgroundName : 'Sin fondo',
        cell.idBackground != null
          ? cell.backgroundAssetUrl
          : '/admin/no-asset.svg',
        cell.idScenarioObject,
        cell.idScenarioObject != null ? cell.scenarioObjectName : 'Sin objeto',
        cell.idScenarioObject != null
          ? cell.scenarioObjectAssetUrl
          : '/admin/no-asset.svg',
        cell.scenarioObjectWidth,
        cell.scenarioObjectHeight,
        cell.scenarioObjectBlockWidth,
        cell.scenarioObjectBlockHeight,
        cell.idCharacter,
        cell.idCharacter != null ? cell.characterName : 'Sin personaje',
        cell.idCharacter != null
          ? cell.characterAssetUrl
          : '/admin/no-asset.svg',
        cell.characterWidth,
        cell.characterHeight,
        cell.characterBlockWidth,
        cell.characterBlockHeight,
        cell.characterHealth
      );

      let saveDirectly: boolean = false;
      if (this.selected.idBackground != null) {
        this.loadedCell.idBackground = this.selected.idBackground;
        this.loadedCell.backgroundAssetUrl = this.selected.backgroundAssetUrl;
        saveDirectly = true;
      }
      if (this.selected.idScenarioObject != null) {
        this.loadedCell.idScenarioObject = this.selected.idScenarioObject;
        this.loadedCell.scenarioObjectAssetUrl =
          this.selected.scenarioObjectAssetUrl;
        this.loadedCell.scenarioObjectWidth = this.selected.scenarioObjectWidth;
        this.loadedCell.scenarioObjectHeight =
          this.selected.scenarioObjectHeight;
        saveDirectly = true;
      }
      if (this.selected.idCharacter != null) {
        this.loadedCell.idCharacter = this.selected.idCharacter;
        this.loadedCell.characterAssetUrl = this.selected.characterAssetUrl;
        this.loadedCell.characterWidth = this.selected.characterWidth;
        this.loadedCell.characterHeight = this.selected.characterHeight;
        this.loadedCell.characterHealth = this.selected.characterHealth;
        saveDirectly = true;
      }

      if (!saveDirectly) {
        this.showCellDetail = true;
      } else {
        this.saveCell();
      }
    } else {
      this.showCellDetail = false;
    }
  }

  openBackgroundPicker(): void {
    this.backgroundPicker.showPicker();
  }

  selectedBackground(background: BackgroundInterface): void {
    this.loadedCell.idBackground = background.id;
    this.loadedCell.backgroundAssetUrl = background.assetUrl;
    this.loadedCell.backgroundName = background.name;
  }

  deleteBackground(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.loadedCell.idBackground = null;
    this.loadedCell.backgroundAssetUrl = '/admin/no-asset.svg';
    this.loadedCell.backgroundName = 'Sin fondo';
  }

  openScenarioObjectPicker(): void {
    if (this.loadedCell.idCharacter != null) {
      alert(
        'No puedes añadir un objeto y un personaje en la misma casilla. Si quieres añadir un objeto, quita antes el personaje.'
      );
      return;
    }
    this.scenarioObjectPicker.showPicker();
  }

  selectedScenarioObject(scenarioObject: ScenarioObjectInterface): void {
    this.loadedCell.idScenarioObject = scenarioObject.id;
    this.loadedCell.scenarioObjectAssetUrl = scenarioObject.assetUrl;
    this.loadedCell.scenarioObjectName = scenarioObject.name;
    this.loadedCell.scenarioObjectWidth = scenarioObject.width;
    this.loadedCell.scenarioObjectHeight = scenarioObject.height;
  }

  deleteScenarioObject(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.loadedCell.idScenarioObject = null;
    this.loadedCell.scenarioObjectAssetUrl = '/admin/no-asset.svg';
    this.loadedCell.scenarioObjectName = 'Sin objeto';
  }

  openCharacterPicker(): void {
    if (this.loadedCell.idScenarioObject != null) {
      alert(
        'No puedes añadir un objeto y un personaje en la misma casilla. Si quieres añadir un personaje, quita antes el objeto.'
      );
      return;
    }
    this.characterPicker.showPicker();
  }

  selectedCharacter(character: CharacterInterface): void {
    this.loadedCell.idCharacter = character.id;
    this.loadedCell.characterAssetUrl = character.assetDownUrl;
    this.loadedCell.characterName = character.name;
    this.loadedCell.characterWidth = character.width;
    this.loadedCell.characterHeight = character.height;
    this.loadedCell.characterHealth = character.health;
  }

  deleteCharacter(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.loadedCell.idCharacter = null;
    this.loadedCell.characterAssetUrl = '/admin/no-asset.svg';
    this.loadedCell.characterName = 'Sin personaje';
  }

  saveCell(): void {
    this.savingCell = true;
    this.as
      .saveScenarioData(this.loadedCell.toInterface())
      .subscribe((result: StatusIdResult): void => {
        if (result.status == 'ok') {
          this.loadedCell.id = result.id;
          this.scenario[this.loadedCell.y][this.loadedCell.x] = this.loadedCell;
          this.savingCell = false;
          this.openCell();
        }
      });
  }

  connect(sent: string): void {
    if (this.connections[sent] != null) {
      this.router.navigate([
        '/admin',
        'world',
        this.worldId,
        'scenario',
        this.connections[sent].to,
      ]);
      return;
    } else {
      this.connectWhere = sent;
      this.showConnectionDetail(null, true);
    }
  }

  deleteConnection(ev: MouseEvent, sent: string): void {
    ev && ev.preventDefault();
    this.as
      .deleteConnection(this.connections[sent].toInterface())
      .subscribe((result: StatusResult): void => {
        if (result.status == 'ok') {
          this.connections[sent] = null;
        } else {
          alert('¡Ocurrió un error al borrar la conexión!');
        }
      });
  }

  showConnectionDetail(ev: MouseEvent = null, mode = false): void {
    ev && ev.preventDefault();
    this.showConnectionsDetail = mode;
  }

  selectScenarioConnection(scenario: Scenario): void {
    const connectionCheck: boolean =
      (this.connections.up != null && this.connections.up.to == scenario.id) ||
      (this.connections.down != null &&
        this.connections.down.to == scenario.id) ||
      (this.connections.left != null &&
        this.connections.left.to == scenario.id) ||
      (this.connections.right != null &&
        this.connections.right.to == scenario.id);
    if (connectionCheck) {
      alert('¡Atención! Ya hay una conexión al escenario elegido.');
      return;
    }
    const connection = new Connection(
      this.loadedScenario.id,
      this.loadedScenario.name,
      scenario.id,
      scenario.name,
      this.connectWhere
    );

    this.as
      .saveConnection(connection.toInterface())
      .subscribe((result: StatusResult): void => {
        if (result.status == 'ok') {
          this.connections[this.connectWhere] = connection;
          this.connectWhere = null;
          this.showConnectionDetail(null, false);
        } else {
          alert('¡Ocurrió un error al guardar la conexión!');
        }
      });
  }
}
