import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { StatusResult } from 'src/app/interfaces/interfaces';
import { ScenarioResult } from 'src/app/interfaces/scenario.interfaces';
import { Key } from 'src/app/model/key.model';
import { Scenario } from 'src/app/model/scenario.model';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';
import { PlayService } from 'src/app/services/play.service';

@Component({
  standalone: true,
  selector: 'game-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['../../scss/admin.scss'],
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
})
export default class ScenariosComponent implements OnInit {
  worldId: number = null;
  scenarioList: Scenario[] = [];
  message: string = null;
  loadedScenario: Scenario = new Scenario();
  showDetail: boolean = false;
  scenarioDetailHeader: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private as: ApiService,
    private cms: ClassMapperService,
    private play: PlayService
  ) {}

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
