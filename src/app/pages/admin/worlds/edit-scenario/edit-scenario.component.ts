import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }                    from '../../../../services/api.service';
import { CommonService }                 from '../../../../services/common.service';
import { ClassMapperService }            from '../../../../services/class-mapper.service';
import { Scenario }                      from '../../../../model/scenario.model';
import { ScenarioData }                  from '../../../../model/scenario-data.model';

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
	cellOption = {
		background: '/assets/no-asset.svg',
		scenarioObject: '/assets/no-asset.svg',
		character: '/assets/no-asset.svg'
	};

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
				this.cs.urldecode(cell.backgroundName),
				this.cs.urldecode(cell.backgroundAssetUrl),
				cell.idScenarioObject,
				this.cs.urldecode(cell.scenarioObjectName),
				this.cs.urldecode(cell.scenarioObjectAssetUrl),
				cell.idCharacter,
				this.cs.urldecode(cell.characterName),
				this.cs.urldecode(cell.characterAssetUrl)
			);
			this.showCellDetail = true;
		}
		else {
			this.showCellDetail = false;
		}
	}
}