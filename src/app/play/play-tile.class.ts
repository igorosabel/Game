import { PlayScenario } from './play-scenario.class';
export class PlayTile {
	ind: number;
	pos;
	size;
	center;
	bck;
	spr;
	crossable: boolean;
	scenario: PlayScenario;

	constructor(ind, pos, size) {
		this.ind = ind;
		this.pos = pos;
		this.size = size;
		this.center = {
			x: this.pos.x + (this.size.width / 2),
			y: this.pos.y + (this.size.height / 2)
		};
		this.bck = null;
		this.spr = null;
		this.crossable = true;
	}

	addBck(bck) {
		this.bck = bck;
		if (bck.crossable===false) { this.crossable = false; }
	}

	deleteBck() {
		this.bck = null;
	}

	addSpr(spr) {
		this.spr = spr;
		if (spr.crossable===false) { this.crossable = false; }
	}

	deleteSpr() {
		this.spr = null;
	}

	setScenario(scenario: PlayScenario) {
		this.scenario = scenario;
	}

	render() {
		let ctx = this.scenario.ctx;
		if (this.scenario.debug) {
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
			ctx.stroke();
			ctx.fill();
		}

		if (this.bck && this.bck.img) {
			ctx.drawImage(this.bck.img, this.pos.x, this.pos.y, this.size.w, this.size.h);
		}
		if (this.spr && this.spr.img){
			ctx.drawImage(this.spr.img, this.pos.x, this.pos.y, this.size.w, this.size.h);
		}
	}
}
