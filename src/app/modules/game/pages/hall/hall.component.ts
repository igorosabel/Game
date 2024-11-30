import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameResult, NewGameInterface } from '@interfaces/game.interfaces';
import { StatusIdResult, StatusResult } from '@interfaces/interfaces';
import Game from '@model/game.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import DataShareService from '@services/data-share.service';

@Component({
  selector: 'game-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.scss'],
  imports: [FormsModule],
})
export default class HallComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private dss: DataShareService = inject(DataShareService);
  private router: Router = inject(Router);

  games: Game[] = [];
  gameSelected: number = 0;
  showNewGame: boolean = false;
  newGameName: string = null;

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
