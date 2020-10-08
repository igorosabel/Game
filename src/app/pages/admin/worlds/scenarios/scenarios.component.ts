import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { CommonService }         from '../../../../services/common.service';
import { ApiService }         from '../../../../services/api.service';
import { ClassMapperService } from '../../../../services/class-mapper.service';
import { Scenario }              from '../../../../model/scenario.model';

@Component({
	selector: 'game-scenarios',
	templateUrl: './scenarios.component.html',
	styleUrls: ['./scenarios.component.scss']
})
export class ScenariosComponent implements OnInit {
	worldId: number = null;
	scenarioList: Scenario[] = [];
	message: string = null;
	loadedScenario: Scenario = new Scenario();
	showDetail: boolean = false;
	scenarioDetailHeader: string = '';

	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.worldId = params.id_world;
			this.loadScenarios();
		});
	}

	loadScenarios() {
		this.message = 'Cargando...';
		this.as.getScenarios(this.worldId).subscribe(result => {
			if (result.status=='ok') {
				this.message = null;
				this.scenarioList = this.cms.getScenarios(result.list);
			}
			else {
				this.message = 'ERROR: Ocurrió un error al obtener la lista de escenarios.';
			}
		});
	}
	
	resetLoadedScenario() {
		this.loadedScenario = new Scenario(null, this.worldId, null, false);
	}

	showAddScenario(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedScenario();
			this.scenarioDetailHeader = 'Nuevo escenario';

			this.showDetail = true;
		}
		else {
			this.showDetail = false;
		}
	}
	
	saveScenario() {
		let validate = true;
		if (this.loadedScenario.name=='') {
			validate = false;
			alert('¡No puedes dejar el nombre del escenario en blanco!');
		}

		if (validate) {
			this.as.saveScenario(this.loadedScenario.toInterface()).subscribe(result => {
				if (result.status=='ok') {
					this.showAddScenario();
					this.loadScenarios();
				}
				else {
					alert('¡Ocurrió un error al guardar el escenario!');
					this.message = 'ERROR: Ocurrió un error al guardar el escenario.';
				}
			});
		}
	}

	editScenario(scenario: Scenario) {
		this.loadedScenario = new Scenario(
			scenario.id,
			scenario.idWorld,
			this.cs.urldecode(scenario.name),
			scenario.friendly
		);

		this.scenarioDetailHeader = 'Editar escenario';
		this.showDetail = true;
	}

	deleteScenario(scenario: Scenario) {
		const conf = confirm('¿Estás seguro de querer borrar el escenario "'+this.cs.urldecode(scenario.name)+'"?');
		if (conf) {
			this.as.deleteScenario(scenario.id).subscribe(result => {
				if (result.status=='ok') {
					this.loadScenarios();
				}
				else {
					alert('¡Ocurrio un error al borrar el escenario!');
					this.message = 'ERROR: Ocurrió un error al borrar el escenario.';
				}
			});
		}
	}
}