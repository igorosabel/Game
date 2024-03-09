import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  GameResult,
  NewGameInterface,
} from 'src/app/interfaces/game.interfaces';
import { StatusIdResult, StatusResult } from 'src/app/interfaces/interfaces';
import { Game } from 'src/app/model/game.model';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { DataShareService } from 'src/app/services/data-share.service';

@Component({
  standalone: true,
  selector: 'game-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.scss'],
  imports: [CommonModule, FormsModule],
})
export default class HallComponent implements OnInit {
  games: Game[] = [];
  gameSelected: number = 0;
  showNewGame: boolean = false;
  newGameName: string = null;

  constructor(
    private as: ApiService,
    private cms: ClassMapperService,
    private dss: DataShareService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.as.getGames().subscribe((result: GameResult): void => {
      this.games = this.cms.getGames(result.list);
    });
  }

  changeSelectedGame(game: Game): void {
    this.gameSelected = this.games.findIndex(
      (x: Game): boolean => x.id === game.id
    );
  }

  selectGame(game: Game): void {
    if (game.idScenario === null) {
      this.newGameName = null;
      this.showNewGame = true;
    } else {
      this.dss.setGlobal('idGame', game.id);
      this.router.navigate(['/game/play']);
    }
  }

  closeNewGame(ev = null): void {
    ev && ev.preventDefault();
    this.showNewGame = false;
  }

  newGame(ev: MouseEvent): void {
    ev && ev.preventDefault();
    if (this.newGameName === null) {
      alert('¡No puedes dejar el nombre del personaje en blanco!');
      return;
    }
    const params: NewGameInterface = {
      idGame: this.games[this.gameSelected].id,
      name: this.newGameName,
    };

    this.as.newGame(params).subscribe((result: StatusIdResult): void => {
      if (result.status == 'ok') {
        this.games[this.gameSelected].idScenario = result.id;
        this.games[this.gameSelected].name = params.name;

        this.selectGame(this.games[this.gameSelected]);
      } else {
        alert('¡Ocurrión un error!');
      }
    });
  }

  deleteGame(ev: MouseEvent, game: Game): void {
    ev.preventDefault();
    ev.stopPropagation();
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar esta partida? Este proceso es irreversible y no se podrá recuperar una vez borrado.'
    );
    if (conf) {
      this.as.deleteGame(game.id).subscribe((result: StatusResult): void => {
        if (result.status == 'ok') {
          this.loadGames();
        } else {
          alert('¡Ocurrió un error al borrar la partida!');
        }
      });
    }
  }
}
