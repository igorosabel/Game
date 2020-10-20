import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Character }                               from '../../model/character.model';
import { ApiService }                              from '../../services/api.service';
import { ClassMapperService }                      from '../../services/class-mapper.service';
import { CharacterInterface }                      from '../../interfaces/interfaces';

@Component({
	selector: 'game-character-picker',
	templateUrl: './character-picker.component.html',
	styleUrls: ['./character-picker.component.scss']
})
export class CharacterPickerComponent implements OnInit {
	typeList = [
		{id: 0, name: 'NPC'},
		{id: 1, name: 'Enemigo'}
	];
	show: boolean = false;
	characterFilter: number = null;
	characterList: Character[] = [];
	characterListFiltered: Character[] = [];
	selected: number = null;

	@Output() selectCharacterEvent = new EventEmitter<CharacterInterface>();

	constructor(private as: ApiService, private cms: ClassMapperService) {}
	ngOnInit(): void {
		this.loadCharacters();
	}

	showPicker() {
		this.show = true;
	}

	closePicker(ev) {
		ev && ev.preventDefault();
		this.show = false;
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

	selectCharacter(character: Character) {
		this.selected = character.id;
		const selectedCharacter = character.toInterface();
		this.show = false;
		this.selectCharacterEvent.emit(selectedCharacter);
	}

	resetSelected() {
		this.characterFilter = null;
		this.selected = null;
		this.updateFilteredList();
	}

	getCharacterById(id: number) {
		const characterFind = this.characterList.filter(x => x.id===id);
		if (characterFind.length==0) {
			return null;
		}
		else {
			return characterFind[0].toInterface();
		}
	}
}