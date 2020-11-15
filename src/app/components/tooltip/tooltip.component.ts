import { Component, OnInit } from '@angular/core';
import { Item } from '../../model/item.model';

@Component({
	selector: 'game-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
	item: Item = null;
	showTooltip: boolean = false;
	positionX: number = null;
	positionY: number = null;

	constructor() {}
	ngOnInit(): void {}
	
	load(item: Item) {
		this.item = null;
	}
	
	show(mode: boolean) {
		this.showTooltip = mode;
	}
}