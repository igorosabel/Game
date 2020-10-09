import { Component, OnInit } from '@angular/core';
import { BackgroundCategory } from '../../../../model/background-category.model';
import { Background } from '../../../../model/background.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ClassMapperService } from '../../../../services/class-mapper.service';

@Component({
	selector: 'game-backgrounds',
	templateUrl: './backgrounds.component.html',
	styleUrls: ['./backgrounds.component.scss']
})
export class BackgroundsComponent implements OnInit {
	backgroundCategoryFilter: number = null;
	backgroundCategoryList: BackgroundCategory[] = [];
	backgroundList: Background[] = [];
	backgroundListFiltered: Background[] = [];
	message: string = null;
	loadedBackground: Background = new Background();
	showDetail: boolean = false;
	backgroundDetailHeader: string = '';
	savingBackground: boolean = false;

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}

	ngOnInit(): void {
		this.loadBackgroundCategories();
		this.loadBackgrounds();
	}

	loadBackgroundCategories() {
		this.as.getBackgroundCategories().subscribe(result => {
			if (result.status=='ok') {
				this.backgroundCategoryList = this.cms.getBackgroundCategories(result.list);
			}
		});
	}

	loadBackgrounds() {
		this.as.getBackgrounds().subscribe(result => {
			if (result.status=='ok') {
				this.backgroundList = this.cms.getBackgrounds(result.list);
				this.updateFilteredList();
			}
		});
	}
	
	updateFilteredList() {
		let filteredList = [];
		if (this.backgroundCategoryFilter===null) {
			filteredList = this.backgroundList;
		}
		else {
			filteredList = this.backgroundList.filter(x => x.idBackgroundCategory===this.backgroundCategoryFilter);
		}
		this.backgroundListFiltered = filteredList;
	}
	
	resetLoadedBackground() {
		this.loadedBackground = new Background();
	}

	showAddBackground(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedBackground();
			this.backgroundDetailHeader = 'Nuevo fondo';

			this.showDetail = true;
		}
		else {
			this.showDetail = false;
		}
	}
}