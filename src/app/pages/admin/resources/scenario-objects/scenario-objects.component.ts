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
	detailtTab: string = 'data';
	scenarioObjectDetailHeader: string = '';
	animationImage: string = '';
	animationTimer: number = null;
	animationInd: number = -1;
	assetPickerWhere: string = null;
	@ViewChild('assetPicker', { static: true }) assetPicker: AssetPickerComponent;
	@ViewChild('itemPicker', { static: true }) itemPicker: ItemPickerComponent;

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
	
	changeTab(tab: string) {
		this.detailtTab = tab;
	}

	openItemPicker() {
		this.itemPicker.showPicker();
	}

	selectedItem(selectedItem: ItemInterface) {
		let drop = new ScenarioObjectDrop(
			null,
			selectedItem.id,
			this.cs.urldecode(selectedItem.assetUrl),
			1
		);
		this.loadedScenarioObject.drops.push(drop);
	}

	openAssetPicker(where: string) {
		if (where=='frames' && this.loadedScenarioObject.idAsset==null) {
			alert('Antes de añadir un frame tienes que elegir una imagen principal.');
			return;
		}
		this.assetPickerWhere = where;
		this.assetPicker.showPicker();
	}

	selectedAsset(selectedAsset: AssetInterface) {
		if (this.assetPickerWhere=='frames') {
			let frame = new ScenarioObjectFrame(
				null,
				selectedAsset.id,
				this.cs.urldecode(selectedAsset.url),
				this.loadedScenarioObject.frames.length
			);
			this.loadedScenarioObject.frames.push(frame);
		}
		if (this.assetPickerWhere=='main') {
			this.loadedScenarioObject.idAsset = selectedAsset.id;
			this.loadedScenarioObject.assetUrl = this.cs.urldecode(selectedAsset.url);
		}
		if (this.assetPickerWhere=='active') {
			this.loadedScenarioObject.idAssetActive = selectedAsset.id;
			this.loadedScenarioObject.assetActiveUrl = this.cs.urldecode(selectedAsset.url);
		}
		this.startAnimation();
	}

	startAnimation() {
		clearInterval(this.animationTimer);

		if (this.loadedScenarioObject.allFrames.length>1) {
			this.animationTimer = setInterval(() => { this.animatePreview() }, 300);
		}
		else {
			this.animationImage = this.loadedScenarioObject.assetUrl;
		}
	}
	
	animatePreview() {
		this.animationInd++;
		if (this.animationInd >= this.loadedScenarioObject.allFrames.length) {
			this.animationInd = 0;
		}
		this.animationImage = this.loadedScenarioObject.allFrames[this.animationInd];
	}
}