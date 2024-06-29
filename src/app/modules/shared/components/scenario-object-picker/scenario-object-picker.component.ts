import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
  OutputEmitterRef,
  WritableSignal,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  ScenarioObjectInterface,
  ScenarioObjectResult,
} from '@interfaces/scenario.interfaces';
import ScenarioObject from '@model/scenario-object.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';

@Component({
  standalone: true,
  selector: 'game-scenario-object-picker',
  templateUrl: './scenario-object-picker.component.html',
  styleUrls: ['./scenario-object-picker.component.scss'],
  imports: [NgClass],
})
export default class ScenarioObjectPickerComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private cms: ClassMapperService = inject(ClassMapperService);

  show: WritableSignal<boolean> = signal<boolean>(false);
  scenarioObjectList: ScenarioObject[] = [];
  selected: number = null;

  selectScenarioObjectEvent: OutputEmitterRef<ScenarioObjectInterface> =
    output<ScenarioObjectInterface>();

  ngOnInit(): void {
    this.loadScenarioObjects();
  }

  showPicker(): void {
    this.show.set(true);
  }

  closePicker(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.show.set(false);
  }

  loadScenarioObjects(): void {
    this.as
      .getScenarioObjects()
      .subscribe((result: ScenarioObjectResult): void => {
        if (result.status == 'ok') {
          this.scenarioObjectList = this.cms.getScenarioObjects(result.list);
        }
      });
  }

  selectScenarioObject(scenarioObject: ScenarioObject): void {
    this.selected = scenarioObject.id;
    const selectedScenarioObject: ScenarioObjectInterface =
      scenarioObject.toInterface();
    this.show.set(false);
    this.selectScenarioObjectEvent.emit(selectedScenarioObject);
  }

  resetSelected(): void {
    this.selected = null;
  }

  getScenarioObjectById(id: number): ScenarioObjectInterface {
    const scenarioObjectFind: ScenarioObject[] = this.scenarioObjectList.filter(
      (x: ScenarioObject): boolean => x.id === id
    );
    if (scenarioObjectFind.length == 0) {
      return null;
    } else {
      return scenarioObjectFind[0].toInterface();
    }
  }
}
