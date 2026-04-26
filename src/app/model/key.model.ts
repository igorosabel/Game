import { KeyHandler } from '@interfaces/player.interfaces';

export default class Key {
  press: KeyHandler | null = null;
  release: KeyHandler | null = null;

  constructor(
    public code: string | null = null,
    public isDown: boolean = false,
    public isUp: boolean = true,
    public disabled: boolean = false,
    public onlyEsc: boolean = false,
  ) {}

  downHandler(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    if (this.onlyEsc && event.key !== 'Escape') {
      return;
    }
    if (event.key === this.code) {
      if (this.isUp && this.press) {
        this.press();
      }
      this.isDown = true;
      this.isUp = false;
    }
    event.preventDefault();
  }

  upHandler(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    if (this.onlyEsc && event.key !== 'Escape') {
      return;
    }
    if (event.key === this.code) {
      if (this.isDown && this.release) {
        this.release();
      }
      this.isDown = false;
      this.isUp = true;
    }
    event.preventDefault();
  }
}
