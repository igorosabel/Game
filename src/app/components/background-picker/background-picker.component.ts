import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Background }                              from '../../model/background.model';
import { BackgroundCategory }                      from '../../model/background-category.model';
import { ApiService }                              from '../../services/api.service';
import { ClassMapperService }                      from '../../services/class-mapper.service';
import { BackgroundInterface }                     from '../../interfaces/interfaces';

@Component({
	selector: 'game-background-picker',
	templateUrl: './background-picker.component.html',
	styleUrls: ['./background-picker.component.scss']
})
export class BackgroundPickerComponent implements OnInit {
	show: boolean = false;
	backgroundFilter: number = null;
	backgroundCategoryList: BackgroundCategory[] = [];
	backgroundList: Background[] = [];
	backgroundListFiltered: Background[] = [];
	selected: number = null;

	@Output() selectBackgroundEvent = new EventEmitter<BackgroundInterface>();

	constructor(private as: ApiService, private cms: ClassMapperService) {}
	ngOnInit(): void {
		this.loadBackgroundCategories();
		this.loadBackgrounds();
	}

	showPicker() {
		this.show = true;
	}

	closePicker(ev) {
		ev && ev.preventDefault();
		this.show = false;
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
		if (this.backgroundFilter===null) {
			filteredList = this.backgroundList;
		}
		else {
			filteredList = this.backgroundList.filter(x => x.idBackgroundCategory===this.backgroundFilter);
		}
		this.backgroundListFiltered = filteredList;
	}

	selectBackground(background: Background) {
		this.selected = background.id;
		const selectedBackground = background.toInterface();
		this.show = false;
		this.selectBackgroundEvent.emit(selectedBackground);
	}

	resetSelected() {
		this.backgroundFilter = null;
		this.selected = null;
		this.updateFilteredList();
	}

	getBackgroundById(id: number) {
		const backgroundFind = this.backgroundList.filter(x => x.id===id);
		if (backgroundFind.length==0) {
			return null;
		}
		else {
			return backgroundFind[0].toInterface();
		}
	}
}