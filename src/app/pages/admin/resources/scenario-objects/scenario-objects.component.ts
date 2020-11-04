import { Component, OnInit, ViewChild }  from '@angular/core';
import { World }                         from '../../../../model/world.model';
import { Scenario }                      from '../../../../model/scenario.model';
import { ScenarioObject }                from '../../../../model/scenario-object.model';
import { ScenarioObjectFrame }           from '../../../../model/scenario-object-frame.model';
import { ScenarioObjectDrop }            from '../../../../model/scenario-object-drop.model';
import { ApiService }                    from '../../../../services/api.service';
import { CommonService }                 from '../../../../services/common.service';
import { ClassMapperService }            from '../../../../services/class-mapper.service';
import { PlayService }                   from '../../../../services/play.service';
import { AssetInterface, ItemInterface } from '../../../../interfaces/interfaces';
import { AssetPickerComponent }          from '../../../../components/asset-picker/asset-picker.component';
import { ItemPickerComponent }           from '../../../../components/item-picker/item-picker.component';

@Component({
	selector: 'game-scenario-objects',
	templateUrl: './scenario-objects.component.html',
	styleUrls: ['./scenario-objects.component.scss']
})
export class ScenarioObjectsComponent implements OnInit {
	worldList: World[] = [];
	scenarioList: Scenario[] = [];
	filterListOption: string = 'items';
	scenarioObjectList: ScenarioObject[] = [];
	message: string = null;
	loadedScenarioObject: ScenarioObject = new ScenarioObject();
	showDetail: boolean = false;
	detailtTab: string = 'data';
	scenarioObjectDetailHeader: string = '';
	activeTriggerTypes = [
		{ id: 0, name: 'Mensaje' },
		{ id: 1, name: 'Teleportación' },
		{ id: 2, name: 'Orden personalizada' },
		{ id: 3, name: 'Obtener item' }
	];
	activeTriggerWorld: number = null;
	animationImage: string = '';
	animationTimer: number = null;
	animationInd: number = -1;
	assetPickerWhere: string = null;
	savingScenarioObject: boolean = false;
	@ViewChild('assetPicker', { static: true }) assetPicker: AssetPickerComponent;
	@ViewChild('itemPicker', { static: true }) itemPicker: ItemPickerComponent;

	constructor(
		private as: ApiService,
		private cs: CommonService,
		private cms: ClassMapperService,
		private play: PlayService
	) {}

	ngOnInit(): void {
		this.loadWorlds();
		this.loadScenarioObjects();

		let esc = this.play.keyboard(27);
		esc.onlyEsc = true;
		esc.press = () => { this.showAddScenarioObject() };
	}

	loadWorlds() {
		this.as.getWorlds().subscribe(result => {
			if (result.status=='ok') {
				this.worldList = this.cms.getWorlds(result.list);
			}
		});
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

	resetLoadedScenarioObject() {
		clearInterval(this.animationTimer);
		this.loadedScenarioObject = new ScenarioObject();
		this.loadedScenarioObject.assetUrl = '/assets/admin/no-asset.svg';
		this.loadedScenarioObject.assetActiveUrl = '/assets/admin/no-asset.svg';
		this.animationImage = '/assets/admin/no-asset.svg';
		this.activeTriggerWorld = null;
		this.scenarioList = [];
	}

	showAddScenarioObject(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedScenarioObject();
			this.scenarioObjectDetailHeader = 'Nuevo objeto de escenario';
			this.detailtTab = 'data';

			this.showDetail = true;
		}
		else {
			this.showDetail = false;
			this.resetLoadedScenarioObject();
		}
	}

	changeTab(tab: string) {
		this.detailtTab = tab;
	}
	
	changeCrossable() {
		if (this.loadedScenarioObject.crossable) {
			this.loadedScenarioObject.blockWidth = 0;
			this.loadedScenarioObject.blockHeight = 0;
		}
	}

	openItemPicker() {
		if (this.loadedScenarioObject.pickable && this.loadedScenarioObject.drops.length==1) {
			alert('Si el objeto se puede obtener solo puedes añadir un item.');
			return;
		}
		this.itemPicker.showPicker();
	}

	selectedItem(selectedItem: ItemInterface) {
		const ind = this.loadedScenarioObject.drops.findIndex(x => x.idItem==selectedItem.id);
		if (ind==-1) {
			let drop = new ScenarioObjectDrop(
				null,
				selectedItem.id,
				selectedItem.name,
				selectedItem.assetUrl,
				1
			);
			this.loadedScenarioObject.drops.push(drop);
		}
		else {
			this.loadedScenarioObject.drops[ind].num++;
		}
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
				selectedAsset.url,
				this.loadedScenarioObject.frames.length
			);
			this.loadedScenarioObject.frames.push(frame);
		}
		if (this.assetPickerWhere=='main') {
			this.loadedScenarioObject.idAsset = selectedAsset.id;
			this.loadedScenarioObject.assetUrl = selectedAsset.url;
		}
		if (this.assetPickerWhere=='active') {
			this.loadedScenarioObject.idAssetActive = selectedAsset.id;
			this.loadedScenarioObject.assetActiveUrl = selectedAsset.url;
		}
		this.startAnimation();
	}

	updatePickable() {
		if (this.loadedScenarioObject.pickable) {
			this.loadedScenarioObject.activable = false;
			this.loadedScenarioObject.activeTime = null;
			this.loadedScenarioObject.activeTrigger = null;
			this.loadedScenarioObject.activeTriggerCustom = null;
			this.loadedScenarioObject.idAssetActive = null;
			this.loadedScenarioObject.assetActiveUrl = '/assets/admin/no-asset.svg';
			this.loadedScenarioObject.crossable = false;
			this.loadedScenarioObject.grabbable = false;
			this.loadedScenarioObject.breakable = false;
			this.loadedScenarioObject.drops = [];
		}
	}

	loadSelectedWorldScenarios() {
		if (this.activeTriggerWorld!=null) {
			this.as.getScenarios(this.activeTriggerWorld).subscribe(result => {
				this.scenarioList = this.cms.getScenarios(result.list);
			});
		}
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

	frameDelete(frame: ScenarioObjectFrame) {
		const conf = confirm('¿Estás seguro de querer borrar este frame?');
		if (conf) {
			const ind = this.loadedScenarioObject.frames.findIndex(x => (x.id+x.idAsset.toString())==(frame.id+frame.idAsset.toString()));
			this.loadedScenarioObject.frames.splice(ind, 1);
			this.updateFrameOrders();
		}
	}

	frameLeft(frame: ScenarioObjectFrame) {
		const ind = this.loadedScenarioObject.frames.findIndex(x => (x.id+x.idAsset.toString())==(frame.id+frame.idAsset.toString()));
		if (ind==0) {
			return;
		}
		const aux = this.loadedScenarioObject.frames[ind];
		this.loadedScenarioObject.frames[ind] = this.loadedScenarioObject.frames[ind -1];
		this.loadedScenarioObject.frames[ind -1] = aux;
		this.updateFrameOrders();
	}

	frameRight(frame: ScenarioObjectFrame) {
		const ind = this.loadedScenarioObject.frames.findIndex(x => (x.id+x.idAsset.toString())==(frame.id+frame.idAsset.toString()));
		if (ind==(this.loadedScenarioObject.frames.length-1)) {
			return;
		}
		const aux = this.loadedScenarioObject.frames[ind];
		this.loadedScenarioObject.frames[ind] = this.loadedScenarioObject.frames[ind +1];
		this.loadedScenarioObject.frames[ind +1] = aux;
		this.updateFrameOrders();
	}

	updateFrameOrders() {
		for (let frameOrder in this.loadedScenarioObject.frames) {
			this.loadedScenarioObject.frames[frameOrder].order = parseInt(frameOrder);
		}
	}

	deleteDrop(ev, drop: ScenarioObjectDrop) {
		ev && ev.preventDefault();
		const conf = confirm('¿Estás seguro de querer borrar el item "' + drop.itemName + '"?');
		if (conf) {
			const ind = this.loadedScenarioObject.drops.findIndex(x => (x.id+x.idItem.toString())==(drop.id+drop.idItem.toString()));
			this.loadedScenarioObject.drops.splice(ind, 1);
		}
	}

	saveScenarioObject() {
		let validate = true;

		if (this.loadedScenarioObject.name==null) {
			alert('¡No puedes dejar el nombre del objeto en blanco!');
			validate = false;
		}

		if (validate && this.loadedScenarioObject.width==null) {
			alert('¡No puedes dejar la anchura del objeto en blanco!');
			validate = false;
		}

		if (validate && this.loadedScenarioObject.height==null) {
			alert('¡No puedes dejar la altura del objeto en blanco!');
			validate = false;
		}

		if (validate && this.loadedScenarioObject.blockWidth==null) {
			alert('¡No puedes dejar la anchura que bloquea en blanco!');
			validate = false;
		}

		if (validate && this.loadedScenarioObject.blockHeight==null) {
			alert('¡No puedes dejar la altura que bloquea en blanco!');
			validate = false;
		}

		if (validate && this.loadedScenarioObject.activable) {
			if (this.loadedScenarioObject.idAssetActive==null) {
				alert('Has marcado que el objeto se puede activar, pero no has elegido ninguna imagen para su estado activo.');
				validate = false;
			}

			if (validate && this.loadedScenarioObject.activeTime==null) {
				alert('Has marcado que el objeto se puede activar, pero no has marcado el tiempo que se mantiene activado. Introduce 0 para indefinido.');
				validate = false;
			}

			if (validate && this.loadedScenarioObject.activeTrigger==null) {
				alert('Has marcado que el objeto se puede activar, pero no has elegido el tipo de activador.');
				validate = false;
			}

			if (validate && this.loadedScenarioObject.activeTrigger!=null) {
				if (this.loadedScenarioObject.activeTrigger==0 && this.loadedScenarioObject.activeTriggerCustom==null) {
					alert('Has elegido mensaje como tipo de activador, pero no has introducido ningún mensaje.');
					validate = false;
				}

				if (validate && this.loadedScenarioObject.activeTrigger==1 && this.loadedScenarioObject.activeTriggerCustom==null) {
					validate = confirm('Has elegido teleportación como tipo de activador, pero no has elegido ningún escenario. ¿Quieres continuar? En caso de hacerlo el objeto se comportará como un portal.');
				}

				if (this.loadedScenarioObject.activeTrigger==2 && this.loadedScenarioObject.activeTriggerCustom==null) {
					alert('Has elegido orden personalida como tipo de activador, pero no has introducido ninguna orden.');
					validate = false;
				}

				if (this.loadedScenarioObject.activeTrigger==3 && this.loadedScenarioObject.drops.length==0) {
					alert('Has elegido obtener items como tipo de activador, pero no has elegido ningún item.');
					validate = false;
				}
			}
		}

		if (validate && this.loadedScenarioObject.idAsset==null) {
			alert('¡No has elegido ninguna imagen para el ojeto!');
			validate = false;
		}

		if (validate && this.loadedScenarioObject.drops.length>0) {
			for (let drop of this.loadedScenarioObject.drops) {
				if (drop.num==null) {
					alert('¡No puedes dejar en blanco el número de unidades para el item "' + drop.name + '"!');
					validate = false;
					break;
				}
			}
		}

		if (validate) {
			this.savingScenarioObject = true;
			this.as.saveScenarioObject(this.loadedScenarioObject.toInterface()).subscribe(result => {
				this.savingScenarioObject = false;
				if (result.status=='ok') {
					this.showAddScenarioObject();
					this.loadScenarioObjects();
					this.itemPicker.resetSelected();
					this.assetPicker.resetSelected();
				}
				else {
					alert('¡Ocurrió un error al guardar el objeto de escenario!');
					this.message = 'ERROR: Ocurrió un error al guardar el objeto de escenario.';
				}
			});
		}
	}

	editScenarioObject(scenarioObject: ScenarioObject) {
		this.loadedScenarioObject = new ScenarioObject(
			scenarioObject.id,
			scenarioObject.name,
			scenarioObject.idAsset,
			scenarioObject.assetUrl,
			scenarioObject.width,
			scenarioObject.blockWidth,
			scenarioObject.height,
			scenarioObject.blockHeight,
			scenarioObject.crossable,
			scenarioObject.activable,
			scenarioObject.idAssetActive,
			(scenarioObject.assetActiveUrl!=null) ? scenarioObject.assetActiveUrl : null,
			scenarioObject.activeTime,
			scenarioObject.activeTrigger,
			(scenarioObject.activeTriggerCustom!=null) ? scenarioObject.activeTriggerCustom : null,
			scenarioObject.pickable,
			scenarioObject.grabbable,
			scenarioObject.breakable,
			[],
			[]
		);
		for (let frame of scenarioObject.frames) {
			frame.assetUrl = frame.assetUrl;
			this.loadedScenarioObject.frames.push(frame);
		}
		for (let drop of scenarioObject.drops) {
			drop.assetUrl = drop.assetUrl;
			drop.itemName = drop.itemName;
			this.loadedScenarioObject.drops.push(drop);
		}

		this.animationImage = (this.loadedScenarioObject.assetUrl!=null) ? this.loadedScenarioObject.assetUrl : '/assets/admin/no-asset.svg';
		this.animationInd = -1;
		clearInterval(this.animationTimer);
		this.animationTimer = null;

		this.assetPickerWhere = null;
		this.changeTab('data');
		this.startAnimation();

		this.scenarioObjectDetailHeader = 'Editar objeto de escenario';
		this.showDetail = true;
	}

	deleteScenarioObject(scenarioObject: ScenarioObject) {
		const conf = confirm('¿Estás seguro de querer borrar el objeto "'+scenarioObject.name+'"?');
		if (conf) {
			this.as.deleteScenarioObject(scenarioObject.id).subscribe(result => {
				if (result.status=='ok') {
					this.loadScenarioObjects();
				}
				if (result.status=='in-use') {
					alert("El objeto de escenario está siendo usado. Cámbialo o bórralo antes de poder borrarlo.\n\n"+this.cs.urldecode(result.message));
				}
				if (status=='error') {
					alert('¡Ocurrio un error al borrar el objeto de escenario!');
					this.message = 'ERROR: Ocurrió un error al borrar el objeto de escenario.';
				}
			});
		}
	}
}
