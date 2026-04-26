import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
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
  private readonly as: ApiService = inject(ApiService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly dss: DataShareService = inject(DataShareService);
  private readonly router: Router = inject(Router);

  games: WritableSignal<Game[]> = signal<Game[]>([]);
  gameSelected: number = 0;
  showNewGame: WritableSignal<boolean> = signal<boolean>(false);
  newGameName: WritableSignal<string | null> = signal<string | null>(null);

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.as.getGames().subscribe((result: GameResult): void => {
      this.games.set(this.cms.getGames(result.list));
    });
  }

  changeSelectedGame(game: Game): void {
    this.gameSelected = this.games().findIndex((x: Game): boolean => x.id === game.id);
  }

  selectGame(game: Game): void {
    if (game.idScenario === null) {
      this.newGameName.set(null);
      this.showNewGame.set(true);
    } else {
      this.dss.setGlobal('idGame', game.id);
      this.router.navigate(['/game/play']);
    }
  }

  closeNewGame(ev: MouseEvent | null = null): void {
    if (ev) {
      ev.preventDefault();
    }
    this.showNewGame.set(false);
  }

  newGame(ev: MouseEvent): void {
    if (ev) {
      ev.preventDefault();
    }
    if (this.newGameName() === null) {
      alert('¡No puedes dejar el nombre del personaje en blanco!');
      return;
    }
    const games: Game[] = this.games();
    const params: NewGameInterface = {
      idGame: games[this.gameSelected].id as number,
      name: this.newGameName() as string,
    };

    this.as.newGame(params).subscribe((result: StatusIdResult): void => {
      if (result.status === 'ok') {
        this.games.update((games: Game[]): Game[] => {
          const updatedGames: Game[] = [...games];
          updatedGames[this.gameSelected].idScenario = result.id;
          updatedGames[this.gameSelected].name = params.name;
          return updatedGames;
        });

        this.selectGame(games[this.gameSelected]);
      } else {
        alert('¡Ocurrión un error!');
      }
    });
  }

  deleteGame(ev: MouseEvent, game: Game): void {
    ev.preventDefault();
    ev.stopPropagation();
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar esta partida? Este proceso es irreversible y no se podrá recuperar una vez borrado.',
    );
    if (conf) {
      this.as.deleteGame(game.id as number).subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.loadGames();
        } else {
          alert('¡Ocurrió un error al borrar la partida!');
        }
      });
    }
  }
}
