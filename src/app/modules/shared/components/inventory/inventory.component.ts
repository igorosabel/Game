import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  Component,
  ModelSignal,
  OutputEmitterRef,
  ViewContainerRef,
  WritableSignal,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import Equipment from '@model/equipment.model';
import Inventory from '@model/inventory.model';
import PlayPlayer from '@play/play-player.class';
import TooltipComponent from '@shared/components/tooltip/tooltip.component';

@Component({
  selector: 'game-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  imports: [DragDropModule],
})
export default class InventoryComponent {
  private viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  tooltip: TooltipComponent = this.viewContainerRef.createComponent(TooltipComponent).instance;

  inventoryList: ModelSignal<Inventory[]> = model.required<Inventory[]>();
  equipment: ModelSignal<Equipment | null> = model.required<Equipment | null>();
  player: ModelSignal<PlayPlayer | null> = model.required<PlayPlayer | null>();

  showInventory: WritableSignal<boolean> = signal<boolean>(false);
  closed: OutputEmitterRef<boolean> = output<boolean>();

  show(): void {
    this.showInventory.set(true);
  }

  close(ev: MouseEvent | null = null): void {
    if (ev) {
      ev.preventDefault();
    }
    this.showInventory.set(false);
    this.closed.emit(true);
  }

  isOpened(): boolean {
    return this.showInventory();
  }
}
