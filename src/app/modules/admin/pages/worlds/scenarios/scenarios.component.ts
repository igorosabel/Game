import {
  Component,
  InputSignalWithTransform,
  OnInit,
  WritableSignal,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatusResult } from '@interfaces/interfaces';
import { ScenarioResult } from '@interfaces/scenario.interfaces';
import Key from '@model/key.model';
import Scenario from '@model/scenario.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import PlayService from '@services/play.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'game-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['../../scss/admin.scss'],
  imports: [RouterLink, FormsModule, HeaderComponent],
})
export default class ScenariosComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private play: PlayService = inject(PlayService);

  worldId: InputSignalWithTransform<number, unknown> = input.required<
    number,
    unknown
  >({
    transform: numberAttribute,
  });
  scenarioList: WritableSignal<Scenario[]> = signal<Scenario[]>([]);
  message: WritableSignal<string> = signal<string>(null);
  loadedScenario: Scenario = new Scenario();
  showDetail: WritableSignal<boolean> = signal<boolean>(false);
  scenarioDetailHeader: WritableSignal<string> = signal<string>('');

  ngOnInit(): void {
    this.loadScenarios();

    const esc: Key = this.play.keyboard('Escape');
    esc.onlyEsc = true;
    esc.press = (): void => {
      this.showAddScenario();
    };
  }

  loadScenarios(): void {
    console.log('Cargando escenarios del mundo ' + this.worldId());
    this.message.set('Cargando...');
    this.as.getScenarios(this.worldId()).subscribe({
      next: (result: ScenarioResult): void => {
        if (result.status === 'ok') {
          this.message.set(null);
          this.scenarioList.set(this.cms.getScenarios(result.list));
        } else {
          this.message.set(
            'ERROR: Ocurrió un error al obtener la lista de escenarios.'
          );
        }
      },
      error: (): void => {
        this.message.set(
          'ERROR: Ocurrió un error al obtener la lista de escenarios.'
        );
      },
    });
  }

  resetLoadedScenario(): void {
    this.loadedScenario = new Scenario();
    this.loadedScenario.idWorld = this.worldId();
  }

  showAddScenario(ev: MouseEvent = null): void {
    if (ev) {
      ev.preventDefault();
    }
    if (!this.showDetail()) {
      this.resetLoadedScenario();
      this.scenarioDetailHeader.set('Nuevo escenario');

      this.showDetail.set(true);
    } else {
      this.showDetail.set(false);
    }
  }

  saveScenario(): void {
    let validate: boolean = true;
    if (
      (this.loadedScenario.name === null || this.loadedScenario.name) === ''
    ) {
      validate = false;
      alert('¡No puedes dejar el nombre del escenario en blanco!');
    }

    if (validate) {
      this.as.saveScenario(this.loadedScenario.toInterface()).subscribe({
        next: (result: StatusResult): void => {
          if (result.status == 'ok') {
            this.showAddScenario();
            this.loadScenarios();
          } else {
            alert('¡Ocurrió un error al guardar el escenario!');
            this.message.set(
              'ERROR: Ocurrió un error al guardar el escenario.'
            );
          }
        },
        error: (): void => {
          this.message.set('ERROR: Ocurrió un error al guardar el escenario.');
        },
      });
    }
  }

  editScenario(scenario: Scenario): void {
    this.loadedScenario = new Scenario(
      scenario.id,
      scenario.idWorld,
      scenario.name,
      scenario.startX,
      scenario.startY,
      scenario.initial,
      scenario.friendly
    );

    this.scenarioDetailHeader.set('Editar escenario');
    this.showDetail.set(true);
  }

  deleteScenario(scenario: Scenario): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar el escenario "' + scenario.name + '"?'
    );
    if (conf) {
      this.as.deleteScenario(scenario.id).subscribe({
        next: (result: StatusResult): void => {
          if (result.status === 'ok') {
            this.loadScenarios();
          } else {
            alert('¡Ocurrio un error al borrar el escenario!');
            this.message.set('ERROR: Ocurrió un error al borrar el escenario.');
          }
        },
        error: (): void => {
          this.message.set('¡Ocurrio un error al borrar el escenario!');
        },
      });
    }
  }
}
