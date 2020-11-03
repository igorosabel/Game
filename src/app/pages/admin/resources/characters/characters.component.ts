import { Component, OnInit, ViewChild }  from '@angular/core';
import { Character }                     from '../../../../model/character.model';
import { CharacterFrame }                from '../../../../model/character-frame.model';
import { Narrative }                     from '../../../../model/narrative.model';
import { ApiService }                    from '../../../../services/api.service';
import { CommonService }                 from '../../../../services/common.service';
import { ClassMapperService }            from '../../../../services/class-mapper.service';
import { PlayService }                   from '../../../../services/play.service';
import { AssetInterface, ItemInterface } from '../../../../interfaces/interfaces';
import { AssetPickerComponent }          from '../../../../components/asset-picker/asset-picker.component';
import { ItemPickerComponent }           from '../../../../components/item-picker/item-picker.component';

@Component({
	selector: 'game-characters',
	templateUrl: './characters.component.html',
	styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
	characterFilter: number = null;
	filterListOption: string = 'items';
	typeList = [
		{id: 0, name: 'NPC'},
		{id: 1, name: 'Enemigo'}
	];
	characterList: Character[] = [];
	characterListFiltered: Character[] = [];
	message: string = null;
	loadedCharacter: Character = new Character();
	showDetail: boolean = false;
	detailtTab: string = 'data';
	characterDetailHeader: string = '';
	dropItemName: string = '';
	savingCharacter: boolean = false;
	assetPickerWhere: string = null;
	@ViewChild('assetPicker', { static: true }) assetPicker: AssetPickerComponent;
	@ViewChild('itemPicker', { static: true }) itemPicker: ItemPickerComponent;
	animationImage = {
		up: '',
		down: '',
		left: '',
		right: ''
	};
	animationInd = {
		up: -1,
		down: -1,
		left: -1,
		right: -1
	}
	animationTimer = {
		up: null,
		down: null,
		left: null,
		right: null
	};

	constructor(
		private as: ApiService,
		private cs: CommonService,
		private cms: ClassMapperService,
		private play: PlayService
	) {}

	ngOnInit(): void {
		this.loadCharacters();

		let esc = this.play.keyboard(27);
		esc.press = () => { this.showAddCharacter() };
	}

	loadCharacters() {
		this.as.getCharacters().subscribe(result => {
			if (result.status=='ok') {
				this.characterList = this.cms.getCharacters(result.list);
				this.updateFilteredList();
			}
		});
	}

	updateFilteredList() {
		let filteredList = [];
		if (this.characterFilter===null) {
			filteredList = this.characterList;
		}
		else {
			filteredList = this.characterList.filter(x => x.type===this.characterFilter);
		}
		this.characterListFiltered = filteredList;
	}

	changeFilterListOption(ev, option) {
		ev && ev.preventDefault();
		this.filterListOption = option;
	}

	resetLoadedCharacter() {
		clearInterval(this.animationTimer.up);
		clearInterval(this.animationTimer.down);
		clearInterval(this.animationTimer.left);
		clearInterval(this.animationTimer.right);
		this.loadedCharacter = new Character();
		this.loadedCharacter.dropAssetUrl = '/assets/admin/no-asset.svg';
		this.dropItemName = 'Elige un item';
		this.loadedCharacter.assetUpUrl = '/assets/admin/no-asset.svg';
		this.animationImage.up = '/assets/admin/no-asset.svg';
		this.loadedCharacter.assetDownUrl = '/assets/admin/no-asset.svg';
		this.animationImage.down = '/assets/admin/no-asset.svg';
		this.loadedCharacter.assetLeftUrl = '/assets/admin/no-asset.svg';
		this.animationImage.left = '/assets/admin/no-asset.svg';
		this.loadedCharacter.assetRightUrl = '/assets/admin/no-asset.svg';
		this.animationImage.right = '/assets/admin/no-asset.svg';
	}

	showAddCharacter(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedCharacter();
			this.characterDetailHeader = 'Nuevo personaje';
			this.detailtTab = 'data';

			this.showDetail = true;
		}
		else {
			this.showDetail = false;
			this.resetLoadedCharacter();
		}
	}

	changeTab(tab: string) {
		this.detailtTab = tab;
	}

	openItemPicker() {
		this.itemPicker.showPicker();
	}

	selectedItem(selectedItem: ItemInterface) {
		this.loadedCharacter.dropIdItem = selectedItem.id;
		this.loadedCharacter.dropAssetUrl = selectedItem.assetUrl;
		this.dropItemName = selectedItem.name;
	}

	removeSelectedDropItem(ev) {
		ev && ev.preventDefault();
		this.loadedCharacter.dropIdItem = null;
		this.loadedCharacter.dropAssetUrl = '/assets/admin/no-asset.svg';
		this.dropItemName = 'Elige un item';
	}

	openAssetPicker(where: string) {
		if (where.indexOf('frames')!=-1) {
			const orientation = where.replace('frames', '').toLowerCase();
			const whereCheck = orientation.substring(0,1).toUpperCase() + orientation.substring(1);
			if (this.loadedCharacter['idAsset'+whereCheck]==null) {
				alert('Antes de añadir un frame tienes que elegir una imagen principal.');
				return;
			}
		}
		this.assetPickerWhere = where;
		this.assetPicker.showPicker();
	}

	selectedAsset(selectedAsset: AssetInterface) {
		if (this.assetPickerWhere.indexOf('frames')!=-1) {
			const orientation = this.assetPickerWhere.replace('frames', '').toLowerCase();
			let frame = new CharacterFrame(
				null,
				selectedAsset.id,
				selectedAsset.url,
				orientation,
				this.loadedCharacter[this.assetPickerWhere].length
			);
			this.loadedCharacter[this.assetPickerWhere].push(frame);
		}
		else {
			const where = this.assetPickerWhere.substring(0,1).toUpperCase() + this.assetPickerWhere.substring(1);
			this.loadedCharacter['idAsset'+where] = selectedAsset.id;
			this.loadedCharacter['asset'+where+'Url'] = selectedAsset.url;
		}
		this.startAnimation();
	}

	startAnimation() {
		const sentList = ['up','down','left','right'];
		for (let sent of sentList) {
			clearInterval(this.animationTimer[sent]);
			let sentUpper = sent.substring(0,1).toUpperCase() + sent.substring(1);

			if (this.loadedCharacter['allFrames'+sentUpper].length>1) {
				this.animationTimer[sent] = setInterval(() => { this.animatePreview(sent) }, 300);
			}
			else {
				this.animationImage[sent] = this.loadedCharacter['asset'+sentUpper+'Url'];
			}
		}
	}

	animatePreview(sent: string) {
		let sentUpper = sent.substring(0,1).toUpperCase() + sent.substring(1);
		this.animationInd[sent]++;
		if (this.animationInd[sent] >= this.loadedCharacter['allFrames'+sentUpper].length) {
			this.animationInd[sent] = 0;
		}
		this.animationImage[sent] = this.loadedCharacter['allFrames'+sentUpper][this.animationInd[sent]];
	}

	frameDelete(sent: string, frame: CharacterFrame) {
		const conf = confirm('¿Estás seguro de querer borrar este frame?');
		if (conf) {
			let sentUpper = sent.substring(0,1).toUpperCase() + sent.substring(1);
			const ind = this.loadedCharacter['frames'+sentUpper].findIndex(x => (x.id+x.idAsset.toString())==(frame.id+frame.idAsset.toString()));
			this.loadedCharacter['frames'+sentUpper].splice(ind, 1);
			this.updateFrameOrders(sentUpper);
		}
	}

	frameLeft(sent: string, frame: CharacterFrame) {
		let sentUpper = sent.substring(0,1).toUpperCase() + sent.substring(1);
		const ind = this.loadedCharacter['frames'+sentUpper].findIndex(x => (x.id+x.idAsset.toString())==(frame.id+frame.idAsset.toString()));
		if (ind==0) {
			return;
		}
		const aux = this.loadedCharacter['frames'+sentUpper][ind];
		this.loadedCharacter['frames'+sentUpper][ind] = this.loadedCharacter['frames'+sentUpper][ind -1];
		this.loadedCharacter['frames'+sentUpper][ind -1] = aux;
		this.updateFrameOrders(sentUpper);
	}

	frameRight(sent: string, frame: CharacterFrame) {
		let sentUpper = sent.substring(0,1).toUpperCase() + sent.substring(1);
		const ind = this.loadedCharacter['frames'+sentUpper].findIndex(x => (x.id+x.idAsset.toString())==(frame.id+frame.idAsset.toString()));
		if (ind==(this.loadedCharacter['frames'+sentUpper].length-1)) {
			return;
		}
		const aux = this.loadedCharacter['frames'+sentUpper][ind];
		this.loadedCharacter['frames'+sentUpper][ind] = this.loadedCharacter['frames'+sentUpper][ind +1];
		this.loadedCharacter['frames'+sentUpper][ind +1] = aux;
		this.updateFrameOrders(sentUpper);
	}

	updateFrameOrders(sent: string) {
		for (let frameOrder in this.loadedCharacter['frames'+sent]) {
			this.loadedCharacter['frames'+sent][frameOrder].order = parseInt(frameOrder);
		}
	}

	addNarrative() {
		this.loadedCharacter.narratives.push( new Narrative(
			null,
			'',
			(this.loadedCharacter.narratives.length +1)
		) );
	}

	moveNarrative(narrative: Narrative, sent: string) {
		const ind = this.loadedCharacter.narratives.findIndex(x => x.order==narrative.order);
		const aux = this.loadedCharacter.narratives[ind];
		if (sent=='up') {
			if (ind==0) {
				return;
			}
			this.loadedCharacter.narratives[ind] = this.loadedCharacter.narratives[ind -1];
			this.loadedCharacter.narratives[ind -1] = aux;
		}
		if (sent=='down') {
			if (ind==this.loadedCharacter.narratives.length-1) {
				return;
			}
			this.loadedCharacter.narratives[ind] = this.loadedCharacter.narratives[ind +1];
			this.loadedCharacter.narratives[ind +1] = aux;
		}
		this.updateNarrativeOrders();
	}

	deleteNarrative(narrative: Narrative) {
		const conf = confirm('¿Estás seguro de querer borrar este diálogo?');
		if (conf) {
			const ind = this.loadedCharacter.narratives.findIndex(x => x.order==narrative.order);
			this.loadedCharacter.narratives.splice(ind, 1);
			this.updateNarrativeOrders();
		}
	}

	updateNarrativeOrders() {
		for (let narrativeOrder in this.loadedCharacter.narratives) {
			this.loadedCharacter.narratives[narrativeOrder].order = parseInt(narrativeOrder) +1;
		}
	}

	saveCharacter() {
		let validate = true;
		if (this.loadedCharacter.type==null) {
			alert('¡Tienes que elegir el tipo de personaje!');
			validate = false;
		}

		if (validate && this.loadedCharacter.name==null) {
			alert('¡No puedes dejar el nombre del personaje en blanco!');
			validate = false;
		}

		if (validate && this.loadedCharacter.width==null) {
			alert('¡No puedes dejar la anchura del personaje en blanco!');
			validate = false;
		}

		if (validate && this.loadedCharacter.height==null) {
			alert('¡No puedes dejar la altura del personaje en blanco!');
			validate = false;
		}

		if (this.loadedCharacter.type==1) {
			if (validate && this.loadedCharacter.health==null) {
				alert('¡No puedes dejar la salud del enemigo en blanco!');
				validate = false;
			}

			if (validate && this.loadedCharacter.attack==null) {
				alert('¡No puedes dejar el ataque del enemigo en blanco!');
				validate = false;
			}

			if (validate && this.loadedCharacter.defense==null) {
				alert('¡No puedes dejar la defensa del enemigo en blanco!');
				validate = false;
			}

			if (validate && this.loadedCharacter.speed==null) {
				alert('¡No puedes dejar la velocidad del enemigo en blanco!');
				validate = false;
			}

			if (validate && this.loadedCharacter.respawn==null) {
				alert('¡No puedes dejar el tiempo de reaparición del enemigo en blanco!');
				validate = false;
			}

			if (validate && this.loadedCharacter.dropIdItem!=null && this.loadedCharacter.dropChance==null) {
				alert('¡Has elegido un item para el enemigo, pero no has indicado el porcentaje de obtención!');
				validate = false;
			}

			if (validate && this.loadedCharacter.dropChance!=null && this.loadedCharacter.dropIdItem==null) {
				alert('¡Has indicado el porcentaje de obtención de un item pero no has elegido ninguno!');
				validate = false;
			}

			if (validate && this.loadedCharacter.dropChance!=null && this.loadedCharacter.dropChance>100) {
				alert('¡El porcentaje de obtención de un item no puede ser superior a 100%!');
				this.loadedCharacter.dropChance = 100;
				validate = false;
			}
		}

		if (validate && this.loadedCharacter.idAssetDown==null) {
			alert('Tienes que elegir por lo menos una imagen hacia abajo para el personaje');
			validate = false;
		}

		if (validate && this.loadedCharacter.type==1 && (this.loadedCharacter.idAssetDown==null || this.loadedCharacter.idAssetUp==null || this.loadedCharacter.idAssetLeft==null || this.loadedCharacter.idAssetRight==null)) {
			alert('Para un enemigo tienes que elegir por lo menos una imagen en cada sentido.');
			validate = false;
		}

		if (validate) {
			this.savingCharacter = true;
			this.as.saveCharacter(this.loadedCharacter.toInterface()).subscribe(result => {
				this.savingCharacter = false;
				if (result.status=='ok') {
					this.showAddCharacter();
					this.loadCharacters();
					this.itemPicker.resetSelected();
					this.assetPicker.resetSelected();
				}
				else {
					alert('¡Ocurrió un error al guardar el personaje!');
					this.message = 'ERROR: Ocurrió un error al guardar el personaje.';
				}
			});
		}
	}

	editCharacter(character: Character) {
		this.loadedCharacter = new Character(
			character.id,
			character.name,
			character.width,
			character.blockWidth,
			character.height,
			character.blockHeight,
			character.fixedPosition,
			character.idAssetUp,
			(character.assetUpUrl!=null) ? character.assetUpUrl : '/assets/admin/no-asset.svg',
			character.idAssetDown,
			character.assetDownUrl,
			character.idAssetLeft,
			(character.assetLeftUrl!=null) ? character.assetLeftUrl : '/assets/admin/no-asset.svg',
			character.idAssetRight,
			(character.assetRightUrl!=null) ? character.assetRightUrl : '/assets/admin/no-asset.svg',
			character.type,
			character.health,
			character.attack,
			character.defense,
			character.speed,
			character.dropIdItem,
			(character.dropAssetUrl!=null) ? character.dropAssetUrl : '/assets/admin/no-asset.svg',
			character.dropChance,
			character.respawn,
			[],
			[],
			[],
			[],
			character.narratives
		);
		let sentList = ['Up', 'Down', 'Left', 'Right'];
		for (let sent of sentList) {
			for (let frame of character['frames'+sent]) {
				this.loadedCharacter['frames'+sent].push(frame);
			}

			this.animationImage[sent.toLowerCase()] = (this.loadedCharacter['asset'+sent+'Url']!=null) ? this.loadedCharacter['asset'+sent+'Url'] : '/assets/admin/no-asset.svg';
			this.animationInd[sent.toLowerCase()] = -1;
			clearInterval(this.animationTimer[sent.toLowerCase()]);
			this.animationTimer[sent.toLowerCase()] = null;
		}

		this.assetPickerWhere = null;
		this.changeTab('data');
		this.startAnimation();

		if (character.dropIdItem!==null) {
			const dropItem = this.itemPicker.getItemById(character.dropIdItem);
			this.dropItemName = dropItem.name;
		}
		else {
			this.dropItemName = 'Elige un item';
		}

		this.characterDetailHeader = 'Editar personaje';
		this.showDetail = true;
	}

	deleteCharacter(character: Character) {
		const conf = confirm('¿Estás seguro de querer borrar el personaje "'+character.name+'"?');
		if (conf) {
			this.as.deleteCharacter(character.id).subscribe(result => {
				if (result.status=='ok') {
					this.loadCharacters();
				}
				if (result.status=='in-use') {
					alert("El personaje está siendo usado. Cámbialo o bórralo antes de poder borrarlo.\n\n"+this.cs.urldecode(result.message));
				}
				if (status=='error') {
					alert('¡Ocurrio un error al borrar el personaje!');
					this.message = 'ERROR: Ocurrió un error al borrar el personaje.';
				}
			});
		}
	}
}
