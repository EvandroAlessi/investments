import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundsStepperComponent } from './founds-stepper.component';

describe('FoundsStepperComponent', () => {
  let component: FoundsStepperComponent;
  let fixture: ComponentFixture<FoundsStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoundsStepperComponent]
    });
    fixture = TestBed.createComponent(FoundsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
