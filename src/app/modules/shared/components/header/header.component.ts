import { Component, InputSignal, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'game-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink],
})
export default class HeaderComponent {
  leftUrl: InputSignal<string[]> = input<string[]>([]);
  leftTitle: InputSignal<string> = input<string>(null);
  img: InputSignal<string> = input<string>(null);
  title: InputSignal<string> = input<string>('The Game');
  rightUrl: InputSignal<string[]> = input<string[]>([]);
  rightTitle: InputSignal<string> = input<string>(null);
}
