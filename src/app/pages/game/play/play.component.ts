import { Component, OnInit }  from '@angular/core';
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

	constructor(private as: ApiService, private cms: ClassMapperService, private cs: CommonService, private dss: DataShareService) {}
	ngOnInit(): void {
		this.getPlayData();
	}

	getPlayData() {
		this.gameId = this.dss.getGlobal('idGame');
		this.as.getPlayData(this.gameId).subscribe(result => {
			console.log(result);
		});
	}
}
