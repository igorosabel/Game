import { Injectable, inject } from '@angular/core';
import { CharacterInterface } from '@interfaces/character.interfaces';
import {
  ConnectionListInterface,
  ScenarioObjectInterface,
} from '@interfaces/scenario.interfaces';
import Character from '@model/character.model';
import Game from '@model/game.model';
import Key from '@model/key.model';
import Position from '@model/position.model';
import ScenarioData from '@model/scenario-data.model';
import AssetCache from '@play/asset-cache.class';
import PlayCanvas from '@play/play-canvas.class';
import PlayHud from '@play/play-hud.class';
import PlayNPC from '@play/play-npc.class';
import PlayObject from '@play/play-object.class';
import PlayPlayer from '@play/play-player.class';
import PlayScenario from '@play/play-scenario.class';
import ClassMapperService from '@services/class-mapper.service';

@Injectable({
  providedIn: 'root',
})
export default class PlayService {
  private cms: ClassMapperService = inject(ClassMapperService);

  makeCanvas(): PlayCanvas {
    return new PlayCanvas();
  }

  makeScenario(
    canvas: PlayCanvas,
    mapBackground: any,
    blockers: Position[]
  ): PlayScenario {
    return new PlayScenario(canvas, mapBackground, blockers);
  }

  makePlayer(
    game: Game,
    width: number,
    height: number,
    blockWidth: number,
    blockHeight: number,
    scenario: PlayScenario,
    connections: ConnectionListInterface
  ): PlayPlayer {
    const playPlayer = new PlayPlayer(
      game.positionX,
      game.positionY,
      width,
      height,
      blockWidth,
      blockHeight,
      scenario
    );
    const character = new Character();
    character.name = game.name;
    character.attack = game.attack;
    character.defense = game.defense;
    character.health = game.maxHealth;
    character.currentHealth = game.health;
    character.money = game.money;
    character.speed = game.speed;
    character.inventory = game.items;
    character.type = -1;
    playPlayer.character = character;
    playPlayer.connections = connections;
    playPlayer.orientation = game.orientation;
    return playPlayer;
  }

  makePlayObject(
    so: ScenarioObjectInterface,
    data: ScenarioData,
    assets: AssetCache
  ): PlayObject {
    const scenarioObject = this.cms.getScenarioObject(so);
    const po = new PlayObject(
      data.x,
      data.y,
      data.scenarioObjectWidth,
      data.scenarioObjectHeight,
      scenarioObject
    );
    po.addObjectSprites(assets);

    return po;
  }

  makePlayNPC(
    c: CharacterInterface,
    data: ScenarioData,
    scenario: PlayScenario,
    assets: AssetCache
  ): PlayNPC {
    const character = this.cms.getCharacter(c);
    character.currentHealth = data.characterHealth;
    const playNPC = new PlayNPC(
      data.x,
      data.y,
      data.characterWidth,
      data.characterHeight,
      data.characterBlockWidth,
      data.characterBlockHeight,
      scenario,
      character,
      data.id
    );
    playNPC.addCharacterSprites(assets);
    // Death sprites
    playNPC.addSprite('death', assets.get('/play/death-1.png'));
    playNPC.addSprite('death', assets.get('/play/death-1.png'));
    playNPC.addSprite('death', assets.get('/play/death-2.png'));
    playNPC.addSprite('death', assets.get('/play/death-2.png'));
    playNPC.addSprite('death', assets.get('/play/death-3.png'));
    playNPC.addSprite('death', assets.get('/play/death-3.png'));
    playNPC.addSprite('death', assets.get('/play/death-4.png'));
    playNPC.addSprite('death', assets.get('/play/death-4.png'));
    playNPC.addSprite('death', assets.get('/play/death-5.png'));
    playNPC.addSprite('death', assets.get('/play/death-5.png'));
    playNPC.addSprite('death', assets.get('/play/death-6.png'));
    playNPC.addSprite('death', assets.get('/play/death-6.png'));

    return playNPC;
  }

  makeHud(
    health: number,
    currentHealth: number,
    money: number,
    canvas: PlayCanvas,
    assets: AssetCache
  ): PlayHud {
    return new PlayHud(health, currentHealth, money, canvas, assets);
  }

  keyboard(keyCode: string): Key {
    const key = new Key(keyCode);

    window.addEventListener('keydown', key.downHandler.bind(key), false);
    window.addEventListener('keyup', key.upHandler.bind(key), false);
    return key;
  }

  removeKeyboard(key: Key): void {
    window.removeEventListener('keydown', key.downHandler, false);
    window.removeEventListener('keyup', key.upHandler, false);
  }
}
