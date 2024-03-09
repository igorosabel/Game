import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Equipment } from 'src/app/model/equipment.model';
import { Inventory } from 'src/app/model/inventory.model';
import { TooltipComponent } from 'src/app/modules/shared/components/tooltip/tooltip.component';
import { PlayPlayer } from 'src/app/play/play-player.class';

@Component({
  standalone: true,
  selector: 'game-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  imports: [NgClass, DragDropModule],
})
export class InventoryComponent {
  @ViewChild('tooltip', { static: true }) tooltip: TooltipComponent;
  @Input() inventoryList: Inventory[] = [];
  @Output() inventoryListChange: EventEmitter<Inventory[]> = new EventEmitter<
    Inventory[]
  >();
  @Input() equipment: Equipment = new Equipment();
  @Output() equipmentChange: EventEmitter<Equipment> =
    new EventEmitter<Equipment>();
  @Input() player: PlayPlayer = null;
  @Output() playerChange: EventEmitter<PlayPlayer> =
    new EventEmitter<PlayPlayer>();

  showInventory: boolean = false;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  show(): void {
    this.showInventory = true;
  }

  close(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.showInventory = false;
    this.onClose.emit(true);
  }

  isOpened(): boolean {
    return this.showInventory;
  }
}
