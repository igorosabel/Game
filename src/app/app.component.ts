import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'game-root',
  template: `<router-outlet />`,
  imports: [RouterModule],
})
export default class AppComponent {}
