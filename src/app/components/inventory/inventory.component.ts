import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TooltipComponent } from '../../components/tooltip/tooltip.component';
import { Inventory }        from '../../model/inventory.model';
import { Equipment }        from '../../model/equipment.model';
import { PlayPlayer }       from '../../play/play-player.class';

@Component({
	selector: 'game-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
	@ViewChild('tooltip', { static: true }) tooltip: TooltipComponent;
	@Input() inventoryList: Inventory[] = [];
	@Output() inventoryChange  = new EventEmitter<Inventory[]>();
	@Input() equipment: Equipment = new Equipment();
	@Output() equipmentChange  = new EventEmitter<Equipment>();
	@Input() player: PlayPlayer = null;
	@Output() playerChange  = new EventEmitter<PlayPlayer>();

	showInventory: boolean = false;
	@Output() onClose  = new EventEmitter<boolean>();

	constructor() {}
	ngOnInit(): void {}

	show() {
		this.showInventory = true;
	}

	close(ev: MouseEvent = null) {
		ev && ev.preventDefault();
		this.showInventory = false;
		this.onClose.emit(true);
	}

	isOpened(): boolean {
		return this.showInventory;
	}
}
