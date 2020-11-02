export class Constants {
	public static DEBUG: boolean = true;
	public static SCENARIO_WIDTH: number = 800;
	public static SCENARIO_HEIGHT: number = 640;
	public static SCENARIO_ROWS: number = 20;
	public static SCENARIO_COLS: number = 25;
	public static TILE_WIDTH: number = (Constants.SCENARIO_WIDTH / Constants.SCENARIO_COLS);
	public static TILE_HEIGHT: number = (Constants.SCENARIO_HEIGHT / Constants.SCENARIO_ROWS);
	public static FPS: number = 30;
	public static FRAME_DURATION: number = (1000 / Constants.FPS);
	public static DEFAULT_VX: number = 3;
	public static DEFAULT_VY: number = 3;
	public static NEXT_POS: number = 10;
}
