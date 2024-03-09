import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  ModelSignal,
  Output,
  ViewChild,
  WritableSignal,
  model,
  signal,
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
  inventoryList: ModelSignal<Inventory[]> = model.required<Inventory[]>();
  equipment: ModelSignal<Equipment> = model.required<Equipment>();
  player: ModelSignal<PlayPlayer> = model.required<PlayPlayer>();

  showInventory: WritableSignal<boolean> = signal<boolean>(false);
  @Output() closed: EventEmitter<boolean> = new EventEmitter<boolean>();

  show(): void {
    this.showInventory.set(true);
  }

  close(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    this.showInventory.set(false);
    this.closed.emit(true);
  }

  isOpened(): boolean {
    return this.showInventory();
  }
}
