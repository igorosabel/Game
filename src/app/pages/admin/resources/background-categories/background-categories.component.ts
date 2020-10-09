import { Component, OnInit }  from '@angular/core';
import { CommonService }      from '../../../../services/common.service';
import { ApiService }         from '../../../../services/api.service';
import { ClassMapperService } from '../../../../services/class-mapper.service';
import { BackgroundCategory } from '../../../../model/background-category.model';


@Component({
	selector: 'game-background-categories',
	templateUrl: './background-categories.component.html',
	styleUrls: ['./background-categories.component.scss']
})
export class BackgroundCategoriesComponent implements OnInit {
	backgroundCategoryList: BackgroundCategory[] = [];
	message: string = null;
	loadedBackgroundCategory: BackgroundCategory = new BackgroundCategory();
	showDetail: boolean = false;
	backgroundCategoryDetailHeader: string = '';

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}

	ngOnInit(): void {
		this.message = 'Cargando...';
		this.loadBackgroundCategories();
	}
	
	loadBackgroundCategories() {
		this.message = 'Cargando...';
		this.as.getBackgroundCategories().subscribe(result => {
			if (result.status=='ok') {
				this.message = null;
				this.backgroundCategoryList = this.cms.getBackgroundCategories(result.list);
			}
			else {
				this.message = 'ERROR: Ocurrió un error al obtener la lista de categorías de fondos.';
			}
		});
	}

	resetLoadedBackgroundCategory() {
		this.loadedBackgroundCategory = new BackgroundCategory();
	}

	showAddBackgroundCategory(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedBackgroundCategory();
			this.backgroundCategoryDetailHeader = 'Nueva categoría de fondo';

			this.showDetail = true;
		}
		else {
			this.showDetail = false;
		}
	}
	
	saveBackgroundCategory() {
		let validate = true;
		if (this.loadedBackgroundCategory.name=='') {
			validate = false;
			alert('¡No puedes dejar el nombre de la categoría de fondo en blanco!');
		}

		if (validate) {
			this.as.saveBackgroundCategory(this.loadedBackgroundCategory.toInterface()).subscribe(result => {
				if (result.status=='ok') {
					this.showAddBackgroundCategory();
					this.loadBackgroundCategories();
				}
				else {
					alert('¡Ocurrió un error al guardar la categoría de fondo!');
					this.message = 'ERROR: Ocurrió un error al guardar la categoría de fondo.';
				}
			});
		}
	}

	editBackgroundCategory(backgroundCategory: BackgroundCategory) {
		this.loadedBackgroundCategory = new BackgroundCategory(
			backgroundCategory.id,
			this.cs.urldecode(backgroundCategory.name)
		);

		this.backgroundCategoryDetailHeader = 'Editar categoría de fondo';
		this.showDetail = true;
	}

	deleteBackgroundCategory(backgroundCategory: BackgroundCategory) {
		const conf = confirm('¿Estás seguro de querer borrar la categoría de fondo "'+this.cs.urldecode(backgroundCategory.name)+'"?');
		if (conf) {
			this.as.deleteBackgroundCategory(backgroundCategory.id).subscribe(result => {
				if (result.status=='ok') {
					this.loadBackgroundCategories();
				}
				if (result.status=='in-use') {
					alert('¡Atención! La categoría está asignada a algún fondo. Cambia la categoría a esos fondos antes de borrarla');
				}
				if (result.status=='error') {
					alert('¡Ocurrio un error al borrar la categoría de fondo!');
					this.message = 'ERROR: Ocurrió un error al borrar la categoría de fondo.';
				}
			});
		}
	}
}