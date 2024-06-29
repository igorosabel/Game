import Constants from '@app/constants';
import PositionSize from '@model/position-size.model';
import Position from '@model/position.model';
import PlayNPC from '@play/play-npc.class';
import PlayPlayer from '@play/play-player.class';

export default class PlayUtils {
  static collision(rect1: PositionSize, rect2: PositionSize): boolean {
    if (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    ) {
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

  static getVector(player: PlayPlayer, enemy: PlayNPC): Position {
    player.updateCenter();
    enemy.updateCenter();

    return new Position(
      enemy.center.x - player.center.x,
      enemy.center.y - player.center.y
    );
  }
}
