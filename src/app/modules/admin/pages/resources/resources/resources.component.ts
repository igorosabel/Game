import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';

@Component({
  standalone: true,
  selector: 'game-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['../../scss/admin.scss'],
  imports: [RouterModule, HeaderComponent],
})
export default class ResourcesComponent {}
