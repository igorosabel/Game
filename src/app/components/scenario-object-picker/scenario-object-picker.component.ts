import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ScenarioObject }                          from '../../model/scenario-object.model';
import { ApiService }                              from '../../services/api.service';
import { ClassMapperService }                      from '../../services/class-mapper.service';
import { ScenarioObjectInterface }                 from '../../interfaces/interfaces';

@Component({
	selector: 'game-scenario-object-picker',
	templateUrl: './scenario-object-picker.component.html',
	styleUrls: ['./scenario-object-picker.component.scss']
})
export class ScenarioObjectPickerComponent implements OnInit {
	show: boolean = false;
	scenarioObjectList: ScenarioObject[] = [];
	selected: number = null;

	@Output() selectScenarioObjectEvent = new EventEmitter<ScenarioObjectInterface>();

	constructor(private as: ApiService, private cms: ClassMapperService) {}
	ngOnInit(): void {
		this.loadScenarioObjects();
	}

	showPicker() {
		this.show = true;
	}

	closePicker(ev: MouseEvent) {
		ev && ev.preventDefault();
		this.show = false;
	}

	loadScenarioObjects() {
		this.as.getScenarioObjects().subscribe(result => {
			if (result.status=='ok') {
				this.scenarioObjectList = this.cms.getScenarioObjects(result.list);
			}
		});
	}

	selectScenarioObject(scenarioObject: ScenarioObject) {
		this.selected = scenarioObject.id;
		const selectedScenarioObject = scenarioObject.toInterface();
		this.show = false;
		this.selectScenarioObjectEvent.emit(selectedScenarioObject);
	}

	resetSelected() {
		this.selected = null;
	}

	getScenarioObjectById(id: number) {
		const scenarioObjectFind = this.scenarioObjectList.filter(x => x.id===id);
		if (scenarioObjectFind.length==0) {
			return null;
		}
		else {
			return scenarioObjectFind[0].toInterface();
		}
	}
}
