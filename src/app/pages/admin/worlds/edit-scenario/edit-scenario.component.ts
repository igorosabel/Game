import { Component, OnInit, ViewChild }  from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }                    from '../../../../services/api.service';
import { CommonService }                 from '../../../../services/common.service';
import { ClassMapperService }            from '../../../../services/class-mapper.service';
import { PlayService }                   from '../../../../services/play.service';
import { Scenario }                      from '../../../../model/scenario.model';
import { ScenarioData }                  from '../../../../model/scenario-data.model';
import { Connection }                    from '../../../../model/connection.model';
import { BackgroundPickerComponent }     from '../../../../components/background-picker/background-picker.component';
import { ScenarioObjectPickerComponent } from '../../../../components/scenario-object-picker/scenario-object-picker.component';
import { CharacterPickerComponent }      from '../../../../components/character-picker/character-picker.component';
import {
	BackgroundInterface,
	ScenarioObjectInterface,
	CharacterInterface,
	WorldStartInterface
} from '../../../../interfaces/interfaces';

@Component({
	selector: 'game-edit-scenario',
	templateUrl: './edit-scenario.component.html',
	styleUrls: ['./edit-scenario.component.scss']
})
export class EditScenarioComponent implements OnInit {
	selected = {
		selecting: null,
		idBackground: null,
		backgroundAssetUrl: '/assets/color-picker.svg',
		idScenarioObject: null,
		scenarioObjectAssetUrl: '/assets/color-picker.svg',
		scenarioObjectWidth: null,
		scenarioObjectHeight: null,
		idCharacter: null,
		characterAssetUrl: '/assets/color-picker.svg',
		characterWidth: null,
		characterHeight: null
	};
	startSelecting: boolean = false;
	mapGenerating: string = '/assets/create-map.svg';
	showDebug: boolean = false;
	worldId: number = null;
	scenarioId: number = null;
	scenarioWidth: number = 25;
	scenarioHeight: number = 20;
	scenario = [];
	loadedScenario: Scenario = null;
	loadedCell: ScenarioData = new ScenarioData();
	showCellDetail: boolean = false;
	savingCell: boolean = false;
	connections = {
		up: null,
		down: null,
		left: null,
		right: null
	};
	scenarioList: Scenario[] = [];
	showConnectionsDetail: boolean = false;
	connectWhere: string = null;
	@ViewChild('backgroundPicker', { static: true }) backgroundPicker: BackgroundPickerComponent;
	@ViewChild('scenarioObjectPicker', { static: true }) scenarioObjectPicker: ScenarioObjectPickerComponent;
	@ViewChild('characterPicker', { static: true }) characterPicker: CharacterPickerComponent;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private as: ApiService,
		private cs: CommonService,
		private cms: ClassMapperService,
		private play: PlayService
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.worldId = params.id_world;
			this.scenarioId = params.id_scenario;
			this.loadScenario();
			this.loadScenarioList();
			
			let esc = this.play.keyboard(27);
			esc.press = () => { this.openCell() }; 
		});
	}

	loadScenario() {
		this.as.getScenario(this.scenarioId).subscribe(result => {
			this.loadedScenario = this.cms.getScenario(result.scenario);
			console.log(this.loadedScenario);
			for (let y=0; y<this.scenarioHeight; y++) {
				this.scenario[y] = [];
				for (let x=0; x<this.scenarioWidth; x++) {
					this.scenario[y][x] = new ScenarioData(null, this.scenarioId, x, y);
				}
			}
			let scenarioDataList = this.cms.getScenarioDatas(result.data);
			for (let scenarioData of scenarioDataList) {
				this.scenario[scenarioData.y][scenarioData.x] = scenarioData;
			}
			this.connections = {
				up: null,
				down: null,
				left: null,
				right: null
			};
			let connections = this.cms.getConnections(result.connection);
			for (let connection of connections) {
				this.connections[connection.orientation] = connection;
			}
		});
	}

	loadScenarioList() {
		this.as.getScenarios(this.worldId).subscribe(result => {
			let scenarios = this.cms.getScenarios(result.list);
			this.scenarioList = scenarios.filter(x => x.id != this.scenarioId);
		});
	}

	copyCell(mode: string) {
		if (this.selected.selecting==mode) {
			this.selected.selecting = null;
		}
		else {
			this.selected.selecting = mode;
		}
	}

	cancelCopyCell(ev, mode: string) {
		ev && ev.preventDefault();
		const firstUpper = mode.substring(0, 1).toUpperCase() + mode.substring(1);
		this.selected['id'+firstUpper] = null;
		this.selected[mode+'AssetUrl'] = '/assets/color-picker.svg';
		if (mode=='scenarioObject' || mode=='character') {
			this.selected[mode+'Width'] = null;
			this.selected[mode+'Height'] = null;
		}
	}

	selectStart() {
		this.startSelecting = !this.startSelecting;
	}

	selectWorldStart(cell: ScenarioData, check: boolean = true) {
		const params: WorldStartInterface = {
			idScenario: this.scenarioId,
			x: cell.x,
			y: cell.y,
			check: check
		};
		this.as.selectWorldStart(params).subscribe(result => {
			if (result.status=='in-use') {
				const conf = confirm('¡Atención! Este mundo tiene ya un punto de inicio en otro escenario ("' + this.cs.urldecode(result.message) + '"). ¿Estás seguro de querer marcar este punto como inicio?');
				if (conf) {
					this.selectWorldStart(cell, false);
				}
			}
			if (result.status=='ok') {
				this.loadedScenario.startX = cell.x;
				this.loadedScenario.startY = cell.y;
				this.startSelecting = false;
			}
			if (result.status=='error') {
				alert('ERROR: Ocurrió un error al marcar el punto de inicio.');
			}
		});
	}

	createMap() {
		this.mapGenerating = '/assets/loading.svg';
		this.as.generateMap(this.scenarioId).subscribe(result => {
			this.mapGenerating = '/assets/create-map.svg';
			if (result.status=='ok') {
				alert('¡Mapa creado!');
			}
			else {
				alert('¡Ocurrió un error al crear el mapa!');
			}
		});
	}

	openCell(ev = null, cell: ScenarioData = null) {
		ev && ev.preventDefault();
		if (cell!=null) {
			if (this.startSelecting) {
				this.selectWorldStart(cell);
				return;
			}

			if (this.selected.selecting!=null) {
				const mode = this.selected.selecting;
				const firstUpper = mode.substring(0, 1).toUpperCase() + mode.substring(1);
				if (cell['id'+firstUpper]!=null) {
					this.selected['id'+firstUpper] = cell['id'+firstUpper];
					this.selected[mode+'AssetUrl'] = cell[mode+'AssetUrl'];
					if (mode=='scenarioObject' || mode=='character') {
						this.selected[mode+'Width'] = cell[mode+'Width'];
						this.selected[mode+'Height'] = cell[mode+'Height'];
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
				(cell.idBackground!=null) ? cell.backgroundName : 'Sin fondo',
				(cell.idBackground!=null) ? cell.backgroundAssetUrl : '/assets/no-asset.svg',
				cell.idScenarioObject,
				(cell.idScenarioObject!=null) ? cell.scenarioObjectName : 'Sin objeto',
				(cell.idScenarioObject!=null) ? cell.scenarioObjectAssetUrl : '/assets/no-asset.svg',
				cell.scenarioObjectWidth,
				cell.scenarioObjectHeight,
				cell.idCharacter,
				(cell.idCharacter!=null) ? cell.characterName : 'Sin personaje',
				(cell.idCharacter!=null) ? cell.characterAssetUrl : '/assets/no-asset.svg',
				cell.characterWidth,
				cell.characterHeight
			);

			let saveDirectly = false;
			if (this.selected.idBackground!=null) {
				this.loadedCell.idBackground = this.selected.idBackground;
				this.loadedCell.backgroundAssetUrl = this.selected.backgroundAssetUrl;
				saveDirectly = true;
			}
			if (this.selected.idScenarioObject!=null) {
				this.loadedCell.idScenarioObject = this.selected.idScenarioObject;
				this.loadedCell.scenarioObjectAssetUrl = this.selected.scenarioObjectAssetUrl;
				this.loadedCell.scenarioObjectWidth = this.selected.scenarioObjectWidth;
				this.loadedCell.scenarioObjectHeight = this.selected.scenarioObjectHeight;
				saveDirectly = true;
			}
			if (this.selected.idCharacter!=null) {
				this.loadedCell.idCharacter = this.selected.idCharacter;
				this.loadedCell.characterAssetUrl = this.selected.characterAssetUrl;
				this.loadedCell.characterWidth = this.selected.characterWidth;
				this.loadedCell.characterHeight = this.selected.characterHeight;
				saveDirectly = true;
			}

			if (!saveDirectly) {
				this.showCellDetail = true;
			}
			else {
				this.saveCell();
			}
		}
		else {
			this.showCellDetail = false;
		}
	}

	openBackgroundPicker() {
		this.backgroundPicker.showPicker();
	}

	selectedBackground(background: BackgroundInterface) {
		this.loadedCell.idBackground = background.id;
		this.loadedCell.backgroundAssetUrl = background.assetUrl;
		this.loadedCell.backgroundName = background.name;
	}

	deleteBackground(ev) {
		ev && ev.preventDefault();
		this.loadedCell.idBackground = null;
		this.loadedCell.backgroundAssetUrl = '/assets/no-asset.svg';
		this.loadedCell.backgroundName = 'Sin fondo';
	}

	openScenarioObjectPicker() {
		if (this.loadedCell.idCharacter!=null) {
			alert('No puedes añadir un objeto y un personaje en la misma casilla. Si quieres añadir un objeto, quita antes el personaje.');
			return;
		}
		this.scenarioObjectPicker.showPicker();
	}

	selectedScenarioObject(scenarioObject: ScenarioObjectInterface) {
		this.loadedCell.idScenarioObject = scenarioObject.id;
		this.loadedCell.scenarioObjectAssetUrl = scenarioObject.assetUrl;
		this.loadedCell.scenarioObjectName = scenarioObject.name;
		this.loadedCell.scenarioObjectWidth = scenarioObject.width;
		this.loadedCell.scenarioObjectHeight = scenarioObject.height;
	}

	deleteScenarioObject(ev) {
		ev && ev.preventDefault();
		this.loadedCell.idScenarioObject = null;
		this.loadedCell.scenarioObjectAssetUrl = '/assets/no-asset.svg';
		this.loadedCell.scenarioObjectName = 'Sin objeto';
	}

	openCharacterPicker() {
		if (this.loadedCell.idScenarioObject!=null) {
			alert('No puedes añadir un objeto y un personaje en la misma casilla. Si quieres añadir un personaje, quita antes el objeto.');
			return;
		}
		this.characterPicker.showPicker();
	}

	selectedCharacter(character: CharacterInterface) {
		this.loadedCell.idCharacter = character.id;
		this.loadedCell.characterAssetUrl = character.assetDownUrl;
		this.loadedCell.characterName = character.name;
		this.loadedCell.characterWidth = character.width;
		this.loadedCell.characterHeight = character.height;
	}

	deleteCharacter(ev) {
		ev && ev.preventDefault();
		this.loadedCell.idCharacter = null;
		this.loadedCell.characterAssetUrl = '/assets/no-asset.svg';
		this.loadedCell.characterName = 'Sin personaje';
	}

	saveCell() {
		this.savingCell = true;
		this.as.saveScenarioData(this.loadedCell.toInterface()).subscribe(result => {
			if (result.status=='ok') {
				this.loadedCell.id = result.id;
				this.scenario[this.loadedCell.x][this.loadedCell.y] = this.loadedCell;
				this.savingCell = false;
				this.openCell();
			}
		});
	}

	connect(sent: string) {
		if (this.connections[sent]!=null) {
			this.router.navigate(['/admin', 'world', this.worldId, 'scenario', this.connections[sent].to]);
			return;
		}
		else {
			this.connectWhere = sent;
			this.showConnectionDetail(null, true);
		}
	}

	deleteConnection(ev, sent: string) {
		ev && ev.preventDefault();
		this.as.deleteConnection(this.connections[sent].toInterface()).subscribe(result => {
			this.connections[sent] = null;
		});
	}

	showConnectionDetail(ev = null, mode = false) {
		ev && ev.preventDefault();
		this.showConnectionsDetail = mode;
	}

	selectScenarioConnection(scenario: Scenario) {
		const connectionCheck = (this.connections.up!=null && this.connections.up.to==scenario.id) || (this.connections.down!=null && this.connections.down.to==scenario.id) || (this.connections.left!=null && this.connections.left.to==scenario.id) || (this.connections.right!=null && this.connections.right.to==scenario.id);
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

		this.as.saveConnection(connection.toInterface()).subscribe(result => {
			this.connections[this.connectWhere] = connection;
			this.connectWhere = null;
			this.showConnectionDetail(null, false);
		});
	}
}
