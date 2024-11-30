import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
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
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private play: PlayService = inject(PlayService);

  worldId: number = null;
  scenarioList: Scenario[] = [];
  message: string = null;
  loadedScenario: Scenario = new Scenario();
  showDetail: boolean = false;
  scenarioDetailHeader: string = '';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.worldId = params.id_world;
      this.loadScenarios();

      const esc: Key = this.play.keyboard('Escape');
      esc.onlyEsc = true;
      esc.press = (): void => {
        this.showAddScenario();
      };
    });
  }

  loadScenarios(): void {
    this.message = 'Cargando...';
    this.as
      .getScenarios(this.worldId)
      .subscribe((result: ScenarioResult): void => {
        if (result.status == 'ok') {
          this.message = null;
          this.scenarioList = this.cms.getScenarios(result.list);
        } else {
          this.message =
            'ERROR: Ocurrió un error al obtener la lista de escenarios.';
        }
      });
  }

  resetLoadedScenario(): void {
    this.loadedScenario = new Scenario();
    this.loadedScenario.idWorld = this.worldId;
  }

  showAddScenario(ev: MouseEvent = null): void {
    ev && ev.preventDefault();
    if (!this.showDetail) {
      this.resetLoadedScenario();
      this.scenarioDetailHeader = 'Nuevo escenario';

      this.showDetail = true;
    } else {
      this.showDetail = false;
    }
  }

  saveScenario(): void {
    let validate: boolean = true;
    if (this.loadedScenario.name == '') {
      validate = false;
      alert('¡No puedes dejar el nombre del escenario en blanco!');
    }

    if (validate) {
      this.as
        .saveScenario(this.loadedScenario.toInterface())
        .subscribe((result: StatusResult): void => {
          if (result.status == 'ok') {
            this.showAddScenario();
            this.loadScenarios();
          } else {
            alert('¡Ocurrió un error al guardar el escenario!');
            this.message = 'ERROR: Ocurrió un error al guardar el escenario.';
          }
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

    this.scenarioDetailHeader = 'Editar escenario';
    this.showDetail = true;
  }

  deleteScenario(scenario: Scenario): void {
    const conf: boolean = confirm(
      '¿Estás seguro de querer borrar el escenario "' + scenario.name + '"?'
    );
    if (conf) {
      this.as
        .deleteScenario(scenario.id)
        .subscribe((result: StatusResult): void => {
          if (result.status == 'ok') {
            this.loadScenarios();
          } else {
            alert('¡Ocurrio un error al borrar el escenario!');
            this.message = 'ERROR: Ocurrió un error al borrar el escenario.';
          }
        });
    }
  }
}
