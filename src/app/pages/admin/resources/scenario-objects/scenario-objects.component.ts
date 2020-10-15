import { Component, OnInit, ViewChild }  from '@angular/core';
import { ScenarioObject }                from '../../../../model/scenario-object.model';
import { ScenarioObjectFrame }           from '../../../../model/scenario-object-frame.model';
import { ScenarioObjectDrop }            from '../../../../model/scenario-object-drop.model';
import { ApiService }                    from '../../../../services/api.service';
import { CommonService }                 from '../../../../services/common.service';
import { ClassMapperService }            from '../../../../services/class-mapper.service';
import { AssetInterface, ItemInterface } from '../../../../interfaces/interfaces';
import { AssetPickerComponent }          from '../../../../components/asset-picker/asset-picker.component';
import { ItemPickerComponent }           from '../../../../components/item-picker/item-picker.component';

@Component({
	selector: 'game-scenario-objects',
	templateUrl: './scenario-objects.component.html',
	styleUrls: ['./scenario-objects.component.scss']
})
export class ScenarioObjectsComponent implements OnInit {
	filterListOption: string = 'items';
	scenarioObjectList: ScenarioObject[] = [];
	message: string = null;
	loadedScenarioObject: ScenarioObject = new ScenarioObject();
	showDetail: boolean = false;

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}

	ngOnInit(): void {
		this.loadScenarioObjects();
	}

	loadScenarioObjects() {
		this.as.getScenarioObjects().subscribe(result => {
			if (result.status=='ok') {
				this.scenarioObjectList = this.cms.getScenarioObjects(result.list);
			}
		});
	}

	changeFilterListOption(ev, option) {
		ev && ev.preventDefault();
		this.filterListOption = option;
	}

	showAddScenarioObject(ev) {
		ev && ev.preventDefault();
	}
}
