import { Component, OnInit }  from '@angular/core';
import { ApiService }         from '../../../../services/api.service';
import { ClassMapperService } from '../../../../services/class-mapper.service';
import { PlayService }        from '../../../../services/play.service';
import { World }              from '../../../../model/world.model';

@Component({
	selector: 'game-worlds',
	templateUrl: './worlds.component.html',
	styleUrls: ['./worlds.component.scss']
})
export class WorldsComponent implements OnInit {
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

		let esc = this.play.keyboard(27);
		esc.press = () => { this.showAddWorld() };
	}

	loadWorlds() {
		this.message = 'Cargando...';
		this.as.getWorlds().subscribe(result => {
			if (result.status=='ok') {
				this.message = null;
				this.worldList = this.cms.getWorlds(result.list);
			}
			else {
				this.message = 'ERROR: Ocurrió un error al obtener la lista de mundos.';
			}
		});
	}

	resetLoadedWorld() {
		this.loadedWorld = new World();
	}

	showAddWorld(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedWorld();
			this.worldDetailHeader = 'Nuevo mundo';

			this.showDetail = true;
		}
		else {
			this.showDetail = false;
		}
	}

	saveWorld() {
		let validate = true;
		if (this.loadedWorld.name=='') {
			validate = false;
			alert('¡No puedes dejar el nombre del mundo en blanco!');
		}

		if (validate && this.loadedWorld.wordOne=='') {
			validate = false;
			alert('¡No puedes dejar la primera palabra en blanco!');
		}

		if (validate && this.loadedWorld.wordTwo=='') {
			validate = false;
			alert('¡No puedes dejar la segunda palabra en blanco!');
		}

		if (validate && this.loadedWorld.wordThree=='') {
			validate = false;
			alert('¡No puedes dejar la tercera palabra en blanco!');
		}

		if (validate) {
			this.as.saveWorld(this.loadedWorld.toInterface()).subscribe(result => {
				if (result.status=='ok') {
					this.showAddWorld();
					this.loadWorlds();
				}
				else {
					alert('¡Ocurrió un error al guardar el mundo!');
					this.message = 'ERROR: Ocurrió un error al guardar el mundo.';
				}
			});
		}
	}

	editWorld(world: World) {
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

	deleteWorld(world: World) {
		const conf = confirm('¿Estás seguro de querer borrar el mundo "'+world.name+'"?');
		if (conf) {
			this.as.deleteWorld(world.id).subscribe(result => {
				if (result.status=='ok') {
					this.loadWorlds();
				}
				else {
					alert('¡Ocurrio un error al borrar el mundo!');
					this.message = 'ERROR: Ocurrió un error al borrar el mundo.';
				}
			});
		}
	}
}
