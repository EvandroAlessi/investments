import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperNavegationComponent } from './stepper-navegation.component';

describe('StepperNavegationComponent', () => {
  let component: StepperNavegationComponent;
  let fixture: ComponentFixture<StepperNavegationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepperNavegationComponent]
    });
    fixture = TestBed.createComponent(StepperNavegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
