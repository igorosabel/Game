import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { Inventory }        from '../../../model/inventory.model';

@Component({
	selector: 'game-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
	@ViewChild('tooltip', { static: true }) tooltip: TooltipComponent;
	@Input() inventoryList: Inventory[] = [];
	@Output() inventoryChange  = new EventEmitter<Inventory[]>();
	showInventory: boolean = false;
	@Output() onClose  = new EventEmitter<boolean>();

	constructor() {}
	ngOnInit(): void {}
	
	show() {
		this.showInventory = true;
	}

	close(ev: MouseEvent) {
		ev && ev.preventDefault();
		this.showInventory = false;
		this.onClose.emit(true);
	}
}