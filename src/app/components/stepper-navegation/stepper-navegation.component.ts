import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'investments-stepper-navegation',
  templateUrl: './stepper-navegation.component.html',
  styleUrls: ['./stepper-navegation.component.scss']
})
export class StepperNavegationComponent {
  @Input()
  hasPrevious = true;

  @Output()
  nextClick = new EventEmitter<void>();

  @Output()
  previousClick = new EventEmitter<void>();

  next(): void {
    this.nextClick.emit();
  }

  previous(): void {
    this.previousClick.emit();
  }
}
