import Character from '@model/character.model';
import PlayCharacter from '@play/play-character.class';
import PlayScenario from '@play/play-scenario.class';

export default class PlayNPC extends PlayCharacter {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    blockWidth: number,
    blockHeight: number,
    scenario: PlayScenario,
    character: Character,
    idScenarioData: number
  ) {
    super(x, y, width, height, blockWidth, blockHeight, scenario);
    this.character = character;
    this.idScenarioData = idScenarioData;
    this.npcData.isNPC = true;
    if (this.character.type == 1) {
      this.npcData.isEnemy = true;
    }
  }

  npcLogic(): void {
    if (this.npcData.isNPC && !this.character.fixedPosition && !this.dying) {
      clearTimeout(this.npcData.timer);
      this.npcData.remainingTime--;
      const distance: number = this.scenario.player.blockPos.distance(
        this.blockPos
      );
      if (distance > 250) {
        this.npcData.status = 'wandering';
      }

      if (
        this.npcData.status == 'wandering' &&
        this.npcData.remainingTime < 1
      ) {
        const movementOptions: string[] = ['down', 'up', 'left', 'right'];
        const currentInd: number = movementOptions.findIndex(
          (x: string): boolean => x === this.orientation
        );
        movementOptions.splice(currentInd, 1);
        const option: string =
          movementOptions[Math.floor(Math.random() * movementOptions.length)];
        this.stopNPC();
        this.orientation = option;
        switch (option) {
          case 'up':
            {
              this.up();
            }
            break;
          case 'down':
            {
              this.down();
            }
            break;
          case 'left':
            {
              this.left();
            }
            break;
          case 'right':
            {
              this.right();
            }
            break;
        }
        this.npcData.remainingTime = Math.floor(Math.random() * 6) + 3;
      }

      this.npcData.timer = window.setTimeout((): void => {
        this.npcLogic();
      }, 1000);
    }
  }

  die(): void {
    this.dying = true;
    this.currentDieFrame = 0;
    clearTimeout(this.npcData.timer);
    this.stopNPC();
    this.playAnimation();
  }
}
