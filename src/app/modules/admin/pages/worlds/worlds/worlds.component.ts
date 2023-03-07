import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StatusResult, WorldResult } from 'src/app/interfaces/interfaces';
import { Key } from 'src/app/model/key.model';
import { World } from 'src/app/model/world.model';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { PlayService } from 'src/app/services/play.service';

@Component({
  standalone: true,
  selector: 'game-worlds',
  templateUrl: './worlds.component.html',
  styleUrls: ['../../scss/admin.scss'],
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
})
export default class WorldsComponent implements OnInit {
  worldList: World[] = [];
  message: string = null;
  loadedWorld: World = new World();
  showDetail: boolean = false;
  worldDetailHeader: string = '';

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    private play: PlayService
  ) {}

  ngOnInit(): void {
    this.message = 'Cargando...';
    this.loadWorlds();

    const esc: Key = this.play.keyboard('Escape');
    esc.onlyEsc = true;
    esc.press = (): void => {
      this.showAddWorld();
    };
  }

  loadWorlds(): void {
    this.message = 'Cargando...';
    this.as.getWorlds().subscribe((result: WorldResult): void => {
      if (result.status == 'ok') {
        this.message = null;
        this.worldList = this.cms.getWorlds(result.list);
      } else {
        this.message = 'ERROR: Ocurrió un error al obtener la lista de mundos.';
      }
    });
  }

  resetLoadedWorld(): void {
    this.loadedWorld = new World();
  }

  showAddWorld(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    if (!this.showDetail) {
      this.resetLoadedWorld();
      this.worldDetailHeader = 'Nuevo mundo';

      this.showDetail = true;
    } else {
      this.showDetail = false;
    }
  }

  saveWorld(): void {
    let validate: boolean = true;
    if (this.loadedWorld.name == '') {
      validate = false;
      alert('¡No puedes dejar el nombre del mundo en blanco!');
    }

    if (validate && this.loadedWorld.wordOne == '') {
      validate = false;
      alert('¡No puedes dejar la primera palabra en blanco!');
    }

    if (validate && this.loadedWorld.wordTwo == '') {
      validate = false;
      alert('¡No puedes dejar la segunda palabra en blanco!');
    }

    if (validate && this.loadedWorld.wordThree == '') {
      validate = false;
      alert('¡No puedes dejar la tercera palabra en blanco!');
    }

    if (validate) {
      this.as
        .saveWorld(this.loadedWorld.toInterface())
        .subscribe((result: StatusResult): void => {
          if (result.status == 'ok') {
            this.showAddWorld();
            this.loadWorlds();
          } else {
            alert('¡Ocurrió un error al guardar el mundo!');
            this.message = 'ERROR: Ocurrió un error al guardar el mundo.';
          }
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

    this.worldDetailHeader = 'Editar mundo';
    this.showDetail = true;
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
          this.message = 'ERROR: Ocurrió un error al borrar el mundo.';
        }
      });
    }
  }
}
