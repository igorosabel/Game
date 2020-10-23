import { Component, OnInit }  from '@angular/core';
import { Router }             from '@angular/router';
import { Game }               from '../../../model/game.model';
import { ApiService }         from '../../../services/api.service';
import { ClassMapperService } from '../../../services/class-mapper.service';
import { DataShareService }   from '../../../services/data-share.service';
import { NewGameInterface }   from '../../../interfaces/interfaces';

@Component({
	selector: 'game-hall',
	templateUrl: './hall.component.html',
	styleUrls: ['./hall.component.scss']
})
export class HallComponent implements OnInit {
	games: Game[] = [];
	gameSelected: number = 0;
	showNewGame: boolean = false;
	newGameName: string = null;

	constructor(private as: ApiService, private cms: ClassMapperService, private dss: DataShareService, private router: Router) {}
	ngOnInit(): void {
		this.loadGames();
	}

	loadGames() {
		this.as.getGames().subscribe(result => {
			this.games = this.cms.getGames(result.list);
		});
	}

	changeSelectedGame(game: Game) {
		this.gameSelected = this.games.findIndex(x => x.id===game.id);
	}

	selectGame(game: Game) {
		if (game.idScenario===null) {
			this.newGameName = null;
			this.showNewGame = true;
		}
		else {
			this.dss.setGlobal('id_game', game.id);
			this.router.navigate(['/game/play']);
		}
	}

	closeNewGame(ev = null) {
		ev && ev.preventDefault();
		this.showNewGame = false;
	}

	newGame(ev) {
		ev && ev.preventDefault();
		if (this.newGameName===null) {
			alert('¡No puedes dejar el nombre del personaje en blanco!');
			return;
		}
		const params: NewGameInterface = {
			idGame: this.games[this.gameSelected].id,
			name: this.newGameName
		};

		this.as.newGame(params).subscribe(result => {
			if (result.status=='ok') {
				this.games[this.gameSelected].idScenario = result.id;
				this.games[this.gameSelected].name = params.name;
				
				this.selectGame(this.games[this.gameSelected]);
			}
			else {
				alert('¡Ocurrión un error!');
			}
		});
	}
}
