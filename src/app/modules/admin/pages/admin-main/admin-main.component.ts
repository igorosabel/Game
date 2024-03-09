import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';

@Component({
  standalone: true,
  selector: 'game-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['../scss/admin.scss'],
  imports: [RouterLink, HeaderComponent],
})
export default class AdminMainComponent {}
