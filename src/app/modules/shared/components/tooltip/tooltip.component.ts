import { NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Item } from 'src/app/model/item.model';

@Component({
  standalone: true,
  selector: 'game-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [NgClass, NgStyle],
})
export class TooltipComponent {
  item: Item = null;
  showTooltip: boolean = false;
  positionX: number = null;
  positionY: number = null;

  load(item: Item): void {
    this.item = item;
    this.show(true);
  }

  show(mode: boolean): void {
    this.showTooltip = mode;
  }

  move(ev: MouseEvent): void {
    this.positionX = ev.clientX + 5;
    this.positionY = ev.clientY + 5;
  }
}
