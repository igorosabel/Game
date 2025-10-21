import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackgroundCategoryResult } from '@interfaces/background.interfaces';
import { StatusMessageResult, StatusResult } from '@interfaces/interfaces';
import BackgroundCategory from '@model/background-category.model';
import Key from '@model/key.model';
import { urldecode } from '@osumi/tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import PlayService from '@services/play.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'game-background-categories',
  templateUrl: './background-categories.component.html',
  styleUrls: ['../../scss/admin.scss'],
  imports: [FormsModule, HeaderComponent],
})
export default class BackgroundCategoriesComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private play: PlayService = inject(PlayService);

  backgroundCategoryList: WritableSignal<BackgroundCategory[]> = signal<
    BackgroundCategory[]
  >([]);
  message: WritableSignal<string> = signal<string>(null);
  loadedBackgroundCategory: BackgroundCategory = new BackgroundCategory();
  showDetail: WritableSignal<boolean> = signal<boolean>(false);
  backgroundCategoryDetailHeader: WritableSignal<string> = signal<string>('');

  ngOnInit(): void {
    this.message.set('Cargando...');
    this.loadBackgroundCategories();

    const esc: Key = this.play.keyboard('Escape');
    esc.onlyEsc = true;
    esc.press = (): void => {
      this.showAddBackgroundCategory();
    };
  }

  loadBackgroundCategories(): void {
    this.message.set('Cargando...');
    this.as.getBackgroundCategories().subscribe({
      next: (result: BackgroundCategoryResult): void => {
        if (result.status === 'ok') {
          this.message.set(null);
          this.backgroundCategoryList.set(
            this.cms.getBackgroundCategories(result.list)
          );
        } else {
          this.message.set(
            'ERROR: Ocurrió un error al obtener la lista de categorías de fondos.'
          );
        }
      },
      error: (): void => {
        this.message.set(
          'ERROR: Ocurrió un error al obtener la lista de categorías de fondos.'
        );
      },
    });
  }

  resetLoadedBackgroundCategory(): void {
    this.loadedBackgroundCategory = new BackgroundCategory();
  }

  showAddBackgroundCategory(ev = null): void {
    if (ev) {
      ev.preventDefault();
    }
    if (!this.showDetail()) {
      this.resetLoadedBackgroundCategory();
      this.backgroundCategoryDetailHeader.set('Nueva categoría de fondo');

      this.showDetail.set(true);
    } else {
      this.showDetail.set(false);
    }
  }

  saveBackgroundCategory(): void {
    let validate: boolean = true;
    if (
      this.loadedBackgroundCategory.name === null ||
      this.loadedBackgroundCategory.name === ''
    ) {
      validate = false;
      alert('¡No puedes dejar el nombre de la categoría de fondo en blanco!');
    }

    if (validate) {
      this.as
        .saveBackgroundCategory(this.loadedBackgroundCategory.toInterface())
        .subscribe({
          next: (result: StatusResult): void => {
            if (result.status == 'ok') {
              this.showAddBackgroundCategory();
              this.loadBackgroundCategories();
            } else {
              alert('¡Ocurrió un error al guardar la categoría de fondo!');
              this.message.set(
                'ERROR: Ocurrió un error al guardar la categoría de fondo.'
              );
            }
          },
          error: (): void => {
            alert('¡Ocurrió un error al guardar la categoría de fondo!');
            this.message.set(
              'ERROR: Ocurrió un error al guardar la categoría de fondo.'
            );
          },
        });
    }
  }

  editBackgroundCategory(backgroundCategory: BackgroundCategory): void {
    this.loadedBackgroundCategory = new BackgroundCategory(
      backgroundCategory.id,
      backgroundCategory.name
    );

    this.backgroundCategoryDetailHeader.set('Editar categoría de fondo');
    this.showDetail.set(true);
  }

  deleteBackgroundCategory(backgroundCategory: BackgroundCategory): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar la categoría de fondo "' +
        backgroundCategory.name +
        '"?'
    );
    if (conf) {
      this.as.deleteBackgroundCategory(backgroundCategory.id).subscribe({
        next: (result: StatusMessageResult): void => {
          if (result.status === 'ok') {
            this.loadBackgroundCategories();
          }
          if (result.status === 'in-use') {
            alert(
              '¡Atención! La categoría está asignada a algún fondo. Cambia la categoría a esos fondos antes de borrarla\n\n' +
                urldecode(result.message)
            );
          }
          if (result.status === 'error') {
            alert('¡Ocurrio un error al borrar la categoría de fondo!');
            this.message.set(
              'ERROR: Ocurrió un error al borrar la categoría de fondo.'
            );
          }
        },
        error: (): void => {
          alert('¡Ocurrio un error al borrar la categoría de fondo!');
          this.message.set(
            'ERROR: Ocurrió un error al borrar la categoría de fondo.'
          );
        },
      });
    }
  }
}
