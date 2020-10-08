import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'game-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	@Input() leftUrl: string[] = [];
	@Input() leftTitle: string = null;
	@Input() img: string = null;
	@Input() title: string = 'The Game';
	@Input() rightUrl: string[] = [];
	@Input() rightTitle: string = null;
	constructor() {}

	ngOnInit(): void {}
}