import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ScenarioObjectInterface,
  ScenarioObjectResult,
} from 'src/app/interfaces/interfaces';
import { ScenarioObject } from 'src/app/model/scenario-object.model';
import { ApiService } from 'src/app/services/api.service';
import { ClassMapperService } from 'src/app/services/class-mapper.service';

@Component({
  standalone: true,
  selector: 'game-scenario-object-picker',
  templateUrl: './scenario-object-picker.component.html',
  styleUrls: ['./scenario-object-picker.component.scss'],
  imports: [CommonModule],
})
export class ScenarioObjectPickerComponent implements OnInit {
  show: boolean = false;
  scenarioObjectList: ScenarioObject[] = [];
  selected: number = null;

  @Output() selectScenarioObjectEvent: EventEmitter<ScenarioObjectInterface> =
    new EventEmitter<ScenarioObjectInterface>();

  constructor(private as: ApiService, private cms: ClassMapperService) {}

  ngOnInit(): void {
    this.loadScenarioObjects();
  }

  showPicker(): void {
    this.show = true;
  }

  closePicker(ev: MouseEvent): void {
    ev && ev.preventDefault();
    this.show = false;
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
    this.show = false;
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
