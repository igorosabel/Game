import { Component, OnInit, ViewChild }  from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }                    from '../../../../services/api.service';
import { CommonService }                 from '../../../../services/common.service';
import { ClassMapperService }            from '../../../../services/class-mapper.service';
import { Scenario }                      from '../../../../model/scenario.model';
import { ScenarioData }                  from '../../../../model/scenario-data.model';
import { BackgroundPickerComponent }     from '../../../../components/background-picker/background-picker.component';
import { ScenarioObjectPickerComponent } from '../../../../components/scenario-object-picker/scenario-object-picker.component';
import { CharacterPickerComponent }      from '../../../../components/character-picker/character-picker.component';
import {
	BackgroundInterface,
	ScenarioObjectInterface,
	CharacterInterface
} from '../../../../interfaces/interfaces';

@Component({
	selector: 'game-edit-scenario',
	templateUrl: './edit-scenario.component.html',
	styleUrls: ['./edit-scenario.component.scss']
})
export class EditScenarioComponent implements OnInit {
	showDebug: boolean = true;
	worldId: number = null;
	scenarioId: number = null;
	scenarioWidth: number = 25;
	scenarioHeight: number = 16;
	scenario = [];
	loadedScenario: Scenario = null;
	loadedCell: ScenarioData = new ScenarioData();
	showCellDetail: boolean = false;
	connections = {
		up: null,
		down: null,
		left: null,
		right: null
	};
	@ViewChild('backgroundPicker', { static: true }) backgroundPicker: BackgroundPickerComponent;
	@ViewChild('scenarioObjectPicker', { static: true }) scenarioObjectPicker: ScenarioObjectPickerComponent;
	@ViewChild('characterPicker', { static: true }) characterPicker: CharacterPickerComponent;

	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private csm: ClassMapperService, private cs: CommonService) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.worldId = params.id_world;
			this.scenarioId = params.id_scenario;
			this.loadScenario();
		});
	}

	loadScenario() {
		this.as.getScenario(this.scenarioId).subscribe(result => {
			this.loadedScenario = this.csm.getScenario(result.scenario);
			for (let i=0; i<this.scenarioHeight; i++) {
				this.scenario[i] = [];
				for (let j=0; j<this.scenarioWidth; j++) {
					this.scenario[i][j] = new ScenarioData(null, i, j);
				}
			}
			let scenarioDataList = this.csm.getScenarioDatas(result.data);
			for (let scenarioData of scenarioDataList) {
				this.scenario[scenarioData.x][scenarioData.y] = scenarioData;
			}
			console.log(this.scenario);
			let connections = this.csm.getConnections(result.connection);
			for (let connection of connections) {
				this.connections[connection.orientation] = connection;
			}
		});
	}

	openCell(ev = null, cell: ScenarioData = null) {
		ev && ev.preventDefault();
		if (cell!=null) {
			this.loadedCell = new ScenarioData(
				cell.id,
				cell.x,
				cell.y,
				cell.idBackground,
				(cell.idBackground!=null) ? this.cs.urldecode(cell.backgroundName) : 'Sin fondo',
				(cell.idBackground!=null) ? this.cs.urldecode(cell.backgroundAssetUrl) : '/assets/no-asset.svg',
				cell.idScenarioObject,
				(cell.idScenarioObject!=null) ? this.cs.urldecode(cell.scenarioObjectName) : 'Sin objeto',
				(cell.idScenarioObject!=null) ? this.cs.urldecode(cell.scenarioObjectAssetUrl) : '/assets/no-asset.svg',
				cell.idCharacter,
				(cell.idCharacter!=null) ? this.cs.urldecode(cell.characterName) : 'Sin personaje',
				(cell.idCharacter!=null) ? this.cs.urldecode(cell.characterAssetUrl) : '/assets/no-asset.svg'
			);
			this.showCellDetail = true;
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
		this.loadedCell.backgroundAssetUrl = this.cs.urldecode(background.assetUrl);
		this.loadedCell.backgroundName = this.cs.urldecode(background.name);
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
		this.loadedCell.scenarioObjectAssetUrl = this.cs.urldecode(scenarioObject.assetUrl);
		this.loadedCell.scenarioObjectName = this.cs.urldecode(scenarioObject.name);
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
		this.loadedCell.characterAssetUrl = this.cs.urldecode(character.assetDownUrl);
		this.loadedCell.characterName = this.cs.urldecode(character.name);
	}

	deleteCharacter(ev) {
		ev && ev.preventDefault();
		this.loadedCell.idCharacter = null;
		this.loadedCell.characterAssetUrl = '/assets/no-asset.svg';
		this.loadedCell.characterName = 'Sin personaje';
	}
}