import { CharacterTypeInterface } from '@interfaces/character.interfaces';
import { ItemTypeInterface } from '@interfaces/item.interfaces';

export default class Constants {
  public static DEBUG: boolean = true;
  public static SCENARIO_WIDTH: number = 800;
  public static SCENARIO_HEIGHT: number = 640;
  public static SCENARIO_ROWS: number = 20;
  public static SCENARIO_COLS: number = 25;
  public static TILE_WIDTH: number =
    Constants.SCENARIO_WIDTH / Constants.SCENARIO_COLS;
  public static TILE_HEIGHT: number =
    Constants.SCENARIO_HEIGHT / Constants.SCENARIO_ROWS;
  public static FPS: number = 30;
  public static FRAME_DURATION: number = 1000 / Constants.FPS;
  public static DEFAULT_VX: number = 3;
  public static DEFAULT_VY: number = 3;
  public static NEXT_POS: number = 10;
  public static PLAYER_UPDATE_TIME: number = 10000;
  public static INVENTORY_SIZE: number = 200;
  public static CHARACTER_TYPE_LIST: CharacterTypeInterface[] = [
    { id: 0, name: 'NPC' },
    { id: 1, name: 'Enemigo' },
  ];
  public static ITEM_TYPE_LIST: ItemTypeInterface[] = [
    { id: 0, name: 'Moneda' },
    { id: 1, name: 'Arma' },
    { id: 2, name: 'Poción' },
    { id: 3, name: 'Equipamiento' },
    { id: 4, name: 'Objeto' },
  ];
}
