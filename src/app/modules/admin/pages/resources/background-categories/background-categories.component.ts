import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackgroundCategoryResult } from 'src/app/interfaces/background.interfaces';
import {
  StatusMessageResult,
  StatusResult,
} from 'src/app/interfaces/interfaces';
import { BackgroundCategory } from 'src/app/model/background-category.model';
import { Key } from 'src/app/model/key.model';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';
import { Utils } from 'src/app/modules/shared/utils.class';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { PlayService } from 'src/app/services/play.service';

@Component({
  standalone: true,
  selector: 'game-background-categories',
  templateUrl: './background-categories.component.html',
  styleUrls: ['../../scss/admin.scss'],
  imports: [NgClass, FormsModule, HeaderComponent],
})
export default class BackgroundCategoriesComponent implements OnInit {
  backgroundCategoryList: BackgroundCategory[] = [];
  message: string = null;
  loadedBackgroundCategory: BackgroundCategory = new BackgroundCategory();
  showDetail: boolean = false;
  backgroundCategoryDetailHeader: string = '';

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    private play: PlayService
  ) {}

  ngOnInit(): void {
    this.message = 'Cargando...';
    this.loadBackgroundCategories();

    const esc: Key = this.play.keyboard('Escape');
    esc.onlyEsc = true;
    esc.press = (): void => {
      this.showAddBackgroundCategory();
    };
  }

  loadBackgroundCategories(): void {
    this.message = 'Cargando...';
    this.as
      .getBackgroundCategories()
      .subscribe((result: BackgroundCategoryResult): void => {
        if (result.status == 'ok') {
          this.message = null;
          this.backgroundCategoryList = this.cms.getBackgroundCategories(
            result.list
          );
        } else {
          this.message =
            'ERROR: Ocurrió un error al obtener la lista de categorías de fondos.';
        }
      });
  }

  resetLoadedBackgroundCategory(): void {
    this.loadedBackgroundCategory = new BackgroundCategory();
  }

  showAddBackgroundCategory(ev = null): void {
    ev && ev.preventDefault();
    if (!this.showDetail) {
      this.resetLoadedBackgroundCategory();
      this.backgroundCategoryDetailHeader = 'Nueva categoría de fondo';

      this.showDetail = true;
    } else {
      this.showDetail = false;
    }
  }

  saveBackgroundCategory(): void {
    let validate: boolean = true;
    if (this.loadedBackgroundCategory.name == '') {
      validate = false;
      alert('¡No puedes dejar el nombre de la categoría de fondo en blanco!');
    }

    if (validate) {
      this.as
        .saveBackgroundCategory(this.loadedBackgroundCategory.toInterface())
        .subscribe((result: StatusResult): void => {
          if (result.status == 'ok') {
            this.showAddBackgroundCategory();
            this.loadBackgroundCategories();
          } else {
            alert('¡Ocurrió un error al guardar la categoría de fondo!');
            this.message =
              'ERROR: Ocurrió un error al guardar la categoría de fondo.';
          }
        });
    }
  }

  editBackgroundCategory(backgroundCategory: BackgroundCategory): void {
    this.loadedBackgroundCategory = new BackgroundCategory(
      backgroundCategory.id,
      backgroundCategory.name
    );

    this.backgroundCategoryDetailHeader = 'Editar categoría de fondo';
    this.showDetail = true;
  }

  deleteBackgroundCategory(backgroundCategory: BackgroundCategory): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar la categoría de fondo "' +
        backgroundCategory.name +
        '"?'
    );
    if (conf) {
      this.as
        .deleteBackgroundCategory(backgroundCategory.id)
        .subscribe((result: StatusMessageResult): void => {
          if (result.status == 'ok') {
            this.loadBackgroundCategories();
          }
          if (result.status == 'in-use') {
            alert(
              '¡Atención! La categoría está asignada a algún fondo. Cambia la categoría a esos fondos antes de borrarla\n\n' +
                Utils.urldecode(result.message)
            );
          }
          if (result.status == 'error') {
            alert('¡Ocurrio un error al borrar la categoría de fondo!');
            this.message =
              'ERROR: Ocurrió un error al borrar la categoría de fondo.';
          }
        });
    }
  }
}
