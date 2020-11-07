import { Constants }    from '../constants';
import { Position }     from '../model/position.model';
import { PositionSize } from '../model/position-size.model';

export class PlayUtils {
	static getCenter(pos: PositionSize): Position {
		return new Position(
			pos.x + (pos.width / 2),
			pos.y + (pos.height / 2)
		);
	}

	static distance(pos1: PositionSize, pos2: PositionSize): number {
		const obj1 = PlayUtils.getCenter(pos1);
		const obj2 = PlayUtils.getCenter(pos2);

		return Math.sqrt( Math.pow((obj2.x - obj1.x), 2) + Math.pow((obj2.y - obj1.y), 2));
	}

	static collision(rect1: PositionSize, rect2: PositionSize): boolean {
		if (rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.height + rect1.y > rect2.y) {
			return true;
		}

		return false;
	}

	static getTile(pos: Position): Position {
		return new Position(
			Math.floor(pos.x / Constants.TILE_WIDTH),
			Math.floor(pos.y / Constants.TILE_HEIGHT)
		);
	}
}
