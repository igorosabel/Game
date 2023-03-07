import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'game-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent {
  @Input() leftUrl: string[] = [];
  @Input() leftTitle: string = null;
  @Input() img: string = null;
  @Input() title: string = 'The Game';
  @Input() rightUrl: string[] = [];
  @Input() rightTitle: string = null;
}
