import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'game-root',
  standalone: true,
  template: `<router-outlet />`,
  imports: [RouterModule],
})
export class AppComponent {}
