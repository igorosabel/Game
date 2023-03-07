import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CharacterInterface,
  CharacterResult,
  CharacterTypeInterface,
} from 'src/app/interfaces/interfaces';
import { Character } from 'src/app/model/character.model';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Component({
  standalone: true,
  selector: 'game-character-picker',
  templateUrl: './character-picker.component.html',
  styleUrls: ['./character-picker.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class CharacterPickerComponent implements OnInit {
  typeList: CharacterTypeInterface[] = [
    { id: 0, name: 'NPC' },
    { id: 1, name: 'Enemigo' },
  ];
  show: boolean = false;
  characterFilter: number = null;
  characterList: Character[] = [];
  characterListFiltered: Character[] = [];
  selected: number = null;

  @Output() selectCharacterEvent: EventEmitter<CharacterInterface> =
    new EventEmitter<CharacterInterface>();

  constructor(private as: ApiService, private cms: ClassMapperService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  showPicker(): void {
    this.show = true;
  }

  closePicker(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.show = false;
  }

  loadCharacters(): void {
    this.as.getCharacters().subscribe((result: CharacterResult): void => {
      if (result.status == 'ok') {
        this.characterList = this.cms.getCharacters(result.list);
        this.updateFilteredList();
      }
    });
  }

  updateFilteredList(): void {
    let filteredList: Character[] = [];
    if (this.characterFilter === null) {
      filteredList = this.characterList;
    } else {
      filteredList = this.characterList.filter(
        (x: Character): boolean => x.type === this.characterFilter
      );
    }
    this.characterListFiltered = filteredList;
  }

  selectCharacter(character: Character): void {
    this.selected = character.id;
    const selectedCharacter: CharacterInterface = character.toInterface();
    this.show = false;
    this.selectCharacterEvent.emit(selectedCharacter);
  }

  resetSelected(): void {
    this.characterFilter = null;
    this.selected = null;
    this.updateFilteredList();
  }

  getCharacterById(id: number): CharacterInterface {
    const characterFind: Character[] = this.characterList.filter(
      (x: Character): boolean => x.id === id
    );
    if (characterFind.length == 0) {
      return null;
    } else {
      return characterFind[0].toInterface();
    }
  }
}
