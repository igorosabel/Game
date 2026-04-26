import { Component, WritableSignal, signal } from '@angular/core';
import Item from '@model/item.model';

@Component({
  selector: 'game-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [],
})
export default class TooltipComponent {
  item: WritableSignal<Item | null> = signal<Item | null>(null);
  showTooltip: WritableSignal<boolean> = signal<boolean>(false);
  positionX: WritableSignal<number | null> = signal<number | null>(null);
  positionY: WritableSignal<number | null> = signal<number | null>(null);

  load(item: Item): void {
    this.item.set(item);
    this.show(true);
  }

  show(mode: boolean): void {
    this.showTooltip.set(mode);
  }

  move(ev: MouseEvent): void {
    this.positionX.set(ev.clientX + 5);
    this.positionY.set(ev.clientY + 5);
  }
}
