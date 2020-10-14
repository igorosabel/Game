import { Component, OnInit, ViewChild } from '@angular/core';
import { Character }                    from '../../../../model/character.model';
import { CharacterFrame }               from '../../../../model/character-frame.model';
import { ApiService }                   from '../../../../services/api.service';
import { CommonService }                from '../../../../services/common.service';
import { ClassMapperService }           from '../../../../services/class-mapper.service';
import { AssetInterface }               from '../../../../interfaces/interfaces';
import { AssetPickerComponent }         from '../../../../components/asset-picker/asset-picker.component';

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
	savingCharacter: boolean = false;

	constructor(private as: ApiService, private cs: CommonService, private cms: ClassMapperService) {}

	ngOnInit(): void {
		this.loadCharacters();
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
		this.loadedCharacter = new Character();
	}

	showAddCharacter(ev = null) {
		ev && ev.preventDefault();
		if (!this.showDetail) {
			this.resetLoadedCharacter();
			this.characterDetailHeader = 'Nuevo personaje';

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
}
