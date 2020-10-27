import { ScenarioObjectInterface } from '../interfaces/interfaces';

export class ScenarioObject {
	constructor(
		public id = null,
		public name = null,
		public idAsset = null,
		public assetUrl = null,
		public width: number = null,
		public blockWidth: number = null,
		public height: number = null,
		public blockHeight: number = null,
		public crossable = false,
		public activable = false,
		public idAssetActive = null,
		public assetActiveUrl = null,
		public activeTime = null,
		public activeTrigger = null,
		public activeTriggerCustom = null,
		public pickable = false,
		public grabbable = false,
		public breakable = false,
		public drops = [],
		public frames = []
	) {}

	get allFrames() {
		const frameList = [];
		frameList.push(this.assetUrl);
		for (let frame of this.frames) {
			frameList.push(frame.assetUrl);
		}
		return frameList;
	}

	toInterface(): ScenarioObjectInterface {
		const scenarioObject: ScenarioObjectInterface = {
			id: this.id,
			name: this.name,
			idAsset: this.idAsset,
			assetUrl: this.assetUrl,
			width: this.width,
			blockWidth: this.blockWidth,
			height: this.height,
			blockHeight: this.blockHeight,
			crossable: this.crossable,
			activable: this.activable,
			idAssetActive: this.idAssetActive,
			assetActiveUrl: this.assetActiveUrl,
			activeTime: this.activeTime,
			activeTrigger: this.activeTrigger,
			activeTriggerCustom: this.activeTriggerCustom,
			pickable: this.pickable,
			grabbable: this.grabbable,
			breakable: this.breakable,
			drops: [],
			frames: []
		};
		for (let drop of this.drops) {
			scenarioObject.drops.push(drop.toInterface());
		}
		for (let frame of this.frames) {
			scenarioObject.frames.push(frame.toInterface());
		}
		return scenarioObject;
	}
}
