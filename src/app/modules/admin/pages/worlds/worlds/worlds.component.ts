import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatusResult } from '@interfaces/interfaces';
import { WorldResult } from '@interfaces/world.interfaces';
import Key from '@model/key.model';
import World from '@model/world.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import PlayService from '@services/play.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'game-worlds',
  templateUrl: './worlds.component.html',
  styleUrls: ['../../scss/admin.scss'],
  imports: [RouterLink, FormsModule, HeaderComponent],
})
export default class WorldsComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private play: PlayService = inject(PlayService);

  worldList: WritableSignal<World[]> = signal<World[]>([]);
  message: WritableSignal<string> = signal<string>('Cargando...');
  loadedWorld: World = new World();
  showDetail: WritableSignal<boolean> = signal<boolean>(false);
  worldDetailHeader: WritableSignal<string> = signal<string>('');

  ngOnInit(): void {
    this.loadWorlds();

    const esc: Key = this.play.keyboard('Escape');
    esc.onlyEsc = true;
    esc.press = (): void => {
      this.showAddWorld();
    };
  }

  loadWorlds(): void {
    this.message.set('Cargando...');
    this.as.getWorlds().subscribe({
      next: (result: WorldResult): void => {
        if (result.status === 'ok') {
          this.message.set(null);
          this.worldList.set(this.cms.getWorlds(result.list));
        } else {
          this.message.set(
            'ERROR: Ocurrió un error al obtener la lista de mundos.'
          );
        }
      },
      error: (): void => {
        this.message.set(
          'ERROR: Ocurrió un error al obtener la lista de mundos.'
        );
      },
    });
  }

  resetLoadedWorld(): void {
    this.loadedWorld = new World();
  }

  showAddWorld(ev: MouseEvent = null): void {
    if (ev) {
      ev.preventDefault();
    }
    if (!this.showDetail()) {
      this.resetLoadedWorld();
      this.worldDetailHeader.set('Nuevo mundo');

      this.showDetail.set(true);
    } else {
      this.showDetail.set(false);
    }
  }

  saveWorld(): void {
    let validate: boolean = true;
    console.log(this.loadedWorld);
    if (this.loadedWorld.name === null || this.loadedWorld.name === '') {
      validate = false;
      alert('¡No puedes dejar el nombre del mundo en blanco!');
    }

    if (
      (validate && this.loadedWorld.wordOne === null) ||
      this.loadedWorld.wordOne === ''
    ) {
      validate = false;
      alert('¡No puedes dejar la primera palabra en blanco!');
    }

    if (
      (validate && this.loadedWorld.wordTwo === null) ||
      this.loadedWorld.wordTwo === ''
    ) {
      validate = false;
      alert('¡No puedes dejar la segunda palabra en blanco!');
    }

    if (
      (validate && this.loadedWorld.wordThree === null) ||
      this.loadedWorld.wordThree === ''
    ) {
      validate = false;
      alert('¡No puedes dejar la tercera palabra en blanco!');
    }

    if (validate) {
      this.as.saveWorld(this.loadedWorld.toInterface()).subscribe({
        next: (result: StatusResult): void => {
          if (result.status == 'ok') {
            this.showAddWorld();
            this.loadWorlds();
          } else {
            alert('¡Ocurrió un error al guardar el mundo!');
            this.message.set('ERROR: Ocurrió un error al guardar el mundo.');
          }
        },
        error: (): void => {
          alert('¡Ocurrió un error al guardar el mundo!');
          this.message.set('ERROR: Ocurrió un error al guardar el mundo.');
        },
      });
    }
  }

  editWorld(world: World): void {
    this.loadedWorld = new World(
      world.id,
      world.name,
      world.description,
      world.wordOne,
      world.wordTwo,
      world.wordThree,
      world.friendly
    );

    this.worldDetailHeader.set('Editar mundo');
    this.showDetail.set(true);
  }

  deleteWorld(world: World): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar el mundo "' + world.name + '"?'
    );
    if (conf) {
      this.as.deleteWorld(world.id).subscribe((result: StatusResult): void => {
        if (result.status == 'ok') {
          this.loadWorlds();
        } else {
          alert('¡Ocurrio un error al borrar el mundo!');
          this.message.set('ERROR: Ocurrió un error al borrar el mundo.');
        }
      });
    }
  }
}
