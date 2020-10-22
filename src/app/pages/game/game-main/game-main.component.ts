import { Component, OnInit } from '@angular/core';
import { Game }              from '../../../model/game.model';

@Component({
	selector: 'game-game-main',
	templateUrl: './game-main.component.html',
	styleUrls: ['./game-main.component.scss']
})
export class GameMainComponent implements OnInit {
	games: Game[] = [];

	constructor() {}
	ngOnInit(): void {}
}