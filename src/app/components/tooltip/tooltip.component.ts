import { Component } from '@angular/core';
import { Item }      from '../../model/item.model';

@Component({
	selector: 'game-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
	item: Item = null;
	showTooltip: boolean = false;
	positionX: number = null;
	positionY: number = null;

	constructor() {}

	load(item: Item) {
		this.item = item;
		this.show(true);
	}

	show(mode: boolean) {
		this.showTooltip = mode;
	}

	move(ev: MouseEvent) {
		this.positionX = ev.clientX + 5;
		this.positionY = ev.clientY + 5;
	}
}
