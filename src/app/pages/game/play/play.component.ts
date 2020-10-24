import { Component, OnInit }  from '@angular/core';
import { AssetCache }         from '../../../play/asset-cache.class';
import { ApiService }         from '../../../services/api.service';
import { CommonService }      from '../../../services/common.service';
import { DataShareService }   from '../../../services/data-share.service';
import { ClassMapperService } from '../../../services/class-mapper.service';

@Component({
	selector: 'game-play',
	templateUrl: './play.component.html',
	styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
	gameId: number = null;
	assetCache: AssetCache = new AssetCache();

	scenario = null;
	player = null;
	hud = null;
	defaultVX: number = 3;
	defaultVY: number = 3;
	fps: number = 30;
	start: number = 0;
	frameDuration: number = null;

	constructor(private as: ApiService, private cms: ClassMapperService, private cs: CommonService, private dss: DataShareService) {}
	ngOnInit(): void {
		this.frameDuration = 1000 / this.fps;
		this.getPlayData();
	}

	getPlayData() {
		this.gameId = this.dss.getGlobal('idGame');
		this.as.getPlayData(this.gameId).subscribe(result => {
			console.log(result);
			this.assetCache.addScenarioObjects(this.cms.getScenarioObjects(result.scenarioObjects));
			this.assetCache.addCharacters(this.cms.getCharacters(result.characters));
			this.assetCache.load().then(() => this.setup());
		});
	}

	setup() {
		console.log(this.assetCache);
	}
}
