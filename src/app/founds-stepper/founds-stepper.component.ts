import { Component } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { SynchronyService } from '../services/synchrony.service';

@Component({
  selector: 'investments-founds-stepper',
  templateUrl: './founds-stepper.component.html',
  styleUrls: ['./founds-stepper.component.scss']
})
export class FoundsStepperComponent {

  constructor(private synchronyService: SynchronyService) { }

  selectionChanged(event: StepperSelectionEvent) {
    if (event.selectedIndex == 3) {
      this.synchronyService.updateChart();
    }
  }
}
