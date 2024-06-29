import { NgClass, NgStyle } from '@angular/common';
import { Component, WritableSignal, signal } from '@angular/core';
import Item from '@model/item.model';

@Component({
  standalone: true,
  selector: 'game-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [NgClass, NgStyle],
})
export default class TooltipComponent {
  item: WritableSignal<Item> = signal<Item>(null);
  showTooltip: WritableSignal<boolean> = signal<boolean>(false);
  positionX: WritableSignal<number> = signal<number>(null);
  positionY: WritableSignal<number> = signal<number>(null);

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
