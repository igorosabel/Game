import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ApiService }                    from '../../../../services/api.service';
import { CommonService }                 from '../../../../services/common.service';
import { ClassMapperService }            from '../../../../services/class-mapper.service';

@Component({
	selector: 'game-edit-scenario',
	templateUrl: './edit-scenario.component.html',
	styleUrls: ['./edit-scenario.component.scss']
})
export class EditScenarioComponent implements OnInit {
	worldId: number = null;
	scenarioId: number = null;

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
			console.log(result);
		});
	}
}