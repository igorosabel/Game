import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Background }                              from '../../model/background.model';
import { BackgroundCategory }                      from '../../model/background-category.model';
import { ApiService }                              from '../../services/api.service';
import { CommonService }                           from '../../services/common.service';
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
	backgroundList: Background[] = [];
	backgroundListFiltered: Background[] = [];
	selected: number = null;
	
	@Output() selectBackgroundEvent = new EventEmitter<BackgroundInterface>();

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}
	ngOnInit(): void {}
}